import React from 'react';

export function StatsCard({ title, value, icon: Icon, change, changeType = 'positive' }) {
  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs sm:text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 flex-shrink-0 ml-3">
            <Icon className="h-full w-full" />
          </div>
        )}
      </div>
    </div>
  );
}