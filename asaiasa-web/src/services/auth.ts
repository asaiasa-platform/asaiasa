import { env } from '@/config/env';
import { LoginRequest, SignupRequest, AuthResponse } from '@/lib/validation';
import { TokenUtils } from '@/utils/token-utils';

class AuthService {
  private baseURL = env.API_BASE_URL;

  // Note: This method is not used in the current implementation as we use direct fetch calls
  // private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  //   const url = `${this.baseURL}${endpoint}`;
  //   
  //   const config: RequestInit = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...options.headers,
  //     },
  //     credentials: 'include', // Include cookies for session management
  //     ...options,
  //   };

  //   try {
  //     const response = await fetch(url, config);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || data.message || `HTTP ${response.status}`);
  //     }

  //     return data;
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     }
  //     throw new Error('Network error occurred');
  //   }
  // }

  // Login with email and password
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const url = `${this.baseURL}/login`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Keep for backward compatibility
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      // Store the Bearer token
      if (data.token) {
        TokenUtils.setToken(data.token);
      }

      return {
        success: true,
        message: data.message || 'Login successful',
        data: data.user || data.data,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  // Register new user
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const url = `${this.baseURL}/signup`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Keep for backward compatibility
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      // Store the Bearer token
      if (data.token) {
        TokenUtils.setToken(data.token);
      }

      return {
        success: true,
        message: data.message || 'Account created successfully',
        data: data.user || data.data,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const url = `${this.baseURL}/current-user-profile`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add Bearer token if available
      const authHeader = TokenUtils.getAuthorizationHeader();
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include', // Keep for backward compatibility
      });

      if (!response.ok) {
        // If unauthorized, clear the stored token
        if (response.status === 401) {
          TokenUtils.removeToken();
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user profile',
      };
    }
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      const url = `${this.baseURL}/logout`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add Bearer token if available
      const authHeader = TokenUtils.getAuthorizationHeader();
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      // Clear client-side storage first
      this.clearClientStorage();
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include', // Keep for backward compatibility
      });

      // Even if the server request fails, we still clear client-side data
      let serverResult = { success: true, message: 'Logout successful' };
      
      if (response.ok) {
        const data = await response.json();
        serverResult = {
          success: true,
          message: data.message || 'Logout successful',
        };
      } else {
        console.warn('Server logout failed, but client-side logout completed');
      }

      return serverResult;
    } catch (error) {
      // Even if there's an error, ensure client-side logout
      this.clearClientStorage();
      
      return {
        success: true, // Return success since client-side logout is complete
        message: 'Logged out locally',
      };
    }
  }

  // Clear all client-side authentication storage
  private clearClientStorage(): void {
    try {
      // Clear the main auth token using TokenUtils
      TokenUtils.removeToken();
      
      // Clear other potential localStorage items
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Clear sessionStorage
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userProfile');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');

      // Clear all cookies by setting them to expire
      const cookies = [
        'authToken',
        'token',
        'accessToken',
        'refreshToken',
        'user',
        'userProfile',
        'session',
        'auth',
        'jwt'
      ];

      cookies.forEach(cookieName => {
        // Clear for current domain
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        // Clear for current domain with subdomain
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;
        // Clear for parent domain
        const parts = window.location.hostname.split('.');
        if (parts.length > 2) {
          const parentDomain = '.' + parts.slice(-2).join('.');
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${parentDomain};`;
        }
      });

      console.log('Client-side storage cleared');
    } catch (error) {
      console.error('Error clearing client storage:', error);
    }
  }

  // Google OAuth callback
  async googleCallback(code: string): Promise<AuthResponse> {
    try {
      const url = `${this.baseURL}/auth/google/callback?code=${code}`;
      console.log('googleCallback - calling URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Keep for backward compatibility
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      // Store the Bearer token
      if (data.token) {
        TokenUtils.setToken(data.token);
      }

      return {
        success: true,
        message: data.message || 'Google authentication successful',
        data: data.user || data.data,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google authentication failed',
      };
    }
  }

}

export const authService = new AuthService();
