'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

export const NavigationLoader: React.FC = () => {
  const { showPageLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find the closest link element
      const link = target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Skip external links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Skip hash links (same page)
      if (href.startsWith('#')) {
        return;
      }

      // Skip links that open in new tab
      if (link.getAttribute('target') === '_blank') {
        return;
      }

      // Skip download links
      if (link.hasAttribute('download')) {
        return;
      }

      // Skip if default is prevented
      if (e.defaultPrevented) {
        return;
      }

      // Show loading IMMEDIATELY
      showPageLoading();

      // Handle Next.js Link components (they prevent default and use router)
      if (link.getAttribute('data-nextjs-link') !== null || 
          link.closest('[data-nextjs-link]')) {
        // Let Next.js handle the navigation
        return;
      }

      // For regular anchor tags, prevent default and use Next.js router
      e.preventDefault();
      router.push(href);
    };

    // Add event listener to document to catch all link clicks
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [showPageLoading, router]);

  return null; // This component doesn't render anything
};

export default NavigationLoader;
