import { A } from '@solidjs/router';
import { Component } from 'solid-js';
import { useAuth } from '../hooks/useAuth';

const Navbar: Component = () => {
  const { user } = useAuth();

  return (
    <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
          </div>
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0">
              <A href="/" class="text-white text-lg font-bold">
                Solid Blog
              </A>
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                <A href="/" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </A>
                <A href="/about" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  About
                </A>
                {user() && (
                  <>
                    <A
                      href="/my-articles"
                      class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Articles
                    </A>
                    {/* ...existing user menu items... */}
                  </>
                )}
              </div>
            </div>
          </div>
          {/* ...existing code... */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;