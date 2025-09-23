import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { AuthContextType, UserProfile } from '@/lib/validation';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType>({
  isAuth: null,
  userProfile: null,
  loading: true,
  setAuthState: async () => {},
  removeAuthState: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const result = await authService.getCurrentUser();
      if (result.success && result.data) {
        setUserProfile(result.data);
        setIsAuth(true);
      } else {
        setUserProfile(null);
        setIsAuth(false);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserProfile(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsHydrated(true);
      await fetchUserProfile();
    };

    initializeAuth();
  }, [fetchUserProfile]);

  // Set authentication state (called after login/signup)
  const setAuthState = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  // Remove authentication state (logout)
  const removeAuthState = useCallback(async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setIsAuth(false);
        setUserProfile(null);
        toast.success('Logged out successfully');
        // Redirect to home page
        window.location.href = '/';
      } else {
        console.error('Logout failed:', result.error);
        toast.error(result.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  }, []);

  // Don't render until hydrated (prevents SSR mismatch)
  if (!isHydrated) {
    return null;
  }

  const contextValue: AuthContextType = {
    isAuth,
    userProfile,
    loading,
    setAuthState,
    removeAuthState,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
