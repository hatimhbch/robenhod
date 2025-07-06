// index.tsx - Application entry point that renders the main App component
// This file is responsible for mounting the SolidJS application to the DOM

// SolidJS render function for mounting components to the DOM
import { render } from 'solid-js/web';
// Main application component
import App from './App';

// Get the root DOM element where the app will be mounted
const root = document.getElementById('root');

// Development mode check to ensure root element exists
// This helps catch configuration issues during development
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mixed up?'
  );
}

// Render the App component into the root DOM element
// The non-null assertion (!) is safe here due to the check above
render(() => <App />, root!);
