import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div class="min-h-screen bg-white flex items-center justify-center">
      <div class="max-w-lg mx-auto text-center px-4">
        <h1 class="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p class="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div class="space-y-4">
          <A
            href="/"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </A>
          
          <div class="flex justify-center space-x-4 text-sm">
            <A href="/about" class="text-neutral-900 hover:underline">
              About
            </A>
            <span class="text-gray-400">•</span>
            <A href="/create" class="text-neutral-900 hover:underline">
              Write Article
            </A>
            <span class="text-gray-400">•</span>
            <A href="/login" class="text-neutral-900 hover:underline">
              Login
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}
