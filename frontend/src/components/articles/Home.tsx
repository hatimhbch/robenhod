import { Component, createSignal, onMount, Show, For } from 'solid-js';
import { Article, articleService, PageResponse } from '../../services/articleService';
import { A } from '@solidjs/router';
import LoadingSpinner from '../ui/LoadingSpinner';

const Home: Component = () => {
  const [articles, setArticles] = createSignal<Article[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [initialLoading, setInitialLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [currentPage, setCurrentPage] = createSignal(0);
  const [hasMore, setHasMore] = createSignal(true);
  const [activeFilter, setActiveFilter] = createSignal('All');
  
  const filters = ['All', 'Latest', 'Popular', 'Featured'];

  const loadArticles = async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);
      
      const response: PageResponse<Article> = await articleService.getAllArticles(page, 10);
      
      if (append) {
        setArticles(prev => [...prev, ...response.content]);
      } else {
        setArticles(response.content);
      }
      
      setCurrentPage(response.number);
      setHasMore(response.number < response.totalPages - 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(0);
    setHasMore(true);
    setArticles([]);
    loadArticles(0, false);
  };

  const handleScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading() && hasMore()) {
      loadArticles(currentPage() + 1, true);
    }
  };

  onMount(() => {
    loadArticles();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const cutDesc = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div class="w-full min-h-screen bg-neutral-50">
      <style>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap');
</style>
        <div class="block w-[89%] pt-6 sm:pt-0 mx-auto">
          <div class="sm:flex hidden w-[100%] px-4 pt-10 pb-5 items-center justify-between mx-auto">
            <p class="font-semibold text-base text-neutral-800">Popular</p>
            <A class="font-semibold txt-sm text-neutral-800 bg-[#f0f0f0] px-4 py-2 rounded-full hover:bg-gray-200 transition-colors" href='/'>See All Posts</A>
          </div>
                <div class="block w-[100%] h-96 sm:h-[53vh] mx-auto justify-between bg-white mt-2 rounded-xl sm:flex border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div class="block w-full sm:w-1/2 p-9 pr-6">
                  <h1 class='text-3xl sm:text-[33px] text-center sm:text-left lg:text-4xl leading-10 lg:leading-14' style={{"font-family": "'Lora', sans-serif"}}>Articles for <span style={{"color": "#999"}}>Science, Coding &amp; Artifical Intelligence(AI)</span></h1>
                    
                    <p class="text-lg text-center sm:text-left text-neutral-800 pt-3 pr-8 sm:text-base sm:mt-1">This article explores why writing and reading at this intersection is crucial.</p>
                    <div class="flex text-center mx-auto justify-center sm:text-left mt-4 gap-x-3">
                      <p class="text-sm text-neutral-600 font-medium bg-neutral-50 py-[6px] px-[10px] rounded-full">Featured</p>
                      <p class="text-sm text-neutral-600 font-medium bg-neutral-50 py-[6px] px-[10px] rounded-full">Story</p>
                    </div>
                  </div>
                    <img class='w-full h-52 object-cover sm:w-2/3 sm:h-[53vh] sm:object-fill' src='/cover.jpg' alt='cover' loading='lazy' />
                </div>
        </div>

      {/* Articles List Section */}
      <div class="w-full mt-52 sm:mt-20 sm:w-[100%] mx-auto sm:p-4 bg-white">
        <div class="flex gap-x-2 sm:gap-x-3 p-5">
          <For each={filters}>
            {(filter) => (
              <button
                class={`rounded-2xl bg-neutral-100 px-6 py-3 font-semibold text-sm sm:text-xs sm:py-3 sm:px-6 hover:bg-neutral-800 transition-colors ${
                  activeFilter() === filter
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-800 hover:text-white'
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            )}
          </For>
        </div>

        <Show when={error()}>
          <div class="text-center py-12">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Articles</h3>
              <p class="text-red-600 mb-4">{error()}</p>
              <button
                onClick={() => loadArticles()}
                class="bg-neutral-900 text-white px-8 py-[14px] rounded-full hover:bg-neutral-800 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </Show>

        <div class="posts-grid block mx-auto flex-wrap gap-x-8 sm:flex">
          <Show when={initialLoading()}>
            <div class="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" text="Loading stories..." />
            </div>
          </Show>
          
          <Show when={!initialLoading() && articles().length === 0}>
            <div class="text-center py-16">
              <div class="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-neutral-100">
                <h3 class="text-2xl font-bold text-neutral-900 mb-3">No Stories Yet</h3>
                <p class="text-gray-600 mb-6 leading-relaxed">Be the first to share your thoughts and inspire others!</p>
                <A
                  href="/create"
                  class="items-center w-full text-center px-8 py-[14px] bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all duration-200 shadow-lg hover:shadow-xl group text-sm"
                >
                  Write Your First Story
                </A>
              </div>
            </div>
          </Show>
          
          <Show when={!initialLoading() && articles().length > 0}>
            <For each={articles()}>
              {(article, index) => (
                <div class="block w-full p-5 sm:w-1/5 sm:p-0 sm:mb-8">
                  <Show when={article.imageUrl}>
                    <img class='w-full h-1/3 mx-auto my-auto rounded-lg object-cover' 
                      src={article.imageUrl}  
                      alt={article.title} 
                      loading="lazy" 
                    />
                  </Show>
                  <Show when={!article.imageUrl}>
                    <div class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </Show>
                  <div class="w-full my-auto items-center py-5 sm:w-11/12 sm:mx-auto">
                    <A 
                      href={`/${article.authorUsername}/${article.slug}`} 
                      class='text-neutral-800 font-semibold text-lg sm:text-base hover:text-neutral-600 transition-colors px-8 py-[14px] rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-sm'
                    >
                      {article.title}
                    </A>
                    <div class="flex w-full py-3 justify-between">
                      <div class="flex items-center">
                        <p class='text-[13px] text-neutral-400 font-medium pr-1 sm:text-xs'>{formatDate(article.createdAt)}</p>
                        <p class='text-sm text-neutral-400 mt-[-3px] px-1'>|</p>
                        <div class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class='mt-[-2px] px-1' width="22" height="22" fill="none" viewBox="0 0 64 64">
                            <path fill="#FFC017" d="m39.637 40.831-5.771 15.871a1.99 1.99 0 0 1-3.732 0l-5.771-15.87a2.02 2.02 0 0 0-1.194-1.195L7.298 33.866a1.99 1.99 0 0 1 0-3.732l15.87-5.771a2.02 2.02 0 0 0 1.195-1.194l5.771-15.871a1.99 1.99 0 0 1 3.732 0l5.771 15.87a2.02 2.02 0 0 0 1.194 1.195l15.871 5.771a1.99 1.99 0 0 1 0 3.732l-15.87 5.771a2.02 2.02 0 0 0-1.195 1.194"></path>
                          </svg>
                          <A 
                            href={`/user/${article.authorUsername}`} 
                            class='text-[13px] text-neutral-400 font-medium sm:text-xs hover:text-neutral-600 transition-colors'
                          >
                            {article.authorUsername}
                          </A>
                        </div>
                      </div>
                      <div class="flex items-center">
                        <span class="flex items-center text-neutral-700 text-sm">
                        <svg class='w-[25.5px] h-[25.5px] overflow-visible' viewBox="467 392 58 57"  xmlns="http://www.w3.org/2000/svg">
                          <g fill="none" fill-rule="evenodd" transform="translate(467 392)"><path id="heart" class="heart-path" d="M28.9955034,43.5021565 C29.8865435,42.7463028 34.7699838,39.4111958 36.0304386,38.4371087 C41.2235681,34.4238265 43.9999258,30.3756814 44.000204,25.32827 C43.8745444,20.7084503 40.2276972,17 35.8181279,17 C33.3361339,17 31.0635318,18.1584833 29.5323721,20.1689268 L28.9999629,20.8679909 L28.4675537,20.1689268 C26.936394,18.1584833 24.6637919,17 22.181798,17 C17.6391714,17 14,20.7006448 14,25.3078158 C14,30.4281078 16.7994653,34.5060727 22.0294634,38.5288772 C23.3319753,39.530742 27.9546492,42.6675894 28.9955034,43.5021565 Z" stroke="#333" stroke-width="2.5" fill="none"/></g>
                        </svg> 
                        {article.likeCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
        
        <Show when={loading() && !initialLoading() && articles().length > 0}>
          <div class="flex justify-center py-8">
            <LoadingSpinner size="sm" text="Loading more..." />
          </div>
        </Show>
        
        <Show when={!hasMore() && !initialLoading() && articles().length > 0}>
          <div class="text-center py-8">
            <p class="text-neutral-500">No more posts</p>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default Home;