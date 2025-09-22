'use client';

import React from 'react';
import { useLoading } from '@/context/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  showGlobalLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  showGlobalLoading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const { showPageLoading } = useLoading();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showGlobalLoading) {
      showPageLoading();
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center rounded-md font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading && (
        <LoadingSpinner 
          size="sm" 
          className="mr-2" 
        />
      )}
      {isLoading ? loadingText : children}
    </button>
  );
};

export default LoadingButton;
