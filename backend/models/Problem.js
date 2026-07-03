import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true,
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    trim: true,
  },
  problemUrl: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty is required'],
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
  },
  solvedDate: {
    type: Date,
    default: Date.now,
  },
  timeTaken: {
    type: Number, // in minutes
    required: false,
  },
  hintsUsed: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 1,
  },
  personalNotes: {
    type: String,
    trim: true,
  },
  revisionStatus: {
    type: String,
    enum: ['Need to Revise', 'Revising', 'Mastered'],
    default: 'Need to Revise',
  },
  starred: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
