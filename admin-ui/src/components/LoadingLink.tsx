'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useLoading } from '@/context/LoadingContext';

interface LoadingLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export const LoadingLink: React.FC<LoadingLinkProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  const { showPageLoading } = useLoading();

  const handleClick = () => {
    showPageLoading();
  };

  return (
    <Link {...props} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default LoadingLink;
