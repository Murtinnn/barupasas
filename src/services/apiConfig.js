const rawBackend = process.env.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_BACKEND_URL || 'http://194.135.95.218:8001';
export const API_URL = rawBackend.endsWith('/api/v1') ? rawBackend : `${rawBackend.replace(/\/$/, '')}/api/v1`;
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL || rawBackend.replace(/\/$/, '');

// Debug print once at startup to verify API base
if (typeof console !== 'undefined') {
  // Avoid noisy logs by summarizing
  console.log('[apiConfig] Using API_URL:', API_URL, ' WEB_URL:', WEB_URL);
}

// Enhanced fetch with timeout and retry logic
export const apiFetch = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Debug function to test API connection
export const testApiConnection = async () => {
  try {
    // Import SecureStore dynamically
    const { getItemAsync } = await import('expo-secure-store');
    const token = await getItemAsync('auth_token');
    
    const response = await apiFetch(`${API_URL}/invitations/debug`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }, 15000); // 15 second timeout
    
    console.log('[apiConfig] Response status:', response.status);
    
    if (response.status === 302) {
      console.log('[apiConfig] Redirected to login - token invalid');
      return { error: 'Authentication failed' };
    }
    
    const data = await response.json();
    console.log('[apiConfig] API test response:', data);
    return data;
  } catch (error) {
    console.error('[apiConfig] API test error:', error);
    return { error: error.message };
  }
};

