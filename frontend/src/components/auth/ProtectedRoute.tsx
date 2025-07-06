// ProtectedRoute.tsx - Component that guards routes requiring authentication
// This component checks authentication status and shows login prompt for unauthorized users

import { Component, JSX, createSignal, createEffect, Show } from 'solid-js';
import { authService } from '../../services/authService';
import AuthAlert from './AuthAlert';

// Interface defining props for the ProtectedRoute component
interface ProtectedRouteProps {
  children: JSX.Element;  // The component/content to render if authenticated
  feature?: string;  // Optional description of the feature being protected
}

// Main ProtectedRoute component that conditionally renders content based on authentication
const ProtectedRoute: Component<ProtectedRouteProps> = (props) => {
  // State for controlling authentication alert modal visibility
  const [showAuthAlert, setShowAuthAlert] = createSignal(false);
  // State for tracking authentication status
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  
  // Effect that runs on component mount to check authentication status
  createEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    // Show auth alert if user is not authenticated
    if (!authenticated) setShowAuthAlert(true);
  });

  return (
    <>
      {isAuthenticated() ? props.children : (
        <>
          {/* Loading skeleton while checking authentication */}
          <div class="min-h-screen bg-gray-50 flex items-center justify-center">
            <div class="text-center animate-pulse">
              <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
          {/* Authentication alert modal for unauthenticated users */}
          <AuthAlert
            isOpen={showAuthAlert()}
            onClose={() => setShowAuthAlert(false)}
            feature={props.feature || 'access this feature'}
          />
        </>
      )}
    </>
  );
};

export default ProtectedRoute; 