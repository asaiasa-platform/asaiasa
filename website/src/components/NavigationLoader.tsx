'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

export const NavigationLoader: React.FC = () => {
  const { showPageLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    const shouldShowLoading = (target: HTMLElement): string | null => {
      // Find the closest link element
      const link = target.closest('a');
      if (!link) return null;

      const href = link.getAttribute('href');
      if (!href) return null;

      // Skip external links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return null;
      }

      // Skip hash links (same page)
      if (href.startsWith('#')) {
        return null;
      }

      // Skip links that open in new tab
      if (link.getAttribute('target') === '_blank') {
        return null;
      }

      // Skip download links
      if (link.hasAttribute('download')) {
        return null;
      }

      return href;
    };

    // Handle mousedown for even faster response
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = shouldShowLoading(target);
      
      if (href) {
        // Show loading IMMEDIATELY on mousedown (even faster than click)
        showPageLoading();
      }
    };

    // Handle click for navigation
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = shouldShowLoading(target);
      
      if (!href) return;

      // Skip if default is prevented
      if (e.defaultPrevented) {
        return;
      }

      const link = target.closest('a')!;

      // For regular anchor tags, prevent default and use Next.js router
      // Next.js Link components handle their own navigation
      if (!link.getAttribute('data-nextjs-link') && !link.closest('[data-nextjs-link]')) {
        e.preventDefault();
        router.push(href);
      }
    };

    // Add both mousedown and click listeners
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [showPageLoading, router]);

  return null; // This component doesn't render anything
};

export default NavigationLoader;
