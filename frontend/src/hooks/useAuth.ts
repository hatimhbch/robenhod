// useAuth.ts - Custom hook for managing authentication state across the application
// This hook provides reactive authentication state management using SolidJS signals

import { createSignal, createEffect } from 'solid-js';

// Interface defining the structure of user data
interface User {
  id: string;
  username: string;
  email: string;
}

// Global signal for storing current user state
// This is reactive and will update all components using this hook
const [user, setUser] = createSignal<User | null>(null);

// Effect that runs on application start to restore user state from localStorage
// Automatically syncs authentication state with stored data
createEffect(() => {
  const userInfo = localStorage.getItem('userInfo');
  const token = localStorage.getItem('token');
  
  // Only restore user state if both userInfo and token exist
  if (userInfo && token) {
    try {
      setUser(JSON.parse(userInfo));
    } catch (error) {
      // Clean up corrupted data if JSON parsing fails
      console.error('Error parsing user info:', error);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    }
  }
});

// Custom hook that provides authentication state and methods
// Returns reactive user state and authentication utilities
export const useAuth = () => {
  // Function to log out the current user
  // Clears all authentication data and resets user state
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Function to check if user is currently authenticated
  // Verifies both user state and token existence
  const isAuthenticated = () => {
    return !!user() && !!localStorage.getItem('token');
  };

  // Return authentication state and methods for components to use
  return {
    user,
    logout,
    isAuthenticated
  };
}; 