import React from 'react';

export function StatusBadge({ status }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'active':
      case 'ongoing':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'graduated':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'ended':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'on_leave') {
      return 'On Leave';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}