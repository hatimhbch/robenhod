// articleService.ts - Service for managing articles including CRUD operations and likes
// This service handles all article-related API calls with authentication and error handling

// Utility functions and authentication service
import { getToken } from '../utils/storage';
import { authService } from './authService';
// API configuration for article endpoints
import { API_ARTICLES_URL, debugApiConfig } from '../config/api';

const API_URL = API_ARTICLES_URL;

// Debug API configuration if there are issues
console.log('🔧 Article Service Debug:');
console.log('- API_URL:', API_URL);
console.log('- Environment:', import.meta.env.MODE);

if (!API_URL || API_URL.includes('undefined')) {
  console.error('🚨 Article Service: Invalid API_URL detected!');
  console.error('API_ARTICLES_URL:', API_ARTICLES_URL);
  debugApiConfig();
}

// Interface defining the structure for creating/updating article requests
export interface ArticleRequest {
  title: string;
  description: string;
  content: string;
  slug: string;
  imageUrl: string;
}

// Interface defining the complete structure of an article object
export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  imageUrl: string;
  authorUsername: string;
  authorId: number;
  createdAt: string;
  likeCount: number;
  hashLiked: boolean;
}

// Interface defining the structure for like operation responses
export interface LikeResponse {
  hasLiked: boolean;
  likeCount: number;
}

// Interface defining the structure for paginated API responses
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Helper function to handle token expiration and redirect to login
// Checks for 401 status and automatically logs out user if token is expired
const handleTokenExpiration = (response: Response) => {
  if (response.status === 401) {
    authService.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Your session has expired. Please log in again.');
  }
};

// Helper function to normalize article data from API responses
// Ensures boolean properties are properly typed
const normalizeArticle = (article: any): Article => {
  return {
    ...article,
    hashLiked: Boolean(article.hashLiked)
  };
};

// Main article service object containing all article-related methods
export const articleService = {
  // Fetches a paginated list of all articles with optional authentication
  // Returns paginated response with normalized article data
  async getAllArticles(page: number = 0, size: number = 10): Promise<PageResponse<Article>> {
    try {
      // Build URL with pagination parameters
      const url = new URL(API_URL);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', size.toString());

      // Include auth token if user is logged in (for like status)
      const token = getToken();
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url.toString(), {
        headers
      });
      
      if (!response.ok) {
        handleTokenExpiration(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        ...data,
        content: data.content.map(normalizeArticle)
      };
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Fetches a single article by its slug with optional authentication
  // Returns normalized article data with like status if user is authenticated
  async getArticle(slug: string): Promise<Article> {
    try {
      // Include auth token if available for like status
      const token = typeof window !== 'undefined' ? getToken() : null;
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/slug/${slug}`, {
        headers
      });
      
      if (!response.ok) {
        handleTokenExpiration(response);
        console.error('Server response:', response.status, response.statusText);
        
        // Handle specific status codes with appropriate error messages
        if (response.status === 404) {
          throw new Error('ARTICLE_NOT_FOUND');
        } else if (response.status === 403) {
          throw new Error('ARTICLE_FORBIDDEN');
        } else if (response.status === 500) {
          throw new Error('SERVER_ERROR');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return normalizeArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      
      // Re-throw specific errors as-is for proper handling
      if (error instanceof Error && 
          (error.message === 'ARTICLE_NOT_FOUND' || 
           error.message === 'ARTICLE_FORBIDDEN' || 
           error.message === 'SERVER_ERROR')) {
        throw error;
      }
      
      // For network/other errors, provide generic message
      throw new Error('NETWORK_ERROR');
    }
  },

  // Creates a new article - requires authentication
  // Returns the created article data with comprehensive error handling
  async createArticle(article: ArticleRequest): Promise<Article> {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      console.log('Creating article with data:', article);
      console.log('Using token:', token ? 'Token present' : 'No token');
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(article)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        handleTokenExpiration(response);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        
        // Parse error response and provide meaningful error messages
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        let errorMessage = errorData.message || errorText;
        if (response.status === 400) {
          errorMessage = `Validation error: ${errorMessage}`;
        } else if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to create articles.';
        }
        
        throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return normalizeArticle(data);
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Updates an existing article by ID - requires authentication
  // Returns the updated article data
  async updateArticle(id: number, articleRequest: ArticleRequest): Promise<Article> {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const updateUrl = `${API_URL}/${id}`;
      console.log('Update Article Debug:');
      console.log('- API_URL:', API_URL);
      console.log('- Update URL:', updateUrl);
      console.log('- Article ID:', id);
      console.log('- Request data:', articleRequest);
      console.log('- Token present:', !!token);
      
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleRequest)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        handleTokenExpiration(response);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        // Parse error response and provide meaningful error messages
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        let errorMessage = errorData.message || errorText;
        if (response.status === 400) {
          errorMessage = `Validation error: ${errorMessage}`;
        } else if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to edit this article.';
        } else if (response.status === 404) {
          errorMessage = 'Article not found.';
        }
        
        throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Update successful, response data:', data);
      return normalizeArticle(data);
    } catch (error) {
      console.error('Error updating article:', error);
      // If it's a network error (fetch failed), provide more specific error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  // Deletes an article by ID - requires authentication
  // Returns void on successful deletion
  async deleteArticle(id: number): Promise<void> {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const deleteUrl = `${API_URL}/${id}`;
      console.log('Delete Article Debug:');
      console.log('- API_URL:', API_URL);
      console.log('- Delete URL:', deleteUrl);
      console.log('- Article ID:', id);
      console.log('- Token present:', !!token);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        handleTokenExpiration(response);
        const errorText = await response.text();
        console.error('Delete error response body:', errorText);
        
        let errorMessage = errorText;
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to delete this article.';
        } else if (response.status === 404) {
          errorMessage = 'Article not found.';
        }
        
        throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
      }
      
      console.log('Article deleted successfully');
    } catch (error) {
      console.error('Error deleting article:', error);
      // If it's a network error (fetch failed), provide more specific error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  // Toggles like status for an article - requires authentication
  // Returns updated article data with new like count and status
  async toggleLike(articleId: number): Promise<Article> {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_URL}/${articleId}/likes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        handleTokenExpiration(response);
        if (response.status === 403) {
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return normalizeArticle(data);
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Fetches articles by a specific username with pagination
  // Public endpoint that doesn't require authentication
  async getUserArticlesByUsername(username: string, page: number = 0, size: number = 10): Promise<PageResponse<Article>> {
    try {
      // Build URL with username and pagination parameters
      const url = new URL(`${API_URL}/user/${username}`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', size.toString());

      const response = await fetch(url.toString());
      if (!response.ok) {
        handleTokenExpiration(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching user articles:', error);
      throw error;
    }
  },

  // Fetches articles for the currently authenticated user
  // Requires authentication and returns all user's articles
  async getCurrentUserArticles(): Promise<Article[]> {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        handleTokenExpiration(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.map(normalizeArticle);
    } catch (error) {
      console.error('Error fetching current user articles:', error);
      throw error;
    }
  }
};