import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { env } from '@/config/env';

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

export const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ children }) => {
  const clientId = env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn('Google Client ID is not configured. Google OAuth will not work.');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
