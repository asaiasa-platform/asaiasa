/**
 * Authentication Debug Utilities
 * Use these functions in the browser console to debug auth issues in production
 */

export const authDebugUtils = {
  // Check all authentication-related storage
  checkAuthStorage: () => {
    console.log('=== Authentication Storage Debug ===');
    
    console.log('\n📦 LocalStorage:');
    const localStorageKeys = ['authToken', 'userProfile', 'user', 'token', 'accessToken', 'refreshToken'];
    localStorageKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`  ${key}:`, value ? value.substring(0, 100) + '...' : 'null');
    });

    console.log('\n📦 SessionStorage:');
    const sessionStorageKeys = ['authToken', 'userProfile', 'user', 'token', 'accessToken', 'refreshToken'];
    sessionStorageKeys.forEach(key => {
      const value = sessionStorage.getItem(key);
      console.log(`  ${key}:`, value ? value.substring(0, 100) + '...' : 'null');
    });

    console.log('\n🍪 Cookies:');
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const authCookies = cookies.filter(cookie => 
      cookie.toLowerCase().includes('auth') || 
      cookie.toLowerCase().includes('token') || 
      cookie.toLowerCase().includes('user') ||
      cookie.toLowerCase().includes('jwt') ||
      cookie.toLowerCase().includes('session')
    );
    
    if (authCookies.length > 0) {
      authCookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        console.log(`  ${name}:`, value ? value.substring(0, 50) + '...' : 'empty');
      });
    } else {
      console.log('  No authentication cookies found');
    }
  },

  // Force clear all authentication data
  forceClearAuth: () => {
    console.log('🧹 Force clearing all authentication data...');
    
    // Clear localStorage
    const localKeys = Object.keys(localStorage);
    localKeys.forEach(key => {
      if (key.toLowerCase().includes('auth') || 
          key.toLowerCase().includes('token') || 
          key.toLowerCase().includes('user')) {
        localStorage.removeItem(key);
        console.log(`  Cleared localStorage: ${key}`);
      }
    });

    // Clear sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.toLowerCase().includes('auth') || 
          key.toLowerCase().includes('token') || 
          key.toLowerCase().includes('user')) {
        sessionStorage.removeItem(key);
        console.log(`  Cleared sessionStorage: ${key}`);
      }
    });

    // Clear cookies
    const cookiesToClear = [
      'authToken', 'token', 'accessToken', 'refreshToken', 
      'user', 'userProfile', 'session', 'auth', 'jwt'
    ];
    
    cookiesToClear.forEach(cookieName => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;
      console.log(`  Cleared cookie: ${cookieName}`);
    });

    console.log('✅ Force clear completed. Reload the page to see changes.');
  },

  // Test current user endpoint
  testCurrentUser: async () => {
    console.log('🔍 Testing current user endpoint...');
    
    try {
      const response = await fetch('/api/current-user-profile', {
        method: 'GET',
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User data:', data);
      } else {
        console.log('❌ Request failed:', await response.text());
      }
    } catch (error) {
      console.error('❌ Network error:', error);
    }
  },

  // Get current auth state from React context (if available)
  getReactAuthState: () => {
    // This will only work if the auth context is available in the global scope
    console.log('🔍 Checking React auth state...');
    console.log('Note: This requires the auth context to be exposed globally');
    
    // Check if there's any auth-related data in React's fiber tree
    const reactFiberKey = Object.keys(document.querySelector('#root') || {}).find(key => 
      key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
    );
    
    if (reactFiberKey) {
      console.log('✅ React fiber found, but auth state inspection requires dev tools');
    } else {
      console.log('❌ React fiber not found');
    }
  }
};

// Make it available in the global scope for production debugging
if (typeof window !== 'undefined') {
  (window as any).authDebug = authDebugUtils;
  console.log('🔧 Auth debug utils available at: window.authDebug');
  console.log('Usage: window.authDebug.checkAuthStorage()');
}
