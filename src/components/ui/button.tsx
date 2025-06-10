import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'rounded focus:outline-none transition-colors inline-flex items-center justify-center';
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const variantStyles = {
    default: 'bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500',
    ghost: 'bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;