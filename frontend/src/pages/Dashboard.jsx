import React, { useEffect } from 'react';
import { useProblems } from '../context/ProblemContext';
import StatsCard from '../components/StatsCard';
import { FiAward, FiCalendar, FiZap, FiClock, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { dashboardStats, statsLoading, fetchDashboardStats } = useProblems();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (statsLoading && !dashboardStats) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Fallbacks
  const stats = dashboardStats || {
    totalSolved: 0,
    solvedToday: 0,
    solvedThisWeek: 0,
    solvedThisMonth: 0,
    currentStreak: 0,
    longestStreak: 0,
    difficultyDistribution: { counts: { Easy: 0, Medium: 0, Hard: 0 }, percentages: { Easy: 0, Medium: 0, Hard: 0 } },
    topicDistribution: {},
    averageSolvingTime: 0,
  };

  const difficultyData = [
    { name: 'Easy', value: stats.difficultyDistribution.counts.Easy, color: '#10b981' },
    { name: 'Medium', value: stats.difficultyDistribution.counts.Medium, color: '#f59e0b' },
    { name: 'Hard', value: stats.difficultyDistribution.counts.Hard, color: '#f43f5e' },
  ].filter(item => item.value > 0);

  // If no data, provide a placeholder for the pie chart
  const emptyDifficultyData = [{ name: 'No Problems Solved', value: 1, color: '#94a3b8' }];
  const useEmptyDifficulty = difficultyData.length === 0;

  // Topic distribution chart data
  const topicData = Object.entries(stats.topicDistribution)
    .map(([topic, count]) => ({ name: topic, Count: count }))
    .sort((a, b) => b.Count - a.Count)
    .slice(0, 10); // Show top 10 solved topics

  // Motivational quote / advice
  const getMotivationalTip = () => {
    const total = stats.totalSolved;
    if (total === 0) {
      return "Ready to kickstart your coding journey? Click 'Problem List' to add your first solved challenge!";
    }
    const streak = stats.currentStreak;
    if (streak > 0) {
      return `Awesome! You have maintained a ${streak}-day solving streak. Keep the fire burning today!`;
    }
    return "Great achievements are built day by day. Tackle a new DSA problem today and start a streak!";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="space-y-1.5">
          <h2 className="font-outfit text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            DSA Preparation Dashboard
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            {getMotivationalTip()}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200/30 px-4 py-2.5 rounded-2xl flex-shrink-0 self-start md:self-auto">
          <FiCheckSquare className="h-5 w-5 text-indigo-650 dark:text-indigo-400" />
          <span className="text-xs md:text-sm font-semibold text-indigo-700 dark:text-indigo-400">
            Keep pushing forward!
          </span>
        </div>
      </div>

      {/* Grid of micro-stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          id="card-stat-total"
          title="Total Solved"
          value={stats.totalSolved}
          icon={<FiAward className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
          colorClass="bg-indigo-50 dark:bg-indigo-950/30"
          subtitle="All-time solved tasks"
        />
        <StatsCard
          id="card-stat-streak"
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          icon={<FiZap className="h-6 w-6 text-amber-500 fill-amber-500" />}
          colorClass="bg-amber-50 dark:bg-amber-950/30"
          subtitle={`Best: ${stats.longestStreak} days`}
        />
        <StatsCard
          id="card-stat-recent"
          title="Solved Today"
          value={stats.solvedToday}
          icon={<FiCalendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
          colorClass="bg-emerald-50 dark:bg-emerald-950/30"
          subtitle={`This week: ${stats.solvedThisWeek}`}
        />
        <StatsCard
          id="card-stat-time"
          title="Avg Solve Time"
          value={`${stats.averageSolvingTime} min`}
          icon={<FiClock className="h-6 w-6 text-sky-600 dark:text-sky-400" />}
          colorClass="bg-sky-50 dark:bg-sky-950/30"
          subtitle={`This month: ${stats.solvedThisMonth}`}
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Difficulty Distribution Pie Chart (2/5 size) */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              Difficulty Split
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Easy, Medium, and Hard problem distribution percentage.
            </p>
          </div>
          
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={useEmptyDifficulty ? emptyDifficultyData : difficultyData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(useEmptyDifficulty ? emptyDifficultyData : difficultyData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => useEmptyDifficulty ? [0, 'Problems'] : [value, 'Problems']}
                  contentStyle={{ borderRadius: '12px', border: '0', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  formatter={(value) => <span className="text-xs text-slate-605 dark:text-slate-400 font-semibold">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic distribution bar chart (3/5 size) */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between lg:col-span-3">
          <div>
            <h3 className="font-outfit text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              Top Solved Topics
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              High count topic areas (shows top 10 sorted topics).
            </p>
          </div>

          <div className="h-72 w-full">
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: '0', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                  />
                  <Bar dataKey="Count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
                <FiAlertCircle className="h-8 w-8 text-slate-350" />
                <span className="text-xs font-semibold">No topics recorded. Add problems to display chart.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
