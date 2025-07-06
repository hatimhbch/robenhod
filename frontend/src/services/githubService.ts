// githubService.ts - Service for uploading and managing images using GitHub as a CDN
// This service provides image upload functionality by storing files in a GitHub repository

// GitHub API configuration constants
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER;
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO_NAME;
const UPLOAD_PATH = 'images';

// Validate required environment variables at startup
if (!GITHUB_TOKEN) {
  console.error('VITE_GITHUB_TOKEN is required. Please check your .env file.');
}
if (!REPO_OWNER) {
  console.error('VITE_GITHUB_REPO_OWNER is required. Please check your .env file.');
}
if (!REPO_NAME) {
  console.error('VITE_GITHUB_REPO_NAME is required. Please check your .env file.');
}

// Interface defining the structure of GitHub API upload responses
export interface GitHubUploadResponse {
  content: {
    name: string;
    path: string;
    sha: string;
    size: number;
    download_url: string;
    html_url: string;
  };
  commit: {
    sha: string;
    url: string;
  };
}

// Main GitHub service class for handling image operations
class GitHubService {
  // Helper method to make authenticated requests to GitHub API
  // Includes proper headers and error handling for common GitHub API issues
  private async makeRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Provide specific error messages for common GitHub API errors
      if (response.status === 401) {
        throw new Error('Bad credentials. Please check your GitHub token in the .env file.');
      } else if (response.status === 404) {
        throw new Error('Repository not found. Please check your VITE_GITHUB_REPO_OWNER and VITE_GITHUB_REPO_NAME in the .env file.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Please ensure your GitHub token has the correct permissions (repo scope).');
      }
      
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    return response;
  }

  // Generates a unique filename to prevent conflicts in the repository
  // Combines original name with timestamp and random string
  private generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')).replace(/[^a-zA-Z0-9]/g, '-');
    return `${baseName}-${timestamp}-${randomString}${extension}`;
  }

  // Converts a File object to base64 string for GitHub API upload
  // GitHub API requires file content to be base64 encoded
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get pure base64 content
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Main method to upload an image file to GitHub repository
  // Includes validation, file processing, and error handling
  async uploadImage(file: File): Promise<string> {
    try {
      // Validate GitHub configuration before attempting upload
      if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
        throw new Error('GitHub configuration is missing. Please check your .env file for VITE_GITHUB_TOKEN, VITE_GITHUB_REPO_OWNER, and VITE_GITHUB_REPO_NAME.');
      }

      // Validate file type - only allow image formats
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed');
      }

      // Validate file size - limit to 5MB to prevent large uploads
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Generate unique filename and path for the upload
      const fileName = this.generateUniqueFileName(file.name);
      const filePath = `${UPLOAD_PATH}/${fileName}`;

      // Convert file to base64 for GitHub API
      const base64Content = await this.fileToBase64(file);

      // Upload file to GitHub repository using Contents API
      const response = await this.makeRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Upload image: ${fileName}`,
          content: base64Content,
          branch: 'master'
        }),
      });

      const data: GitHubUploadResponse = await response.json();
      
      // Return the direct download URL for the uploaded image
      return data.content.download_url;
    } catch (error) {
      console.error('Error uploading image to GitHub:', error);
      throw error;
    }
  }

  // Method to delete an image from the GitHub repository
  // Requires getting the file SHA first, then deleting with that SHA
  async deleteImage(fileName: string): Promise<void> {
    try {
      const filePath = `${UPLOAD_PATH}/${fileName}`;
      
      // First, get the current file data to obtain its SHA
      const getResponse = await this.makeRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
        method: 'GET',
      });
      
      const fileData = await getResponse.json();
      
      // Delete the file using its SHA
      await this.makeRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
        method: 'DELETE',
        body: JSON.stringify({
          message: `Delete image: ${fileName}`,
          sha: fileData.sha,
          branch: 'master'
        }),
      });
    } catch (error) {
      console.error('Error deleting image from GitHub:', error);
      throw error;
    }
  }
}

// Export singleton instance of the GitHub service
export const githubService = new GitHubService(); 