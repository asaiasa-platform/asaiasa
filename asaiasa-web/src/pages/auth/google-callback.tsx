import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/auth-context';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const t = useTranslations('Auth');
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    let hasProcessed = false; // Prevent multiple processing

    const handleCallback = async () => {
      if (hasProcessed || !isMounted) return;
      hasProcessed = true;

      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        // Handle OAuth errors from Google
        if (error) {
          console.error('OAuth error from Google:', error);
          if (isMounted) {
            setError('Google authentication was cancelled or failed');
            toast.error('Authentication cancelled');
            // Immediate redirect on error
            navigate('/login');
          }
          return;
        }

        // Handle missing authorization code
        if (!code) {
          console.error('No authorization code received from Google');
          if (isMounted) {
            setError('No authorization code received from Google');
            toast.error('Authentication failed');
            // Immediate redirect on missing code
            navigate('/login');
          }
          return;
        }

        // Call the backend with the authorization code
        console.log('Processing Google OAuth code...');
        const result = await authService.googleCallback(code);
        
        if (!isMounted) return; // Component unmounted during async call

        if (result.success) {
          console.log('Google OAuth success - updating auth state...');
          setSuccess(true);
          
          // Update auth state
          try {
            await setAuthState();
            toast.success(t('login.success') || 'Login successful!');
            
            // Immediate redirect to home on success
            console.log('Redirecting to home page...');
            navigate('/home');
          } catch (authError) {
            console.error('Auth state update failed:', authError);
            // Even if auth state update fails, still redirect to home
            // as the backend authentication was successful
            navigate('/home');
          }
        } else {
          console.error('Backend authentication failed:', result.error);
          // Only show error and redirect to login if it's a real failure
          // Ignore if it's just a secondary failed attempt
          if (isMounted && !success) {
            setError(result.error || 'Authentication failed');
            toast.error('Login failed');
            navigate('/login');
          }
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        if (isMounted && !success) {
          setError('An unexpected error occurred');
          toast.error('An unexpected error occurred');
          navigate('/login');
        }
      } finally {
        if (isMounted) {
          setIsProcessing(false);
        }
      }
    };

    // Small delay to ensure single execution
    const timeoutId = setTimeout(handleCallback, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchParams, navigate, setAuthState, t, success]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Processing Google Login...
          </h2>
          <p className="text-gray-500">Please wait while we authenticate you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <p className="text-sm text-gray-400">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Login Successful!
          </h2>
          <p className="text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return null;
}
