import Problem from '../models/Problem.js';


const getLocalDateString = (date) => {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

const calculateStreaks = (uniqueDatesSortedDesc) => {
  if (uniqueDatesSortedDesc.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dateSet = new Set(uniqueDatesSortedDesc);
  const localToday = getLocalDateString(new Date());
  const localYesterday = getLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
  
  let currentStreak = 0;
  let checkDate = null;
  
  if (dateSet.has(localToday)) {
    checkDate = new Date(localToday);
  } else if (dateSet.has(localYesterday)) {
    checkDate = new Date(localYesterday);
  }
  
  if (checkDate) {
    while (true) {
      const dateStr = getLocalDateString(checkDate);
      if (dateSet.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }
  
  let longestStreak = 0;
  let tempStreak = 0;
  let lastCheckedDate = null;
  
  const uniqueDatesSortedAsc = [...uniqueDatesSortedDesc].reverse();
  
  for (let i = 0; i < uniqueDatesSortedAsc.length; i++) {
    const currentDate = new Date(uniqueDatesSortedAsc[i]);
    
    if (lastCheckedDate === null) {
      tempStreak = 1;
    } else {
      const diffTime = Math.abs(currentDate - lastCheckedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    lastCheckedDate = currentDate;
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return { currentStreak, longestStreak };
};

// @desc    Get dashboard summary statistics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all problems for the user
    const problems = await Problem.find({ user: userId });

    const totalSolved = problems.length;

    // Calculate dates
    const localTodayStr = getLocalDateString(new Date());
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const startOfCalendarMonth = new Date();
    startOfCalendarMonth.setDate(1);
    startOfCalendarMonth.setHours(0, 0, 0, 0);

    let solvedToday = 0;
    let solvedThisWeek = 0;
    let solvedThisMonth = 0;
    let totalSolveTime = 0;
    let problemsWithTime = 0;

    const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
    const topicCounts = {};

    const datesSolved = [];

    problems.forEach((problem) => {
      const probLocalDateStr = getLocalDateString(problem.solvedDate);
      datesSolved.push(probLocalDateStr);

      // Solved today
      if (probLocalDateStr === localTodayStr) {
        solvedToday++;
      }

      // Solved this week (rolling last 7 days)
      if (problem.solvedDate >= oneWeekAgo) {
        solvedThisWeek++;
      }

      // Solved this calendar month
      if (problem.solvedDate >= startOfCalendarMonth) {
        solvedThisMonth++;
      }

      // Avg solve time tracking
      if (problem.timeTaken !== undefined && problem.timeTaken !== null) {
        totalSolveTime += problem.timeTaken;
        problemsWithTime++;
      }

      // Difficulty distribution
      if (difficultyCounts[problem.difficulty] !== undefined) {
        difficultyCounts[problem.difficulty]++;
      }

      // Topic distribution
      topicCounts[problem.topic] = (topicCounts[problem.topic] || 0) + 1;
    });

    // Unique sorted dates desc for streak calculation
    const uniqueDatesSortedDesc = [...new Set(datesSolved)].sort((a, b) => b.localeCompare(a));
    const { currentStreak, longestStreak } = calculateStreaks(uniqueDatesSortedDesc);

    const averageSolvingTime = problemsWithTime > 0 ? Math.round(totalSolveTime / problemsWithTime) : 0;

    return res.json({
      totalSolved,
      solvedToday,
      solvedThisWeek,
      solvedThisMonth,
      currentStreak,
      longestStreak,
      difficultyDistribution: {
        counts: difficultyCounts,
        percentages: totalSolved > 0 ? {
          Easy: Math.round((difficultyCounts.Easy / totalSolved) * 100),
          Medium: Math.round((difficultyCounts.Medium / totalSolved) * 100),
          Hard: Math.round((difficultyCounts.Hard / totalSolved) * 100),
        } : { Easy: 0, Medium: 0, Hard: 0 }
      },
      topicDistribution: topicCounts,
      averageSolvingTime,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

