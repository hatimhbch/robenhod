// Login.tsx - User authentication component for logging into the application
// This component provides a login form with validation and error handling

import { Component, createSignal } from 'solid-js';
import { authService } from '../../services/authService';
import { useNavigate } from '@solidjs/router';

// Main Login component that handles user authentication
const Login: Component = () => {
  // Navigation hook for redirecting after successful login
  const navigate = useNavigate();
  // State signals for form inputs and UI state
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  // Handler for form submission and authentication process
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Attempt to authenticate user with provided credentials
      const response = await authService.login({
        username: username(),
        password: password()
      });
      
      if (response.token) {
        // Store authentication token in localStorage
        localStorage.setItem('token', response.token);
        
        // Create and store user information object
        const userInfo = {
          id: response.id || '',
          username: username(),
          email: response.email || '',
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        // Redirect to home page on successful login
        navigate('/', { replace: true });
      } else {
        // Display error message if login fails
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      // Handle network or other errors
      setError(err.message || 'Login failed');
    } finally {
      // Reset loading state regardless of outcome
      setIsLoading(false);
    }
  };

  return (
    <div class="flex w-full min-h-screen bg-neutral-50 items-center mx-auto">
      {/* Main login form container */}
      <form onSubmit={handleSubmit} class="w-full sm:w-1/2 py-8 px-32 mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Login to Your Account</h1>
        
        {/* Error message display */}
        {error() && (
          <div class="mb-4 p-3 text-red-700 rounded-md">
            {error()}
          </div>
        )}
        
        <div class="mx-auto w-full sm:w-3/4">
        {/* Username input field */}
        <div class="mb-8 m-auto">
          <input id="username" type="text" placeholder="Enter your username" value={username()} onInput={(e) => setUsername(e.currentTarget.value)}
            class="w-full px-6 py-4 border text-sm bg-white border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading()} required />
        </div>
        
        {/* Password input field */}
        <div class="mb-8">
          <input id="password" type="password" placeholder="Enter your password" value={password()} onInput={(e) => setPassword(e.currentTarget.value)}
            class="w-full px-6 py-4 mx-auto border border-neutral-700 bg-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading()} required />
        </div>
        
        {/* Submit button with loading state */}
        <button 
          type="submit" 
          class="w-full mx-auto px-6 py-4 bg-neutral-900 text-white text-sm rounded-full hover:bg-neutral-800 transition-colors font-normal"
          disabled={isLoading()}
        >
          {isLoading() ? 'Logging in...' : 'Login'}
        </button>
        
        {/* Link to signup page */}
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account? <a href="/signup" class="text-indigo-600 hover:text-indigo-800">Sign up here</a>
          </p>
        </div>
        </div>
      </form>
      {/* Login page illustration */}
      <img class='hidden sm:flex w-1/2 h-screen' src='/login.jfif' />
    </div>
  );
};

export default Login;
