// storage.ts - Utility functions for managing authentication tokens and localStorage operations
// These functions provide safe localStorage access with browser environment checks

// Retrieves the authentication token from localStorage
// Returns null if not in browser environment or if token doesn't exist
export const getToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('token');
    return token;
  }
  return null;
};

// Stores an authentication token in localStorage
// Only operates in browser environment with localStorage support
export const setToken = (token: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('token', token);
  }
};

// Removes authentication token and user info from localStorage
// Clears all authentication-related data during logout
export const removeToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }
};

// Checks if user is currently authenticated by verifying token existence
// Returns boolean indicating authentication status
export const isAuthenticated = () => {
  return !!getToken();
};

// Handles token expiration by clearing storage and redirecting to login
// Used when API returns 401 unauthorized responses
export const handleTokenExpiration = () => {
  removeToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};