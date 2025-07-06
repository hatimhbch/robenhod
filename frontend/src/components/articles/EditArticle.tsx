import { Component, createSignal, createResource, Show, createEffect } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { articleService, ArticleRequest } from '../../services/articleService';
import ImageUpload from '../common/ImageUpload';
import { A } from '@solidjs/router';

const EditArticle: Component = () => {
  const navigate = useNavigate();
  const params = useParams<{ username: string; slug: string }>();
  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [content, setContent] = createSignal('');
  const [slug, setSlug] = createSignal('');
  const [imageUrl, setImageUrl] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [success, setSuccess] = createSignal(false);
  const [isInitialized, setIsInitialized] = createSignal(false);

  // Fetch the article to edit
  const [article] = createResource(
    () => params.slug,
    async (slug) => {
      try {
        return await articleService.getArticle(slug);
      } catch (error) {
        console.error('Error loading article for editing:', error);
        throw error;
      }
    }
  );

  // Initialize form fields when article data is loaded
  createEffect(() => {
    const articleData = article();
    if (articleData && !isInitialized()) {
      setTitle(articleData.title);
      setDescription(articleData.description);
      setContent(articleData.content);
      setSlug(articleData.slug);
      setImageUrl(articleData.imageUrl || '');
      setIsInitialized(true);
    }
  });

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug() || slug() === generateSlug(title())) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const articleData = article();
    if (!articleData) {
      setError('Article data not loaded');
      setIsLoading(false);
      return;
    }

    if (!title().trim() || !description().trim() || !content().trim() || !slug().trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (title().trim().length > 255) {
      setError('Title must be less than 255 characters');
      setIsLoading(false);
      return;
    }

    if (description().trim().length > 255) {
      setError('Description must be less than 255 characters');
      setIsLoading(false);
      return;
    }

    if (slug().trim().length > 255) {
      setError('URL slug must be less than 255 characters');
      setIsLoading(false);
      return;
    }

    if (imageUrl().trim().length > 255) {
      setError('Image URL must be less than 255 characters');
      setIsLoading(false);
      return;
    }

    try {
      const articleRequest: ArticleRequest = {
        title: title().trim(),
        description: description().trim(),
        content: content().trim(),
        slug: slug().trim(),
        imageUrl: imageUrl().trim()
      };

      console.log('Updating article with data:', articleRequest);
      const updatedArticle = await articleService.updateArticle(articleData.id, articleRequest);
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/${updatedArticle.authorUsername}/${updatedArticle.slug}`);
      }, 1500);
    } catch (err: any) {
      console.error('Edit article error:', err);
      let errorMessage = err.message || 'Failed to update article';
      
      // Provide more specific error messages for common issues
      if (errorMessage.includes('Network error') || errorMessage.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please make sure the backend is running on http://localhost:8080';
      } else if (errorMessage.includes('CORS')) {
        errorMessage = 'CORS error: Please check if the backend allows requests from this domain';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const articleData = article();
    if (articleData) {
      navigate(`/${articleData.authorUsername}/${articleData.slug}`);
    } else {
      navigate('/');
    }
  };

  // Function to check if error is article not found
  const isArticleNotFound = () => {
    return article.error && article.error instanceof Error && article.error.message === 'ARTICLE_NOT_FOUND';
  };

  // Article Not Found Component for Edit
  const EditArticleNotFound = () => (
    <div class="min-h-screen bg-white flex items-center justify-center">
      <div class="max-w-md mx-auto text-center px-4">
        <div class="mb-8">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p class="text-lg text-gray-600 mb-8">
          The article you're trying to edit doesn't exist or may have been removed.
        </p>
        <div class="space-y-4">
          <A
            href="/my-articles"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Articles
          </A>
          <div class="text-sm text-gray-500">
            <p>Go back to <A href="/" class="text-neutral-900 hover:underline">home page</A> or <A href="/create" class="text-neutral-900 hover:underline">create a new article</A></p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <Show
          when={!article.error && article()}
          fallback={
            <Show
              when={isArticleNotFound()}
              fallback={
                <div class="text-center">
                  <Show when={article.loading}>
                    <div class="animate-pulse space-y-4">
                      <div class="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  </Show>
                  <Show when={article.error}>
                    <div class="text-red-500 py-8">
                      <p class="text-lg font-medium">Failed to load article</p>
                      <p class="text-sm mt-2">Please try again later.</p>
                    </div>
                  </Show>
                </div>
              }
            >
              <EditArticleNotFound />
            </Show>
          }
        >
          <div class="text-center mb-16">
            <h1 class="text-5xl font-bold text-neutral-900 mb-6">Edit Article</h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Update your article to improve its content and reach. Make changes that will engage your readers even more.
            </p>
          </div>

          <div class="prose prose-lg max-w-none">
            {/* Success Message */}
            <Show when={success()}>
              <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-green-700 font-medium">
                      Article updated successfully! Redirecting...
                    </p>
                  </div>
                </div>
              </div>
            </Show>

            {/* Error Message */}
            <Show when={error()}>
              <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700 font-medium">{error()}</p>
                  </div>
                </div>
              </div>
            </Show>

            {/* Form */}
            <form onSubmit={handleSubmit} class="space-y-8">
              {/* Title Field */}
              <div>
                <input
                  id="title"
                  type="text"
                  value={title()}
                  onInput={(e) => handleTitleChange(e.currentTarget.value)}
                  placeholder="Enter an engaging title for your article..."
                  class="w-full px-3 py-3 border text-sm bg-white border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading() || success()}
                  required
                  maxLength={255}
                />
              </div>

              {/* Description Field */}
              <div>
                <input
                  id="description"
                  type="text"
                  value={description()}
                  onInput={(e) => setDescription(e.currentTarget.value)}
                  placeholder="Enter an engaging description for your article..."
                  class="w-full px-3 py-3 border text-sm bg-white border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading() || success()}
                  required
                  maxLength={255}
                />
              </div>

              {/* Slug Field */}
              <div>
                <input
                  id="slug"
                  type="text"
                  value={slug()}
                  onInput={(e) => setSlug(e.currentTarget.value)}
                  placeholder="article-url-slug"
                  class="w-full px-3 py-3 border text-sm bg-white border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading() || success()}
                  required
                  maxLength={255}
                />
              </div>

              {/* Content Field */}
              <div>
                <textarea
                  id="content"
                  value={content()}
                  onInput={(e) => setContent(e.currentTarget.value)}
                  placeholder="Write your article content here... You can use Markdown formatting!"
                  rows={15}
                  class="w-full px-3 py-3 border text-sm bg-white border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[300px]"
                  disabled={isLoading() || success()}
                  required
                />
              </div>

              {/* Image Upload Field */}
              <div>
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  disabled={isLoading() || success()}
                  currentImageUrl={imageUrl()}
                />
              </div>

              {/* Action Buttons */}
              <div class="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading() || success()}
                  class="w-full bg-neutral-900 text-white p-3 text-sm rounded-2xl hover:bg-neutral-800 transition-colors font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading() ? 'Updating...' : 'Update Article'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading() || success()}
                  class="w-full bg-gray-100 text-gray-700 p-3 text-sm rounded-2xl hover:bg-gray-200 transition-colors font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default EditArticle; 