'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

interface LoadingLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const LoadingLink: React.FC<LoadingLinkProps> = ({ 
  children, 
  className,
  onClick,
  href,
  ...props 
}) => {
  const { showPageLoading } = useLoading();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Don't show loading for external links or if default is prevented
    if (e.defaultPrevented) return;
    
    const url = href.toString();
    
    // Check if it's an external link
    if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return;
    }

    // Check if it's the same page (hash links)
    if (url.startsWith('#')) {
      return;
    }

    // Show loading immediately
    showPageLoading();

    // Handle programmatic navigation for better control
    e.preventDefault();
    router.push(url);
  };

  return (
    <Link {...props} href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default LoadingLink;
