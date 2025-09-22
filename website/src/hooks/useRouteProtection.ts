"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatExternalUrl } from '@/lib/utils';
import Cookies from 'js-cookie';

// Protected routes that require authentication
const protectedRoutes = ["/choose-preferences", "/user-statistics"];

export const useRouteProtection = (currentPath: string) => {
  const router = useRouter();

  useEffect(() => {
    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      currentPath.includes(route)
    );

    if (isProtectedRoute) {
      const validateAuth = async () => {
        const token = Cookies.get('authToken');
        
        if (!token) {
          router.push('/login');
          return;
        }

        try {
          const apiUrl = formatExternalUrl("protected-route");
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: 'include',
          });

          if (!response.ok) {
            console.warn(`Protected route access denied: ${currentPath}`);
            router.push('/login');
          }
        } catch (error) {
          console.error("Token validation error:", error);
          router.push('/login');
        }
      };

      validateAuth();
    }
  }, [currentPath, router]);
};
