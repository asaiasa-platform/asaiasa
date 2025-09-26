// Token management utilities
export class TokenUtils {
  private static readonly TOKEN_KEY = 'auth_token';

  // Get token from localStorage
  static getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  // Set token in localStorage
  static setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token in localStorage:', error);
    }
  }

  // Remove token from localStorage
  static removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  }

  // Check if token exists and is valid (not expired)
  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT structure check
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired (with 5 minute buffer)
      if (payload.exp && payload.exp < currentTime + 300) {
        this.removeToken();
        return false;
      }

      return true;
    } catch (error) {
      // Invalid token format
      this.removeToken();
      return false;
    }
  }

  // Get token payload (decoded)
  static getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      return JSON.parse(atob(parts[1]));
    } catch (error) {
      return null;
    }
  }

  // Get Authorization header value
  static getAuthorizationHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}
