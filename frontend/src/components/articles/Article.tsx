import { Component, createResource, Show, Suspense, onMount, createSignal } from 'solid-js';
import { useParams, A, useNavigate } from '@solidjs/router';
import { articleService } from '../../services/articleService';
import { useAuth } from '../../hooks/useAuth';
import LikeButton from '../ui/LikeButton';
import ConfirmDialog from '../common/ConfirmDialog';

const Article: Component = () => {
  const params = useParams<{ username: string; slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isClientSide, setIsClientSide] = createSignal(false);
  const [showDeleteDialog, setShowDeleteDialog] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [deleteError, setDeleteError] = createSignal('');
  
  const [article] = createResource(
    () => isClientSide() ? params.slug : null,
    async (slug) => {
      if (!slug) return null;
      return await articleService.getArticle(slug);
    }
  );
  
  onMount(() => {
    setIsClientSide(true);
  });

  const formattedPublishDate = (date: string) => new Date(date).toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const isAuthor = () => {
    const currentUser = user();
    const articleData = article();
    return currentUser && articleData && currentUser.username === articleData.authorUsername;
  };

  const handleEdit = () => {
    const articleData = article();
    if (articleData) {
      navigate(`/${articleData.authorUsername}/${articleData.slug}/edit`);
    }
  };

  const handleDeleteClick = () => {
    console.log('Delete button clicked');
    setDeleteError('');
    setShowDeleteDialog(true);
    console.log('Delete dialog should be shown:', showDeleteDialog());
  };

  const handleDeleteConfirm = async () => {
    console.log('Delete confirm clicked');
    const articleData = article();
    if (!articleData) {
      console.log('No article data available');
      return;
    }

    console.log('Deleting article:', articleData.id);
    setIsDeleting(true);
    setDeleteError('');

    try {
      await articleService.deleteArticle(articleData.id);
      console.log('Article deleted successfully');
      setShowDeleteDialog(false);
      navigate('/');
    } catch (error: any) {
      console.error('Delete error:', error);
      setDeleteError(error.message || 'Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    console.log('Delete cancelled');
    setShowDeleteDialog(false);
    setDeleteError('');
  };

  // Function to check if error is article not found
  const isArticleNotFound = () => {
    return article.error && article.error instanceof Error && article.error.message === 'ARTICLE_NOT_FOUND';
  };

  // Function to check if error is forbidden
  const isArticleForbidden = () => {
    return article.error && article.error instanceof Error && article.error.message === 'ARTICLE_FORBIDDEN';
  };

  // Article Not Found Component
  const ArticleNotFound = () => (
    <div class="min-h-screen bg-white flex items-center justify-center">
      <div class="max-w-md mx-auto text-center px-4">
        <h1 class="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Article Not Found</h2>
        <p class="text-lg text-gray-600 mb-8">
          The article you're looking for doesn't exist or may have been removed.
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
          <div class="text-sm text-gray-500">
            <p>Looking for something specific? <A href="/" class="text-neutral-900 hover:underline">Browse all articles</A></p>
          </div>
        </div>
      </div>
    </div>
  );

  // Article Forbidden Component
  const ArticleForbidden = () => (
    <div class="min-h-screen bg-white flex items-center justify-center">
      <div class="max-w-md mx-auto text-center px-4">
        <div class="mb-8">
          <svg class="mx-auto h-24 w-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Access Restricted</h1>
        <p class="text-lg text-gray-600 mb-8">
          You don't have permission to view this article.
        </p>
        <div class="space-y-4">
          <A
            href="/"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </A>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-white">
      <main class="w-full mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div class="max-w-[920px] mx-auto px-4 py-8">
              <div class="animate-pulse space-y-4">
                <div class="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                <div class="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div class="w-full h-0 pb-[52.5%] relative">
                  <div class="absolute inset-0 bg-gray-200 rounded-xl"></div>
                </div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded"></div>
                  <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div class="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          }
        >
          <Show
            when={!article.error}
            fallback={
              <Show
                when={isArticleNotFound()}
                fallback={
                  <Show
                    when={isArticleForbidden()}
                    fallback={
                      <div class="max-w-[920px] mx-auto px-4 py-8">
                        <div class="text-red-500 text-center py-8 bg-white rounded-lg shadow-sm p-6">
                          <p class="text-lg font-medium">Failed to load article</p>
                          <p class="text-sm mt-2">Please try again later.</p>
                        </div>
                      </div>
                    }
                  >
                    <ArticleForbidden />
                  </Show>
                }
              >
                <ArticleNotFound />
              </Show>
            }
          >
            <Show when={article()}>
              {(articleData) => {
                return (
                  <article class="max-w-[920px] mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div class="flex mt-16 mx-auto items-center justify-center h-4 relative">
                      <p class="font-medium text-xs text-center text-gray-600">
                        {formattedPublishDate(articleData().createdAt)}
                      </p>
                      <p class="font-light px-2 text-center text-gray-600">|</p>
                      <div class="flex items-center space-x-2">
                        <A 
                          href={`/user/${articleData().authorUsername}`} 
                          class="font-medium text-xs hover:text-blue-600 transition-colors text-gray-600"
                        >
                          {articleData().authorUsername}
                        </A>
                      </div>

                      {/* Edit/Delete buttons (only visible to author) */}
                      <Show when={isAuthor()}>
                        <div class="absolute top-[-80px] flex space-x-2">
                          <button
                            onClick={handleEdit}
                            class="inline-flex items-center px-3 py-2 gap-x-[2px] text-xs font-medium rounded-2xl text-gray-700 bg-neutral-50 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                          >
                            <svg class='w-4 h-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 7.49996L17.5 9.99996M7.5 20L19.25 8.24996C19.9404 7.5596 19.9404 6.44032 19.25 5.74996V5.74996C18.5596 5.0596 17.4404 5.05961 16.75 5.74996L5 17.5V20H7.5ZM7.5 20H15.8787C17.0503 20 18 19.0502 18 17.8786V17.8786C18 17.316 17.7765 16.7765 17.3787 16.3786L17 16M4.5 4.99996C6.5 2.99996 10 3.99996 10 5.99996C10 8.5 4 8.5 4 11C4 11.8759 4.53314 12.5256 5.22583 13" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            Edit
                          </button>
                          <button
                            onClick={handleDeleteClick}
                            class="inline-flex items-center px-3 py-2 gap-x-[2px] text-xs font-medium rounded-2xl text-red-700 bg-red-50 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg class='w-4 h-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z" stroke="#c45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

                            Delete
                          </button>
                        </div>
                      </Show>
                    </div>

                    {/* Title */}
                    <h1 class="text-4xl font-semibold text-center mt-3 mb-4 text-black mx-auto leading-tight">
                      {articleData().title}
                    </h1>

                    {/* Description */}
                    <div class="text-base text-gray-700 text-center mb-8 w-[75%] mx-auto leading-relaxed">
                      {articleData().description}
                    </div>

                    {/* Like Button - Centered */}
                    <div class="flex justify-center mb-8">
                      <LikeButton
                        articleId={articleData().id}
                        initialLikeCount={articleData().likeCount}
                        initialHasLiked={articleData().hashLiked}
                      />
                    </div>

                    {/* Featured Image */}
                    <Show when={articleData().imageUrl}>
                      <div class="w-full h-0 pb-[52.5%] relative mb-8">
                        <picture class="absolute inset-0">
                          <img 
                            class="w-full h-full object-cover rounded-xl border border-solid border-neutral-200" 
                            style={{ 
                              "z-index": '-10',
                              "transform": "translateZ(0)",
                              "will-change": "transform"
                            }}
                            src={articleData().imageUrl}
                            alt={articleData().title} 
                            width={1200} 
                            height={630} 
                            sizes="100vw"
                            loading="eager" 
                            decoding="async" 
                          />
                        </picture>
                      </div>
                    </Show>

                    {/* Content */}
                    <div 
                      class="content prose prose-lg mt-8 space-y-4 px-24 py-10 sm:px-0 z-10 prose-headings:text-black prose-p:text-gray-800 max-w-none" 
                      style={{ "transform": "translateZ(0)" }}
                    >
                      <div class="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                        {articleData().content}
                      </div>
                    </div>
                  </article>
                );
              }}
            </Show>
          </Show>
        </Suspense>
      </main>

      {/* Delete confirmation dialog */}
      <Show when={showDeleteDialog()}>
        <div class="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Article</h3>
            <p class="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div class="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting()}
                class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting()}
                class="px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting() ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Delete error message */}
      <Show when={deleteError()}>
        <div class="fixed bottom-4 right-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-lg z-50">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 font-medium">{deleteError()}</p>
            </div>
            <div class="ml-auto pl-3">
              <button
                onClick={() => setDeleteError('')}
                class="inline-flex text-red-400 hover:text-red-600"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Article;