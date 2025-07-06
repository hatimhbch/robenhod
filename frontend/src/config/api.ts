// api.ts - API endpoint configuration for the application
// This file centralizes all API URLs using environment variables

// Base URL for the backend API server
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Authentication endpoints for login, signup, and user management
export const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
// Article endpoints for CRUD operations and likes
export const API_ARTICLES_URL = `${API_BASE_URL}/api/articles`;

// Debug function to check API configuration
export const debugApiConfig = () => {
  console.log('=== API Configuration Debug ===');
  console.log('Environment:', import.meta.env.MODE);
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('API_AUTH_URL:', API_AUTH_URL);
  console.log('API_ARTICLES_URL:', API_ARTICLES_URL);
  console.log('Is production:', import.meta.env.PROD);
  console.log('Is development:', import.meta.env.DEV);
  console.log('================================');
  
  // Check if API_BASE_URL is undefined or null
  if (!API_BASE_URL) {
    console.error('🚨 CRITICAL: API_BASE_URL is not defined!');
    console.error('Make sure VITE_API_BASE_URL is set in your environment variables.');
    console.error('For production, this should be set in your deployment platform.');
  }
};

// Validate API configuration on module load
if (typeof window !== 'undefined') {
  debugApiConfig();
} 