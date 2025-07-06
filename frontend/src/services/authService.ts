// authService.ts - Authentication service that handles user login, signup, and session management
// This service provides methods for user authentication and manages tokens in localStorage

// API configuration for authentication endpoints
import { API_AUTH_URL, debugApiConfig } from '../config/api';

const API_URL = API_AUTH_URL;

// Debug API configuration if there are issues
if (!API_URL || API_URL.includes('undefined')) {
  console.error('🚨 Authentication Service: Invalid API_URL detected!');
  console.error('API_AUTH_URL:', API_AUTH_URL);
  debugApiConfig();
}

// Interface defining the structure for login request data
export interface LoginRequest {
  username: string;
  password: string;
}

// Interface defining the structure for signup request data
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// Interface defining the structure for authentication responses
// Contains either success data (token, user info) or error message
export interface AuthResponse {
  token?: string;
  id?: number;
  username?: string;
  email?: string;
  roles?: string[];
  message?: string;
}

// Main authentication service object containing all auth-related methods
export const authService = {
  // Handles user login by sending credentials to the server
  // Returns either authentication data or error message
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Handle non-successful HTTP responses
      if (!response.ok) {
        const errorData = await response.json();
        return { message: errorData.message || 'Login failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      return { message: 'Network error, please try again later' };
    }
  },

  // Handles user registration by sending user data to the server
  // Returns either authentication data or error message
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Handle non-successful HTTP responses
      if (!response.ok) {
        const errorData = await response.json();
        return { message: errorData.message || 'Registration failed' };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      return { message: 'Network error, please try again later' };
    }
  },

  // Clears authentication data from localStorage to log out the user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  },

  // Checks if user is currently authenticated by verifying token existence
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  },

  // Retrieves the stored authentication token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Retrieves and parses user information from localStorage
  // Returns null if no user info exists or if parsing fails
  getUserInfo(): any {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
        return null;
      }
    }
    return null;
  }
};
