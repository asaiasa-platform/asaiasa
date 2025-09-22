"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { formatExternalUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { safeFetch, handleApiResponse } from "@/lib/apiUtils";

// Client-side version of googleOauthCallback that doesn't use server-side cookies
async function clientGoogleOauthCallback(code: string) {
  try {
    const apiUrl = formatExternalUrl("/auth/google/callback?code=" + code);
    
    // Use safeFetch to handle header size issues
    const res = await safeFetch(apiUrl, {
      cache: "no-store",
      method: "GET",
      credentials: "include", // This will handle cookies automatically
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle API response with better error handling
    await handleApiResponse(res);
    const data = await res.json();

    return { success: true, data };
  } catch (error) {
    console.error("OAuth callback error:", error);
    const errorMessage = error instanceof Error ? error.message : "Network error occurred";
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthState } = useAuth();
  const t = useTranslations("Auth");
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          console.error("OAuth error:", error);
          setError(t("errors.cancelled") || "Google authentication was cancelled or failed");
          toast.error(t("errors.cancelled") || "Authentication cancelled");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          return;
        }

        if (!code) {
          console.error("No authorization code received");
          setError(t("errors.noCode") || "No authorization code received from Google");
          toast.error(t("errors.failed") || "Authentication failed");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          return;
        }

        // Call the backend with the authorization code
        const result = await clientGoogleOauthCallback(code);
        
        if (result.success) {
          setSuccess(true);
          // Update auth state
          setAuthState();
          toast.success(t("login.success") || "Login successful!");
          
          // Redirect to home page with locale
          setTimeout(() => {
            router.push("/home");
          }, 2000);
        } else {
          console.error("Backend authentication failed:", result.error);
          setError(result.error || "Authentication failed");
          toast.error(t("errors.failed") || "Login failed");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (err) {
        console.error("Callback processing error:", err);
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, router, setAuthState, t]);

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
