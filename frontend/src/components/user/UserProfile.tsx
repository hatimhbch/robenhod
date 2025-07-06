import { Component, createResource, createSignal, onMount, Show, For } from 'solid-js';
import { A, useParams, useNavigate, useLocation } from '@solidjs/router';
import { articleService, Article } from '../../services/articleService';
import { authService } from '../../services/authService';

const UserProfile: Component = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [articles, setArticles] = createSignal<Article[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [currentPage, setCurrentPage] = createSignal(0);
  const [hasMore, setHasMore] = createSignal(true);
  const [username, setUsername] = createSignal<string | null>(null);

  onMount(async () => {
    const userParam = params.id; // This comes from the route /user/:id
    console.log("User param:", userParam);
    
    if (!userParam) {
      setError("No user identifier provided");
      setLoading(false);
      return;
    }

    // Check if the user is viewing their own profile
    const currentUser = authService.getUserInfo();
    if (currentUser && currentUser.username === userParam) {
      // Redirect to the profile page for the current user
      navigate('/profile');
      return;
    }

    setUsername(userParam);
    await loadArticles();
  });

  const loadArticles = async (isLoadMore = false) => {
    const currentUsername = username();
    if (!currentUsername) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading articles for username:', currentUsername);
      
      // Use the getUserArticlesByUsername method which expects a username
      const response = await articleService.getUserArticlesByUsername(
        currentUsername, 
        isLoadMore ? currentPage() + 1 : 0,
        10
      );
      
      handleResponse(response, isLoadMore);
      
    } catch (err: any) {
      console.error('Failed to load articles:', err);
      setError('User not found. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (response: any, isLoadMore: boolean) => {
    if (response.content && Array.isArray(response.content)) {
      if (isLoadMore) {
        setArticles(prev => [...prev, ...response.content]);
      } else {
        setArticles(response.content);
      }
      setHasMore(!response.last);
      setCurrentPage(response.number);
    } else {
      throw new Error('Invalid response format');
    }
  };

  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-4 py-12">
        {error() ? (
          <div class="text-red-500 text-center p-6 bg-red-50 rounded-lg">
            <h3 class="font-bold text-lg mb-2">Error</h3>
            <p class="mb-4">{error()}</p>
            <div class="mt-4 text-sm text-gray-700 bg-gray-100 p-3 rounded">
              <p class="font-medium">Debug info:</p>
              <p>URL: {location.pathname}</p>
              <p>Params: {JSON.stringify(params)}</p>
            </div>
            <button 
              onClick={() => navigate('/')} 
              class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div class="space-y-6">
            {username() !== null && (
              <div class="mb-8 text-center">
                <div class="h-20 w-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {username()![0].toUpperCase()}
                </div>
                <h1 class="text-3xl font-bold text-gray-900">@{username()}</h1>
                <p class="text-gray-600 mt-2">
                  {articles().length} article{articles().length !== 1 ? 's' : ''} published
                </p>
              </div>
            )}
            
            {loading() && (
              <div class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p class="mt-2 text-gray-600">Loading articles...</p>
              </div>
            )}

            {!loading() && articles().length > 0 ? (
              <div class="grid gap-6">
                {articles().map(article => (
                  <article class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between mb-3">
                      <h2 class="text-xl font-bold text-gray-900 flex-1">{article.title}</h2>
                      <span class="text-sm text-gray-500 ml-4">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p class="text-gray-600 mb-4 leading-relaxed">
                      {article.description}
                    </p>
                    <div class="flex items-center justify-between">
                      <A 
                        href={`/${article.authorUsername}/${article.slug}`} 
                        class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Read article →
                      </A>
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span>❤️ {article.likeCount}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : !loading() ? (
              <div class="text-center py-12">
                <div class="text-gray-400 text-6xl mb-4">📝</div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">No articles yet</h3>
                <p class="text-gray-600">
                  {username()} hasn't published any articles yet.
                </p>
              </div>
            ) : null}

            {!loading() && hasMore() && articles().length > 0 && (
              <div class="text-center">
                <button
                  onClick={() => loadArticles(true)}
                  class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Load more articles
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;