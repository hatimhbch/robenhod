import { Component, createSignal, onMount, For, Show } from 'solid-js';
import { articleService, Article, PageResponse } from '../../services/articleService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from '@solidjs/router';
import ConfirmDialog from '../common/ConfirmDialog';

const UserArticles: Component = () => {
  const [articles, setArticles] = createSignal<Article[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = createSignal(false);
  const [articleToDelete, setArticleToDelete] = createSignal<Article | null>(null);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [deleteError, setDeleteError] = createSignal('');
  const [successMessage, setSuccessMessage] = createSignal('');
  const { user } = useAuth();
  const navigate = useNavigate();

  onMount(async () => {
    if (!user()) {
      navigate('/login');
      return;
    }

    try {
      const articles = await articleService.getCurrentUserArticles();
      setArticles(articles);
    } catch (err) {
      setError('Failed to load articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  const handleEdit = (article: Article) => {
    navigate(`/${article.authorUsername}/${article.slug}/edit`);
  };

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
    setDeleteError('');
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    const article = articleToDelete();
    if (!article) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      await articleService.deleteArticle(article.id);
      
      // Remove the deleted article from the list
      setArticles(prev => prev.filter(a => a.id !== article.id));
      
      setShowDeleteDialog(false);
      setArticleToDelete(null);
      setSuccessMessage('Article deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setDeleteError(error.message || 'Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setArticleToDelete(null);
    setDeleteError('');
  };

  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-neutral-900">My Articles</h1>
          <button
            onClick={() => navigate('/create')}
            class="inline-flex items-center px-6 py-3 text-sm font-medium rounded-full text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Article
          </button>
        </div>

        {/* Success Message */}
        <Show when={successMessage()}>
          <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700 font-medium">{successMessage()}</p>
              </div>
            </div>
          </div>
        </Show>

        {loading() && (
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          </div>
        )}
        
        {error() && (
          <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
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
        )}
        
        {!loading() && !error() && (
          <Show when={articles().length > 0} fallback={
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No articles</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by creating your first article.</p>
              <div class="mt-6">
                <button
                  onClick={() => navigate('/create')}
                  class="inline-flex items-center px-6 py-3 shadow-sm text-sm font-medium rounded-full text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Article
                </button>
              </div>
            </div>
          }>
            <div class="space-y-6">
              <For each={articles()}>
                {(article) => (
                  <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="p-6">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h2 class="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
                          <p class="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
                          <div class="flex items-center text-sm text-gray-500">
                            <span>Published on {new Date(article.createdAt).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}</span>
                            <span class="mx-2">•</span>
                            <span>{article.likeCount} {article.likeCount === 1 ? 'like' : 'likes'}</span>
                          </div>
                        </div>
                        <div class="flex space-x-2 ml-4">
                          <a
                            href={`/${article.authorUsername}/${article.slug}`}
                            class="inline-flex items-center gap-x-[2px] px-3 py-2 text-xs font-medium rounded-2xl text-gray-700 bg-neutral-50 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                          >
                            <svg class='w-4 h-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7.49976V19.5M12 7.49976L13.7333 6.6332C14.5663 6.21673 15.4849 5.9999 16.4162 5.99988L18.9999 5.99981C20.1045 5.99978 21 6.89522 21 7.99981V15.9998C21 17.1043 20.1046 17.9998 19 17.9998H16.4166C15.485 17.9998 14.5662 18.2167 13.733 18.6334L12 19.5M12 7.49976L10.2667 6.63326C9.43369 6.21681 8.51514 5.99999 7.58379 5.99999H5C3.89543 5.99999 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H7.58359C8.51506 18 9.43374 18.2169 10.2669 18.6334L12 19.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            View
                          </a>
                          <button
                            onClick={() => handleEdit(article)}
                            class="inline-flex items-center gap-x-[2px] px-3 py-2 text-xs font-medium rounded-2xl text-gray-700 bg-neutral-50 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                          >
                            <svg class='w-4 h-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 7.49996L17.5 9.99996M7.5 20L19.25 8.24996C19.9404 7.5596 19.9404 6.44032 19.25 5.74996V5.74996C18.5596 5.0596 17.4404 5.05961 16.75 5.74996L5 17.5V20H7.5ZM7.5 20H15.8787C17.0503 20 18 19.0502 18 17.8786V17.8786C18 17.316 17.7765 16.7765 17.3787 16.3786L17 16M4.5 4.99996C6.5 2.99996 10 3.99996 10 5.99996C10 8.5 4 8.5 4 11C4 11.8759 4.53314 12.5256 5.22583 13" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(article)}
                            class="inline-flex items-center gap-x-[2px] px-3 py-2 text-xs font-medium rounded-2xl text-red-700 bg-red-50 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg class='w-4 h-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z" stroke="#c45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        )}

        {/* Delete confirmation dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog()}
          title="Delete Article"
          message={`Are you sure you want to delete "${articleToDelete()?.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isLoading={isDeleting()}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />

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
    </div>
  );
};

export default UserArticles;
