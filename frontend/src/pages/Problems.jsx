import React, { useState, useEffect } from 'react';
import { useProblems } from '../context/ProblemContext';
import ProblemCard from '../components/ProblemCard';
import ProblemModal from '../components/ProblemModal';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

const PREDEFINED_TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Stacks & Queues', 'Trees', 'Graphs', 
  'DP', 'Greedy', 'Recursion & Backtracking', 'Binary Search', 'Trie', 
  'Heaps', 'Sliding Window', 'Bit Manipulation', 'Math', 'Other'
];

const PREDEFINED_PLATFORMS = [
  'LeetCode', 'Codeforces', 'GeeksForGeeks', 'HackerRank', 'CodeChef', 'Other'
];

const Problems = () => {
  const { problems, loading, filters, setFilters, clearFilters, deleteProblem, page, setPageState, pagination } = useProblems();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  // Search input state to avoid immediate api triggers on every keystroke
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Bounce search query to global filter state
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };

  const handleAddClick = () => {
    setEditingProblem(null);
    setModalOpen(true);
  };

  const handleEditClick = (problem) => {
    setEditingProblem(problem);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      await deleteProblem(id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            DSA Problem Logs
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track and search solved challenges to organize revision lists.
          </p>
        </div>
        <button
          id="btn-add-problem-trigger"
          onClick={handleAddClick}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-705 active:bg-indigo-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/10"
        >
          <FiPlus className="h-4.5 w-4.5" />
          <span>Track Problem</span>
        </button>
      </div>

      {/* Advanced Filters Panel */}
      <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-4">
        {/* Row 1: Search & Common Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="inp-filter-search"
              type="text"
              placeholder="Search title, platform, topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-850 dark:text-slate-100 text-sm"
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              id="sel-filter-difficulty"
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-sm"
            >
              <option value="">Any Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <select
              id="sel-filter-topic"
              name="topic"
              value={filters.topic}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-sm"
            >
              <option value="">Any Topic</option>
              {PREDEFINED_TOPICS.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Platform Filter */}
          <div>
            <select
              id="sel-filter-platform"
              name="platform"
              value={filters.platform}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-sm"
            >
              <option value="">Any Platform</option>
              {PREDEFINED_PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Starred & Date range */}
        <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-slate-100/50 dark:border-slate-800/40">
          {/* Starred */}
          <div className="w-full sm:w-auto">
            <select
              id="sel-filter-starred"
              name="starred"
              value={filters.starred}
              onChange={handleFilterChange}
              className="w-full sm:w-44 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-sm"
            >
              <option value="">All Problems</option>
              <option value="true">Starred Only</option>
            </select>
          </div>

          {/* Date range inputs */}
          <div className="flex flex-1 items-center space-x-2 min-w-[280px]">
            <input
              id="inp-filter-start-date"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-xs md:text-sm"
              title="Start Date"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              id="inp-filter-end-date"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-xs md:text-sm"
              title="End Date"
            />
          </div>

          {/* Reset / clear button */}
          <button
            id="btn-clear-filters"
            onClick={() => {
              setSearchTerm('');
              clearFilters();
            }}
            className="flex-shrink-0 flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-650 bg-indigo-50 hover:bg-indigo-100/60 dark:bg-indigo-950/20 dark:text-indigo-400 transition-colors"
          >
            <FiRefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Problems log listing */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : problems.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="problems-grid">
            {problems.map((problem) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-900/60 glass-panel rounded-2xl shadow-sm">
              <button
                id="btn-prev-page"
                disabled={page <= 1}
                onClick={() => setPageState(page - 1)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                Previous
              </button>
              <span className="text-xs sm:text-sm font-medium text-slate-550 dark:text-slate-405">
                Page <strong className="text-slate-855 dark:text-slate-200">{page}</strong> of <strong>{pagination.pages}</strong>
              </span>
              <button
                id="btn-next-page"
                disabled={page >= pagination.pages}
                onClick={() => setPageState(page + 1)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center space-y-4">
          <FiAlertTriangle className="h-12 w-12 text-indigo-550/80" />
          <div className="space-y-1">
            <h4 className="font-outfit text-lg font-bold text-slate-800 dark:text-slate-200">
              No problems found
            </h4>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm">
              We couldn't find any solved problems matching the selected filters. Add a problem or reset filters to begin.
            </p>
          </div>
        </div>
      )}

      {/* Problem add/edit dialog */}
      <ProblemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingProblem={editingProblem}
      />
    </div>
  );
};

export default Problems;
