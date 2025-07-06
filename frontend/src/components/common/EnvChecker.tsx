// EnvChecker.tsx - Diagnostic component for checking environment variables
// This component helps debug configuration issues in production environments

import { Component, createSignal, onMount } from 'solid-js';
import { debugApiConfig } from '../../config/api';

// Interface for environment status
interface EnvStatus {
  apiBaseUrl: string | undefined;
  environment: string;
  isProduction: boolean;
  isDevelopment: boolean;
  githubToken: boolean;
  allVariables: Record<string, any>;
}

// Diagnostic component for environment variables
const EnvChecker: Component = () => {
  const [envStatus, setEnvStatus] = createSignal<EnvStatus | null>(null);
  const [showDetails, setShowDetails] = createSignal(false);

  // Check environment variables on component mount
  onMount(() => {
    const status: EnvStatus = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      environment: import.meta.env.MODE,
      isProduction: import.meta.env.PROD,
      isDevelopment: import.meta.env.DEV,
      githubToken: !!import.meta.env.VITE_GITHUB_TOKEN,
      allVariables: import.meta.env
    };
    
    setEnvStatus(status);
    
    // Debug in console
    debugApiConfig();
    console.log('Full environment status:', status);
  });

  // Test API connectivity
  const testApiConnection = async () => {
    const status = envStatus();
    if (!status?.apiBaseUrl) {
      alert('❌ Cannot test API: VITE_API_BASE_URL is not set!');
      return;
    }

    try {
      console.log('Testing API connection to:', status.apiBaseUrl);
      const response = await fetch(`${status.apiBaseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        alert('✅ API connection successful!');
      } else {
        alert(`❌ API connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('API test error:', error);
      alert(`❌ API connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const status = envStatus();
  if (!status) return <div>Loading environment check...</div>;

  return (
    <div class="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 class="font-bold text-lg mb-3 text-gray-800">🔧 Environment Debug</h3>
      
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span>Environment:</span>
          <span class={`font-mono ${status.isProduction ? 'text-red-600' : 'text-green-600'}`}>
            {status.environment}
          </span>
        </div>
        
        <div class="flex justify-between">
          <span>API Base URL:</span>
          <span class={`font-mono text-xs ${status.apiBaseUrl ? 'text-green-600' : 'text-red-600'}`}>
            {status.apiBaseUrl || '❌ NOT SET'}
          </span>
        </div>
        
        <div class="flex justify-between">
          <span>GitHub Token:</span>
          <span class={status.githubToken ? 'text-green-600' : 'text-red-600'}>
            {status.githubToken ? '✅ Set' : '❌ Missing'}
          </span>
        </div>
      </div>

      <div class="mt-4 space-y-2">
        <button 
          onClick={testApiConnection}
          class="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
          disabled={!status.apiBaseUrl}
        >
          Test API Connection
        </button>
        
        <button 
          onClick={() => setShowDetails(!showDetails())}
          class="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
        >
          {showDetails() ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {showDetails() && (
        <div class="mt-4 p-3 bg-gray-100 rounded text-xs">
          <h4 class="font-bold mb-2">All Environment Variables:</h4>
          <pre class="whitespace-pre-wrap overflow-auto max-h-40">
            {JSON.stringify(status.allVariables, null, 2)}
          </pre>
        </div>
      )}

      {status.isProduction && !status.apiBaseUrl && (
        <div class="mt-4 p-3 bg-red-100 border border-red-300 rounded">
          <p class="text-red-700 text-sm font-bold">⚠️ Production Issue Detected!</p>
          <p class="text-red-600 text-xs mt-1">
            VITE_API_BASE_URL is not set in production. Check your deployment platform's environment variables.
          </p>
        </div>
      )}
    </div>
  );
};

export default EnvChecker; 