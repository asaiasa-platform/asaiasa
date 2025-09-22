/**
 * Utility functions for managing cookies to prevent header size issues
 */

export function clearAllCookies() {
  // Get all cookies
  const cookies = document.cookie.split(";");
  
  // Clear each cookie
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Clear for current domain
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    
    // Clear for parent domain (if any)
    const domain = window.location.hostname;
    const parts = domain.split('.');
    if (parts.length > 2) {
      const parentDomain = '.' + parts.slice(-2).join('.');
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain};`;
    }
  });
}

export function clearSpecificCookies(cookieNames: string[]) {
  cookieNames.forEach(name => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    
    // Also clear for parent domain
    const domain = window.location.hostname;
    const parts = domain.split('.');
    if (parts.length > 2) {
      const parentDomain = '.' + parts.slice(-2).join('.');
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain};`;
    }
  });
}

export function getCookieSize(): number {
  return document.cookie.length;
}

export function getCookieInfo() {
  const cookies = document.cookie.split(";");
  const cookieInfo = cookies.map(cookie => {
    const [name, ...valueParts] = cookie.split("=");
    const value = valueParts.join("=");
    return {
      name: name.trim(),
      size: cookie.length,
      value: value ? value.substring(0, 50) + (value.length > 50 ? "..." : "") : ""
    };
  });
  
  return {
    totalSize: document.cookie.length,
    count: cookies.length,
    cookies: cookieInfo
  };
}

export function logCookieInfo() {
  const info = getCookieInfo();
  console.log("Cookie Information:", info);
  
  if (info.totalSize > 4096) { // 4KB warning
    console.warn(`⚠️ Large cookie size detected: ${info.totalSize} bytes. This may cause header size issues.`);
  }
}

// Auto-cleanup function for development
export function autoCleanupCookies() {
  const info = getCookieInfo();
  
  // If cookies are larger than 8KB, clear non-essential ones
  if (info.totalSize > 8192) {
    console.warn("Cookie size exceeded 8KB, clearing non-essential cookies...");
    
    // Keep only essential cookies (authToken, preferred-locale)
    const essentialCookies = ['authToken', 'preferred-locale'];
    const allCookies = info.cookies.map(c => c.name);
    const cookiesToClear = allCookies.filter(name => !essentialCookies.includes(name));
    
    clearSpecificCookies(cookiesToClear);
    
    console.log(`Cleared ${cookiesToClear.length} non-essential cookies`);
  }
}
