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
  const callbackT = useTranslations('GoogleCallback');
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    // Check if we've already processed this code to prevent double execution
    const currentCode = searchParams.get('code');
    const processedCode = sessionStorage.getItem('processed_oauth_code');
    const processingCode = sessionStorage.getItem('processing_oauth_code');
    
    if (currentCode && (processedCode === currentCode || processingCode === currentCode)) {
      navigate('/home');
      return;
    }
    
    // Mark code as being processed immediately to prevent race conditions
    if (currentCode) {
      sessionStorage.setItem('processing_oauth_code', currentCode);
    }

    const handleCallback = async () => {
      if (!isMounted) return;

      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        // Handle OAuth errors from Google
        if (error) {
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
          if (isMounted) {
            setError('No authorization code received from Google');
            toast.error('Authentication failed');
            // Immediate redirect on missing code
            navigate('/login');
          }
          return;
        }

        // Mark this code as processed (already marked as processing above)
        sessionStorage.setItem('processed_oauth_code', code);
        sessionStorage.removeItem('processing_oauth_code');
        
        // Call the backend with the authorization code
        const result = await authService.googleCallback(code);
        
        if (!isMounted) return; // Component unmounted during async call

        if (result.success) {
          setSuccess(true);
          
          // Small delay to ensure token is stored properly
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Update auth state
          try {
            await setAuthState();
            toast.success(t('login.success') || 'Login successful!');
            
            // Clear the processed code on successful completion
            sessionStorage.removeItem('processed_oauth_code');
            sessionStorage.removeItem('processing_oauth_code');
            
            // Immediate redirect to home on success
            navigate('/home');
          } catch (authError) {
            // Even if auth state update fails, still redirect to home
            // as the backend authentication was successful
            navigate('/home');
          }
        } else {
          // Only show error and redirect to login if it's a real failure
          // Ignore if it's just a secondary failed attempt
          if (isMounted && !success) {
            setError(result.error || 'Authentication failed');
            toast.error('Login failed');
            navigate('/login');
          }
        }
      } catch (err) {
        // Clean up processing flags on error
        sessionStorage.removeItem('processing_oauth_code');
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
            {callbackT('processing')}
          </h2>
          <p className="text-gray-500">{callbackT('pleaseWait')}</p>
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
            {callbackT('authFailed')}
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <p className="text-sm text-gray-400">
            {callbackT('redirectingToLogin')}
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
            {callbackT('loginSuccessful')}
          </h2>
          <p className="text-gray-500">{callbackT('redirectingToHome')}</p>
        </div>
      </div>
    );
  }

  return null;
}
