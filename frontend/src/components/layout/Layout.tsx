// Layout.tsx - Main application layout component that provides navigation, authentication UI, and footer
// This component wraps all pages and provides consistent header/footer structure

import { Component, JSX, createSignal, createEffect, Show, onCleanup } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { authService } from '../../services/authService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { EnvChecker } from '../common';

// Interface defining the props that Layout component accepts
interface LayoutProps {
  children?: JSX.Element;
}

// Main Layout component that provides application shell with navigation and footer
const Layout: Component<LayoutProps> = (props) => {
  // State for tracking user authentication status
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  // State for storing the current user's username
  const [username, setUsername] = createSignal('');
  // State for tracking logout process to show loading state
  const [isLoggingOut, setIsLoggingOut] = createSignal(false);
  // State for controlling profile dropdown visibility
  const [showProfileDropdown, setShowProfileDropdown] = createSignal(false);
  // State for controlling mobile navigation links visibility
  const [isLinksVisible, setIsLinksVisible] = createSignal(false);
  // State for tracking hover state (currently unused but defined)
  const [isHovered, setIsHovered] = createSignal(false);
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Effect that runs on component mount to set up authentication state monitoring
  createEffect(() => {
    // Function to check current authentication state and update local state
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
      const userInfo = authService.getUserInfo();
      if (userInfo && userInfo.username) {
        setUsername(userInfo.username);
      } else {
        setUsername('');
      }
    };

    // Initial authentication check
    checkAuth();

    // Event handler for localStorage changes (cross-tab auth state sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'userInfo') {
        checkAuth();
      }
    };

    // Event handler for custom auth change events
    const handleAuthChange = () => {
      checkAuth();
    };

    // Set up event listeners for auth state changes (browser environment only)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('authChange', handleAuthChange);
      
      // Cleanup function to remove event listeners
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authChange', handleAuthChange);
      };
    }
  });

  // Handler for user logout process with loading state and delayed execution
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowProfileDropdown(false);
    
    // Delayed logout to allow for smooth UI transition
    setTimeout(() => {
      authService.logout();
      setIsAuthenticated(false);
      setUsername('');
      setIsLoggingOut(false);
      
      // Dispatch custom event to notify other components of auth change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChange'));
      }
      
      // Navigate to home page after logout
      navigate('/', { replace: true });
    }, 300);
  };

  // Handler to toggle profile dropdown menu visibility
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown());
  };

  // Handler to close profile dropdown when clicking outside of it
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('.profile-dropdown')) {
      setShowProfileDropdown(false);
    }
  };

  // Effect to set up click outside listener for profile dropdown
  createEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleClickOutside);
      onCleanup(() => {
        document.removeEventListener('click', handleClickOutside);
      });
    }
  });

  return (
    <div class="min-h-screen flex flex-col">
      {/* Environment diagnostic component - remove in production */}
      <EnvChecker />
      
      {/* Mobile navigation overlay background */}
      <p class={`${isLinksVisible() ? 'block h-40 md:hidden' : 'hidden'} absolute w-full bg-white border-b border-solid border-neutral-100 top-[72px] z-20`}></p>
      
      {/* Main navigation bar */}
      <nav class="flex absolute top-0 left-0 w-full h-[72px] px-4 md:px-20 bg-white justify-between border-b border-solid border-neutral-50 z-30">
        {/* Logo section */}
        <div class="flex w-auto justify-between pl-2">
          <A class="flex h-full items-center" href="/">
            <img class='h-8 w-8 items-center' src='/logo.svg' />
            <p class="items-center my-auto ml-1 text-base font-semibold md:block hidden" style={{"font-family": "'Faculty Glyphic', sans-serif"}}>ROBENHOD</p>
          </A>
        </div>
        
        {/* Mobile hamburger menu button */}
        <svg class="bar block w-9 fill-neutral-900 items-center md:hidden cursor-pointer" onClick={() => setIsLinksVisible(!isLinksVisible())} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 36 36">
          <rect y="12" width="25" height="1.7"></rect>
          <rect y="22" width="25" height="1.7"></rect>
        </svg>
        
        {/* Navigation links and authentication controls */}
        <div class={`flex w-auto md:w-[430px] justify-between ${isLinksVisible() ? 'flex' : 'hidden'} md:flex absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-white md:bg-transparent border-b md:border-b-0 border-neutral-100 md:border-none p-4 md:p-0`}>
          {/* Main navigation links */}
          <div class={`flex flex-col md:flex-row gap-4 md:gap-x-6 my-auto px-5 w-full md:w-auto`}>
            <A class="text-[14px] text-neutral-950 font-medium tracking-normal hover:text-neutral-600 transition-colors" href="/" end onClick={() => setIsLinksVisible(false)}>Home</A>
            <A class="text-[14px] text-neutral-950 font-medium tracking-normal hover:text-neutral-600 transition-colors" href="/about" onClick={() => setIsLinksVisible(false)}>About</A>
            <A class="text-[14px] text-neutral-950 font-medium tracking-normal hover:text-neutral-600 transition-colors" href="/terms" onClick={() => setIsLinksVisible(false)}>Terms</A>
            <A class="text-[14px] text-neutral-950 font-medium tracking-normal hover:text-neutral-600 transition-colors" href="/privacy" onClick={() => setIsLinksVisible(false)}>Privacy</A>
          </div>
          
          {/* Authentication section - shows different content based on auth state */}
          <div class="flex flex-col md:flex-row gap-3 md:gap-2 mt-4 md:mt-0 md:w-auto md:justify-between">
            {!isAuthenticated() ? (
              // Unauthenticated user: Show login and signup buttons
              <div class='flex items-center justify-evenly w-56'>
                <A 
                  href="/login" 
                  class="text-sm font-medium text-gray-700 hover:text-neutral-900 px-4 py-2 rounded-full hover:bg-gray-50 transition-all duration-200 text-center"
                  onClick={() => setIsLinksVisible(false)}
                >
                  Sign In
                </A>
                <A 
                  href="/signup" 
                  class="inline-flex items-center justify-center h-[37px] px-4 py-0 text-sm font-medium rounded-full text-white bg-neutral-900 hover:bg-neutral-800 transition-all duration-200"
                  onClick={() => setIsLinksVisible(false)}
                >
                  Get Started
                </A>
              </div>
            ) : (
              // Authenticated user: Show write button and profile dropdown
              <div class='flex items-center justify-evenly w-40'>
                {/* Write/Create new article button */}
                <A href="/create" 
                  class="inline-flex items-center justify-center h-[37px] px-4 py-0 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all duration-200 group"
                  onClick={() => setIsLinksVisible(false)}>
                  <p class='text-xl items-center leading-0 pr-1'>+</p>
                  Write
                </A>

                {/* User profile dropdown container */}
                <div class="relative profile-dropdown">
                  {/* Profile avatar button with user's initial */}
                  <button 
                    onClick={toggleProfileDropdown}
                    class="h-10 w-10 bg-neutral-900 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-neutral-800 transition-colors duration-200 mx-auto md:mx-0"
                  >
                    {username()[0]?.toUpperCase() || 'U'}
                  </button>

                  {/* Profile dropdown menu */}
                  <Show when={showProfileDropdown()}>
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {/* Profile link with user icon */}
                      <A 
                        href="/profile"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setIsLinksVisible(false);
                        }}
                      >
                        <div class="flex items-center">
                          {/* User profile icon SVG */}
<svg class='mr-2' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#212121" stroke-width="0.2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
<path d="M17.7543 13.9997C18.9963 13.9997 20.0032 15.0065 20.0032 16.2486V16.824C20.0032 17.7183 19.6836 18.5831 19.1021 19.2625C17.5327 21.096 15.1455 22.0008 12.0001 22.0008C8.85426 22.0008 6.46825 21.0957 4.90194 19.2614C4.32218 18.5825 4.00366 17.719 4.00366 16.8262V16.2486C4.00366 15.0065 5.01052 13.9997 6.25254 13.9997H17.7543ZM17.7543 15.4997H6.25254C5.83895 15.4997 5.50366 15.835 5.50366 16.2486V16.8262C5.50366 17.3619 5.69477 17.88 6.04263 18.2874C7.29594 19.755 9.26182 20.5008 12.0001 20.5008C14.7384 20.5008 16.706 19.755 17.9625 18.2871C18.3114 17.8795 18.5032 17.3605 18.5032 16.824V16.2486C18.5032 15.835 18.1679 15.4997 17.7543 15.4997ZM12.0001 2.00439C14.7615 2.00439 17.0001 4.24297 17.0001 7.00439C17.0001 9.76582 14.7615 12.0044 12.0001 12.0044C9.2387 12.0044 7.00012 9.76582 7.00012 7.00439C7.00012 4.24297 9.2387 2.00439 12.0001 2.00439ZM12.0001 3.50439C10.0671 3.50439 8.50012 5.0714 8.50012 7.00439C8.50012 8.93739 10.0671 10.5044 12.0001 10.5044C13.9331 10.5044 15.5001 8.93739 15.5001 7.00439C15.5001 5.0714 13.9331 3.50439 12.0001 3.50439Z" fill="#212121"/>
</svg>
                          My Profile
                        </div>
                      </A>
                      {/* My Articles link with articles icon */}
                      <A 
                        href="/my-articles"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setIsLinksVisible(false);
                        }}
                      >
                        <div class="flex items-center">
                          {/* Articles icon SVG */}
                          <svg class='mr-2' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#212121" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                          </svg>
                          My Articles
                        </div>
                      </A>
                      {/* Logout button with loading state support */}
                      <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut()}
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div class="flex items-center">
                          {isLoggingOut() ? (
                            // Show loading spinner during logout process
                            <LoadingSpinner size="sm" inline />
                          ) : (
                            // Show logout icon and text when not loading
                            <>
                              {/* Logout icon SVG */}
                              <svg class='w-4 h-4 mr-2' viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21.791 12.1208H9.75"></path> 
                              <path d="M18.8643 9.20483L21.7923 12.1208L18.8643 15.0368" ></path>
                              <path d="M16.3597 7.63C16.0297 4.05 14.6897 2.75 9.35974 2.75C2.25874 2.75 2.25874 5.06 2.25874 12C2.25874 18.94 2.25874 21.25 9.35974 21.25C14.6897 21.25 16.0297 19.95 16.3597 16.37"></path>
                              </svg>
                              Logout
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </Show>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content area with top padding to account for fixed navigation */}
      <main class="absolute top-[72px] left-0 w-full h-fullpt-[72px]">
          {props.children}
      </main>

      {/* Application footer with branding and links */}
      <footer class="bg-neutral-100 text-white">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand and description section */}
            <div class="col-span-1 md:col-span-2">
              <div class="flex items-center mb-4">
                <div class="h-10 w-10 bg-white rounded-xl flex items-center justify-center">
                  <img class='h-8 w-8' src='/logo.svg' />
                </div>
                <span class="ml-3 text- font-bold text-neutral-900" style={{"font-family": "'Faculty Glyphic', sans-serif"}}>
                  robenhod
                </span>
              </div>
              <p class="text-neutral-900 leading-relaxed mb-6 max-w-md">
                A modern platform for writers and readers. Share your stories, discover amazing content, and connect with a community that loves great writing.
              </p>
            </div>
            
            {/* Platform navigation links section */}
            <div>
              <h3 class="text-lg font-semibold mb-4 text-neutral-900">Platform</h3>
              <ul class="space-y-3">
                <li>
                  <A href="/" class="text-neutral-900 hover:text-white transition-colors duration-200">
                    Home
                  </A>
                </li>
                <li>
                  <A href="/create" class="text-neutral-900 hover:text-white transition-colors duration-200">
                    Write
                  </A>
                </li>
                <li>
                  <A href="/signup" class="text-neutral-900 hover:text-white transition-colors duration-200">
                    Join Community
                  </A>
                </li>
              </ul>
            </div>
            
            {/* Legal and informational links section */}
            <div>
              <h3 class="text-lg font-semibold mb-4 text-neutral-900">Legal</h3>
              <ul class="space-y-3">
                <li>
                  <A href="/privacy" class="text-neutral-900 hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </A>
                </li>
                <li>
                  <A href="/terms" class="text-neutral-900 hover:text-white transition-colors duration-200">
                    Terms of Service
                  </A>
                </li>
                <li>
                  <A href="/about" class="text-neutral-900 hover:text-white transition-colors duration-200">
                    About Us
                  </A>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Footer bottom section with copyright and credits */}
          <div class="mt-12 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">
              &copy; 2024 Story Platform. Crafted with ❤️ for writers and readers.
            </p>
            <div class="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-gray-400">
              <span>Built By</span>
              <span class="text-neutral-700">Hatim</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 