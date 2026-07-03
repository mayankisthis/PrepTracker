import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLayout, FiList, FiLogOut, FiSun, FiMoon, FiMenu, FiX, FiAward } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FiLayout className="mr-3 h-5 w-5" /> },
    { name: 'Problem List', path: '/problems', icon: <FiList className="mr-3 h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col bg-white/80 dark:bg-slate-900/80 glass-panel transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <FiAward className="h-5 w-5" />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              PrepTracker
            </span>
          </div>
          <button
            id="btn-close-sidebar-mobile"
            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            onClick={toggleSidebar}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              id={`sidebar-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:shadow-none'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100'
                }`
              }
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200/50 p-4 dark:border-slate-800/50 space-y-4">
          {/* User profile info */}
          {user && (
            <div className="flex items-center px-2 py-1">
              <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold font-outfit uppercase">
                {user.username.charAt(0)}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-200">{user.username}</p>
                <p className="text-xs text-slate-500 truncate dark:text-slate-400">{user.email}</p>
              </div>
            </div>
          )}

          {/* Theme toggle & Logout */}
          <div className="flex items-center justify-between gap-2 px-2">
            <button
              id="btn-theme-toggle"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors dark:bg-slate-850 dark:text-slate-400 dark:hover:bg-slate-800"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            <button
              id="btn-logout"
              onClick={logout}
              className="flex-1 flex items-center justify-center h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-medium text-sm dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
              title="Logout"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
