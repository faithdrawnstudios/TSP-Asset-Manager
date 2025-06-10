import React from 'react';

interface BadgeProps {
  text: string;
  color?: 'default' | 'success' | 'warning' | 'error';
}

const Badge: React.FC<BadgeProps> = ({ text, color = 'default' }) => {
  const colorClasses = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    error: 'bg-red-200 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${colorClasses[color]}`}>
      {text}
    </span>
  );
};

export default Badge;