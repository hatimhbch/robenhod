// api.ts - Utility functions for making API calls related to article interactions
// This file contains helper functions for article like operations

// Interface defining the structure of API responses
// Provides consistent response format with success/error handling
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Toggles the like status for a specific article
// Requires authentication and returns updated like data
export const toggleArticleLike = async (articleId: number): Promise<ApiResponse> => {
  try {
    // Check for authentication token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Make API request to toggle like status
    const response = await fetch(`/api/articles/${articleId}/likes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Fetches the like count and user's like status for a specific article
// Works for both authenticated and unauthenticated users
export const getArticleLikes = async (articleId: number): Promise<ApiResponse> => {
  try {
    // Get token if available (optional for this endpoint)
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Include authorization header if user is authenticated
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Fetch article like data
    const response = await fetch(`/api/articles/${articleId}/likes`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch likes');
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
