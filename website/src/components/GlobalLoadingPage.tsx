'use client';

import React from 'react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

export const GlobalLoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-bg">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="relative">
          <Image
            src="/logo.svg"
            alt="ASAiASA"
            width={120}
            height={120}
            className="animate-pulse"
            priority
          />
        </div>
        
        {/* Loading Spinner */}
        <LoadingSpinner size="lg" className="text-blue-600" />
        
        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading ASAiASA</h2>
          <p className="text-gray-600">Please wait while we prepare your experience...</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingPage;
