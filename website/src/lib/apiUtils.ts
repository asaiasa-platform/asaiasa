import { clearAllCookies } from "./cookieUtils";

/**
 * Enhanced fetch wrapper that handles header size issues
 */
export async function safeFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // Check if response indicates header size issues
    if (response.status === 431) { // Request Header Fields Too Large
      console.warn("Request headers too large, clearing cookies and retrying...");
      
      // Clear cookies and retry once
      clearAllCookies();
      
      // Wait a bit for cookies to clear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Retry the request
      return await fetch(url, options);
    }
    
    return response;
  } catch (error: any) {
    // Check if error message indicates header size issues
    if (error.message && error.message.includes('header')) {
      console.warn("Potential header size issue detected, clearing cookies...");
      clearAllCookies();
      throw new Error("Request failed due to header size. Cookies cleared. Please try again.");
    }
    
    throw error;
  }
}

/**
 * API response handler that provides better error messages
 */
export async function handleApiResponse(response: Response) {
  if (response.status === 431) {
    throw new Error("Request headers too large. Please clear your browser cookies and try again.");
  }
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // If we can't parse JSON, use the default error message
    }
    
    throw new Error(errorMessage);
  }
  
  return response;
}

/**
 * Utility to check if current request headers might be too large
 */
export function checkHeaderSize(): { size: number; warning: boolean } {
  // Estimate header size based on cookies and common headers
  const cookieSize = document.cookie.length;
  const estimatedHeaderSize = cookieSize + 2048; // Add ~2KB for other headers
  
  return {
    size: estimatedHeaderSize,
    warning: estimatedHeaderSize > 8192 // 8KB warning threshold
  };
}

/**
 * Log header size information for debugging
 */
export function logHeaderInfo() {
  const headerInfo = checkHeaderSize();
  console.log(`Estimated header size: ${headerInfo.size} bytes`);
  
  if (headerInfo.warning) {
    console.warn("⚠️ Header size may be too large. Consider clearing cookies.");
  }
}
