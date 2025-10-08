import React from 'react';

export function StatsCard({ title, value, icon: Icon, change, changeType = 'positive' }) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="h-8 w-8 text-gray-400">
            <Icon className="h-full w-full" />
          </div>
        )}
      </div>
    </div>
  );
}