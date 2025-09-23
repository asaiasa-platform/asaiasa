import { env } from '@/config/env';
import { LoginRequest, SignupRequest, AuthResponse, UserProfile } from '@/lib/validation';

class AuthService {
  private baseURL = env.API_BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Login with email and password
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const url = `${this.baseURL}/login`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: This allows cookies to be set and sent
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Login successful',
        data: data.user || data.data,
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
        credentials: 'include', // Important: This allows cookies to be set and sent
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Account created successfully',
        data: data.user || data.data,
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
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: This sends cookies with the request
      });

      if (!response.ok) {
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
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: This sends cookies with the request
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Logout successful',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  }

  // Google OAuth callback
  async googleCallback(code: string): Promise<AuthResponse> {
    try {
      const url = `${this.baseURL}/auth/google/callback?code=${code}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: This allows cookies to be set and sent
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Google authentication successful',
        data: data.user || data.data,
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
