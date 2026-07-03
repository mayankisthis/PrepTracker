import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProblems } from '../context/ProblemContext';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiZap } from 'react-icons/fi';

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { dashboardStats } = useProblems();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard Overview';
      case '/problems':
        return 'Problem Tracker';
      default:
        return 'PrepTracker';
    }
  };

  const streak = dashboardStats?.currentStreak || 0;
  const longestStreak = dashboardStats?.longestStreak || 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 px-6 backdrop-blur-md">
      {/* Page Title & Mobile Menu Button */}
      <div className="flex items-center space-x-3">
        <button
          id="btn-sidebar-mobile-toggle"
          className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        <h1 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100 md:text-2xl">
          {getPageTitle()}
        </h1>
      </div>

      {/* Streak Tracker & Profile */}
      <div className="flex items-center space-x-4">
        {/* Current & Longest Streak */}
        <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 px-3 py-1.5 rounded-xl">
          <FiZap className={`h-4 w-4 ${streak > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
          <div className="text-xs md:text-sm font-semibold text-amber-700 dark:text-amber-400">
            <span>Streak: <strong id="val-navbar-current-streak">{streak}</strong> d</span>
            <span className="hidden md:inline text-amber-600/60 dark:text-amber-500/40 mx-2">|</span>
            <span className="hidden md:inline text-amber-600 dark:text-amber-500/80">Max: {longestStreak}d</span>
          </div>
        </div>

        {/* User Greeting (Desktop) */}
        {user && (
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs text-slate-400 dark:text-slate-500">Welcome back,</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-250">{user.username}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
