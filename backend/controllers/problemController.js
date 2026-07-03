import Problem from '../models/Problem.js';

// @desc    Get all problems for authenticated user with filters and search
// @route   GET /api/problems
// @access  Private
export const getProblems = async (req, res) => {
  try {
    const query = { user: req.user._id };

    // Filtering by topic
    if (req.query.topic) {
      query.topic = req.query.topic;
    }

    // Filtering by difficulty
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    // Filtering by platform
    if (req.query.platform) {
      query.platform = req.query.platform;
    }

    // Filtering by starred status
    if (req.query.starred) {
      query.starred = req.query.starred === 'true';
    }

    // Filtering by date range
    if (req.query.startDate || req.query.endDate) {
      query.solvedDate = {};
      if (req.query.startDate) {
        query.solvedDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const end = new Date(req.query.endDate);
        end.setHours(23, 59, 59, 999);
        query.solvedDate.$lte = end;
      }
    }

    // Searching by title, topic, or platform
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { topic: searchRegex },
        { platform: searchRegex },
      ];
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .sort({ solvedDate: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      problems,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single problem details
// @route   GET /api/problems/:id
// @access  Private
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check user ownership
    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    return res.json(problem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a solved problem
// @route   POST /api/problems
// @access  Private
export const createProblem = async (req, res) => {
  const {
    title,
    platform,
    problemUrl,
    difficulty,
    topic,
    solvedDate,
    timeTaken,
    hintsUsed,
    attempts,
    personalNotes,
    revisionStatus,
    starred,
  } = req.body;

  try {
    if (!title || !platform || !difficulty || !topic) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const problem = new Problem({
      user: req.user._id,
      title,
      platform,
      problemUrl,
      difficulty,
      topic,
      solvedDate: solvedDate || new Date(),
      timeTaken,
      hintsUsed: hintsUsed || false,
      attempts: attempts || 1,
      personalNotes,
      revisionStatus: revisionStatus || 'Need to Revise',
      starred: starred || false,
    });

    const createdProblem = await problem.save();
    return res.status(201).json(createdProblem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update a solved problem
// @route   PUT /api/problems/:id
// @access  Private
export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check user ownership
    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update fields
    const fieldsToUpdate = [
      'title', 'platform', 'problemUrl', 'difficulty', 'topic',
      'solvedDate', 'timeTaken', 'hintsUsed', 'attempts',
      'personalNotes', 'revisionStatus', 'starred'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        problem[field] = req.body[field];
      }
    });

    const updatedProblem = await problem.save();
    return res.json(updatedProblem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a solved problem
// @route   DELETE /api/problems/:id
// @access  Private
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check user ownership
    if (problem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Problem.deleteOne({ _id: req.params.id });
    return res.json({ message: 'Problem removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
