import React, { useState } from 'react';
import { FiStar, FiExternalLink, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiClock, FiLayers } from 'react-icons/fi';
import { useProblems } from '../context/ProblemContext';

const ProblemCard = ({ problem, onEdit, onDelete }) => {
  const { toggleStarProblem } = useProblems();
  const [showNotes, setShowNotes] = useState(false);
  const [starLoading, setStarLoading] = useState(false);

  const handleStarToggle = async (e) => {
    e.stopPropagation();
    setStarLoading(true);
    await toggleStarProblem(problem._id, problem.starred);
    setStarLoading(false);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/30';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/30';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-350';
    }
  };

  const getRevisionColor = (status) => {
    switch (status) {
      case 'Mastered':
        return 'bg-emerald-50/70 text-emerald-600 dark:bg-emerald-950/10 dark:text-emerald-500';
      case 'Revising':
        return 'bg-indigo-50/75 text-indigo-600 dark:bg-indigo-950/10 dark:text-indigo-400';
      case 'Need to Revise':
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400';
    }
  };

  const formattedDate = new Date(problem.solvedDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="glass-panel hover-card rounded-2xl p-5 shadow-sm space-y-4 border border-slate-200/50 dark:border-slate-800/50">
      {/* Title, Platform & Star */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {problem.platform}
            </span>
          </div>
          
          <h4 className="font-outfit text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug break-words">
            {problem.title}
          </h4>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            id={`btn-star-problem-${problem._id}`}
            onClick={handleStarToggle}
            disabled={starLoading}
            className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
              problem.starred
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
            }`}
            title={problem.starred ? 'Starred' : 'Star Problem'}
          >
            <FiStar className={`h-4.5 w-4.5 ${problem.starred ? 'fill-amber-500' : ''}`} />
          </button>
          
          {problem.problemUrl && (
            <a
              id={`lnk-external-problem-${problem._id}`}
              href={problem.problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-slate-800 transition-colors"
              title="Open problem link"
            >
              <FiExternalLink className="h-4.5 w-4.5" />
            </a>
          )}
        </div>
      </div>

      {/* Meta Specs */}
      <div className="grid grid-cols-2 gap-3 py-1 text-xs border-y border-slate-100 dark:border-slate-800/40 text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1.5">
          <FiLayers className="text-slate-400" />
          <span className="truncate">Topic: <strong className="text-slate-700 dark:text-slate-350">{problem.topic}</strong></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <FiClock className="text-slate-400" />
          <span>Solved: {formattedDate}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span>Time: <strong className="text-slate-700 dark:text-slate-350">{problem.timeTaken || '--'} min</strong></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span>Attempts: <strong className="text-slate-700 dark:text-slate-350">{problem.attempts}</strong></span>
        </div>
      </div>

      {/* Revision badge & control actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border border-slate-200/10 ${getRevisionColor(problem.revisionStatus)}`}>
          {problem.revisionStatus}
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            id={`btn-edit-problem-${problem._id}`}
            onClick={() => onEdit(problem)}
            className="p-1.5 rounded-lg text-slate-450 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Edit problem"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
          </button>
          
          <button
            id={`btn-delete-problem-${problem._id}`}
            onClick={() => onDelete(problem._id)}
            className="p-1.5 rounded-lg text-slate-450 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
            title="Delete problem"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>

          {(problem.personalNotes || problem.hintsUsed) && (
            <button
              id={`btn-notes-toggle-${problem._id}`}
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 ml-1"
            >
              {showNotes ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
              <span className="hidden sm:inline ml-0.5">{showNotes ? 'Hide' : 'Notes'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Notes section */}
      {showNotes && (problem.personalNotes || problem.hintsUsed) && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
          {problem.hintsUsed && (
            <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Hints were used during solve</span>
            </div>
          )}
          {problem.personalNotes && (
            <div className="text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line">
              <strong className="text-slate-500 dark:text-slate-450 block mb-0.5">Personal Notes:</strong>
              {problem.personalNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemCard;
