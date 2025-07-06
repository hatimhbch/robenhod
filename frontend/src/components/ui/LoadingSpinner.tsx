// LoadingSpinner.tsx - Reusable loading spinner component with multiple themes and sizes
// This component provides visual feedback during loading states with customizable appearance

import { Component } from 'solid-js';

// Interface defining the props for configuring spinner appearance and behavior
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';  // Size variants for different use cases
  theme?: 'primary' | 'white' | 'dark';  // Color themes for different backgrounds
  text?: string;  // Optional loading text to display
  inline?: boolean;  // Whether to display as inline element or block
}

// Main LoadingSpinner component with customizable size, theme, and text
const LoadingSpinner: Component<LoadingSpinnerProps> = (props) => {
  // Function to determine CSS classes for spinner size
  // Maps size prop to corresponding Tailwind classes
  const sizeClass = () => {
    const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12', xl: 'h-16 w-16' };
    return sizes[props.size || 'md'];
  };

  // Function to determine CSS classes for spinner theme/color
  // Provides different color schemes for various backgrounds
  const themeClass = () => {
    const themes = {
      primary: 'border-neutral-900 border-t-transparent',
      white: 'border-white border-t-transparent',
      dark: 'border-gray-800 border-t-transparent'
    };
    return themes[props.theme || 'primary'];
  };

  // Function to determine text size classes based on spinner size
  // Ensures text scales appropriately with spinner size
  const textSize = () => {
    const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' };
    return sizes[props.size || 'md'];
  };

  // Function to determine dot colors for the animated dots
  // Matches dot colors with the selected theme
  const dotColor = () => {
    const colors = { primary: 'bg-neutral-900', white: 'bg-white', dark: 'bg-gray-800' };
    return colors[props.theme || 'primary'];
  };

  // Function to determine text color based on theme
  // Ensures text is visible against different backgrounds
  const textColor = () => {
    const colors = { primary: 'text-gray-600', white: 'text-white', dark: 'text-gray-800' };
    return colors[props.theme || 'primary'];
  };

  return (
    <div class={`${props.inline ? 'inline-flex' : 'flex'} items-center justify-center space-x-3`}>
      {/* Main spinning circle animation */}
      <div class={`animate-spin rounded-full border-2 ${sizeClass()} ${themeClass()}`}></div>
      {/* Animated dots with staggered timing */}
      <div class="flex space-x-1">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div 
            class={`${dotColor()} rounded-full animate-pulse w-1 h-1`}
            style={`animation-delay: ${delay}s;`}
          />
        ))}
      </div>
      {/* Optional loading text with pulse animation */}
      {props.text && (
        <span class={`${textSize()} ${textColor()} font-medium animate-pulse`}>
          {props.text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner; 