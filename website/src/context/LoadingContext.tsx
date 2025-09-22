'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import GlobalLoadingPage from '@/components/GlobalLoadingPage';
import NavigationLoader from '@/components/NavigationLoader';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showPageLoading: () => void;
  hidePageLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pathname = usePathname();

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loading for 1.5 seconds on initial load

    return () => clearTimeout(timer);
  }, []);

  // Handle page navigation loading
  useEffect(() => {
    // Only hide loading after pathname changes, don't auto-show it
    // Loading will be triggered by link clicks instead
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500); // Hide loading after 0.5 seconds once page loads

    return () => clearTimeout(timer);
  }, [pathname]);

  const showPageLoading = () => setIsPageLoading(true);
  const hidePageLoading = () => setIsPageLoading(false);

  const contextValue: LoadingContextType = {
    isLoading: isLoading || isPageLoading,
    setIsLoading,
    showPageLoading,
    hidePageLoading,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      <NavigationLoader />
      {(isLoading || isPageLoading) && <GlobalLoadingPage />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
