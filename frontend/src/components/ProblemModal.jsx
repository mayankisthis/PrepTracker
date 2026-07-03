import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useProblems } from '../context/ProblemContext';

const PREDEFINED_TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Stacks & Queues', 'Trees', 'Graphs', 
  'DP', 'Greedy', 'Recursion & Backtracking', 'Binary Search', 'Trie', 
  'Heaps', 'Sliding Window', 'Bit Manipulation', 'Math', 'Other'
];

const PREDEFINED_PLATFORMS = [
  'LeetCode', 'Codeforces', 'GeeksForGeeks', 'HackerRank', 'CodeChef', 'Other'
];

const ProblemModal = ({ isOpen, onClose, editingProblem = null }) => {
  const { addProblem, editProblem } = useProblems();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    customPlatform: '',
    problemUrl: '',
    difficulty: 'Easy',
    topic: 'Arrays',
    customTopic: '',
    solvedDate: new Date().toISOString().split('T')[0],
    timeTaken: '',
    hintsUsed: false,
    attempts: 1,
    personalNotes: '',
    revisionStatus: 'Need to Revise',
    starred: false,
  });

  // Populate data when editing
  useEffect(() => {
    if (editingProblem) {
      const isCustomPlatform = !PREDEFINED_PLATFORMS.includes(editingProblem.platform);
      const isCustomTopic = !PREDEFINED_TOPICS.includes(editingProblem.topic);

      setFormData({
        title: editingProblem.title,
        platform: isCustomPlatform ? 'Other' : editingProblem.platform,
        customPlatform: isCustomPlatform ? editingProblem.platform : '',
        problemUrl: editingProblem.problemUrl || '',
        difficulty: editingProblem.difficulty,
        topic: isCustomTopic ? 'Other' : editingProblem.topic,
        customTopic: isCustomTopic ? editingProblem.topic : '',
        solvedDate: new Date(editingProblem.solvedDate).toISOString().split('T')[0],
        timeTaken: editingProblem.timeTaken || '',
        hintsUsed: editingProblem.hintsUsed || false,
        attempts: editingProblem.attempts || 1,
        personalNotes: editingProblem.personalNotes || '',
        revisionStatus: editingProblem.revisionStatus || 'Need to Revise',
        starred: editingProblem.starred || false,
      });
    } else {
      // Reset form
      setFormData({
        title: '',
        platform: 'LeetCode',
        customPlatform: '',
        problemUrl: '',
        difficulty: 'Easy',
        topic: 'Arrays',
        customTopic: '',
        solvedDate: new Date().toISOString().split('T')[0],
        timeTaken: '',
        hintsUsed: false,
        attempts: 1,
        personalNotes: '',
        revisionStatus: 'Need to Revise',
        starred: false,
      });
    }
    setError('');
  }, [editingProblem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.title.trim()) {
      setError('Problem Title is required');
      return;
    }

    const finalPlatform = formData.platform === 'Other' ? formData.customPlatform.trim() : formData.platform;
    if (!finalPlatform) {
      setError('Platform is required');
      return;
    }

    const finalTopic = formData.topic === 'Other' ? formData.customTopic.trim() : formData.topic;
    if (!finalTopic) {
      setError('Topic is required');
      return;
    }

    const payload = {
      ...formData,
      platform: finalPlatform,
      topic: finalTopic,
      timeTaken: formData.timeTaken ? Number(formData.timeTaken) : undefined,
      attempts: Number(formData.attempts),
    };

    setLoading(true);
    let result;
    if (editingProblem) {
      result = await editProblem(editingProblem._id, payload);
    } else {
      result = await addProblem(payload);
    }
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div 
        className="glass-panel w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] transition-transform duration-300 border border-slate-200/50 dark:border-slate-800/50"
        id="problem-modal-container"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <h3 className="font-outfit text-lg md:text-xl font-bold text-slate-850 dark:text-slate-100">
            {editingProblem ? 'Edit Solved Problem' : 'Track New Problem'}
          </h3>
          <button
            id="btn-close-problem-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm rounded-xl bg-rose-50 text-rose-605 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Problem Title *</label>
            <input
              id="inp-problem-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Two Sum"
              className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Platform *</label>
              <select
                id="sel-problem-platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              >
                {PREDEFINED_PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {formData.platform === 'Other' && (
                <input
                  id="inp-custom-platform"
                  type="text"
                  name="customPlatform"
                  value={formData.customPlatform}
                  onChange={handleChange}
                  placeholder="Enter Platform Name"
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                />
              )}
            </div>

            {/* Topic */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Topic *</label>
              <select
                id="sel-problem-topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              >
                {PREDEFINED_TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {formData.topic === 'Other' && (
                <input
                  id="inp-custom-topic"
                  type="text"
                  name="customTopic"
                  value={formData.customTopic}
                  onChange={handleChange}
                  placeholder="Enter Topic Name"
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                />
              )}
            </div>

            {/* Problem URL */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Problem URL</label>
              <input
                id="inp-problem-url"
                type="url"
                name="problemUrl"
                value={formData.problemUrl}
                onChange={handleChange}
                placeholder="e.g. https://leetcode.com/problems/two-sum"
                className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Difficulty *</label>
              <select
                id="sel-problem-difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Solved Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Solved Date</label>
              <input
                id="inp-solved-date"
                type="date"
                name="solvedDate"
                value={formData.solvedDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Time Taken */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Time Taken (minutes)</label>
              <input
                id="inp-time-taken"
                type="number"
                name="timeTaken"
                min="0"
                value={formData.timeTaken}
                onChange={handleChange}
                placeholder="e.g. 20"
                className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Attempts */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Attempts</label>
              <input
                id="inp-attempts-count"
                type="number"
                name="attempts"
                min="1"
                value={formData.attempts}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Revision Status */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Revision Status</label>
              <select
                id="sel-revision-status"
                name="revisionStatus"
                value={formData.revisionStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Need to Revise">Need to Revise</option>
                <option value="Revising">Revising</option>
                <option value="Mastered">Mastered</option>
              </select>
            </div>

            {/* Checkboxes: Hints & Starred */}
            <div className="flex items-center space-x-6 pt-5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  id="chk-hints-used"
                  type="checkbox"
                  name="hintsUsed"
                  checked={formData.hintsUsed}
                  onChange={handleChange}
                  className="rounded text-indigo-650 bg-slate-100 border-0 focus:ring-indigo-500 dark:bg-slate-800"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-350">Used Hints</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  id="chk-problem-starred"
                  type="checkbox"
                  name="starred"
                  checked={formData.starred}
                  onChange={handleChange}
                  className="rounded text-indigo-650 bg-slate-100 border-0 focus:ring-indigo-500 dark:bg-slate-800"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-350">Star Problem</span>
              </label>
            </div>
          </div>

          {/* Personal Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Personal Notes & Thoughts</label>
            <textarea
              id="inp-personal-notes"
              name="personalNotes"
              value={formData.personalNotes}
              onChange={handleChange}
              rows="3"
              placeholder="Record any interesting findings, edge cases, space/time complexity notes, etc."
              className="w-full px-4 py-2 rounded-xl bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:bg-slate-800 dark:text-slate-100 resize-none"
            />
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <button
              id="btn-cancel-modal"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-605 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-problem"
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-705 active:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-500/10 flex items-center justify-center transition-colors"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : editingProblem ? (
                'Save Changes'
              ) : (
                'Add Problem'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProblemModal;
