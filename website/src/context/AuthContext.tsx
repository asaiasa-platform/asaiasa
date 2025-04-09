"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import type { AuthContextType, UserProfile } from "@/lib/types";
import toast from "react-hot-toast";
import { getCurrentUser, logOut } from "@/features/auth/api/action";

const AuthContext = createContext<AuthContextType>({
  isAuth: null,
  userProfile: null,
  loading: true,
  setAuthState: () => {},
  removeAuthState: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCurrentUser();
      if (!result.success) {
        throw new Error(result.error);
      }
      setUserProfile(result.data);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
      setUserProfile(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsHydrated(true);

      try {
        await fetchUserProfile();
      } catch (error) {
        setIsAuth(false);
        setUserProfile(null);
      }
    };

    initializeAuth();
  }, [fetchUserProfile]);

  // will set auth state if fetchUserProfile is complete
  const setAuthState = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const removeAuthState = useCallback(async () => {
    const result = await logOut();
    if (result.success) {
      setIsAuth(false);
      setUserProfile(null);
      window.location.href = "/";
    } else {
      console.log("Logout Failed");
      toast.error("Logout Failed");
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      isAuth,
      userProfile,
      loading,
      setAuthState,
      removeAuthState,
    }),
    [isAuth, userProfile, loading, setAuthState, removeAuthState]
  );

  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
