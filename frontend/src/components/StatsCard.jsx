import React from 'react';

const StatsCard = ({ title, value, icon, colorClass, subtitle, id }) => {
  return (
    <div
      id={id}
      className="glass-panel hover-card rounded-2xl p-6 flex items-center justify-between shadow-sm"
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </p>
        <h3 className="font-outfit text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
