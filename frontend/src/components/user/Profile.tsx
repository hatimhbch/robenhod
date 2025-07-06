import { Component, createResource, createSignal, onMount, Show, For } from 'solid-js';
import { isServer } from 'solid-js/web';
import { articleService } from '../../services/articleService';
import { A } from '@solidjs/router';
import LoadingSpinner from '../ui/LoadingSpinner';

const Profile: Component = () => {
  const [user, setUser] = createSignal<any>({});
  
  const [articles] = createResource(() => 
    !isServer ? articleService.getCurrentUserArticles() : []
  );

  onMount(() => {
    if (!isServer) {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  });

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

  return (
    <div class="w-full min-h-screen bg-neutral-50">
      {/* Profile Header */}
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-4xl mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold text-neutral-900 mb-4">My Profile</h1>
          <div class="bg-gray-50 rounded-2xl p-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold text-neutral-900 mb-2">Account Information</h3>
                <p class="text-gray-600 mb-2">
                  <span class="font-medium">Username:</span> {user()?.username || 'Loading...'}
                </p>
                <p class="text-gray-600">
                  <span class="font-medium">Email:</span> {user()?.email || 'Loading...'}
                </p>
              </div>
              <div class="flex items-center justify-center md:justify-end">
                <A href="/create" class="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-3xl hover:bg-neutral-800 transition-all duration-200 shadow-lg hover:shadow-xl group">
                  Write New Article
                </A>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div class="w-full mt-8 bg-white">
        <div class="max-w-6xl mx-auto p-8">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-bold text-neutral-900">My Articles</h2>
            <div class="text-sm text-gray-500">
              {articles() ? `${articles()!.length} article${articles()!.length !== 1 ? 's' : ''}` : ''}
            </div>
          </div>

          <div class="posts-grid block mx-auto flex-wrap gap-x-8 sm:flex">
            <Show when={!articles.loading} fallback={
              <div class="flex justify-center items-center py-12 w-full">
                <LoadingSpinner size="lg" text="Loading your articles..." />
              </div>
            }>
              <Show when={articles() && articles()!.length > 0} fallback={
                <div class="text-center py-16 w-full">
                  <div class="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-200">
                    <div class="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-neutral-900 mb-3">No Articles Yet</h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">Start sharing your thoughts and stories with the world!</p>
                    <A href="/create" class="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all duration-200 shadow-lg hover:shadow-xl group">
                      <svg class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Write Your First Article
                    </A>
                  </div>
                </div>
              }>
                <For each={articles() || []}>
                  {(article: any) => (
                    <div class="block w-full p-5 sm:w-1/5 sm:p-0 sm:mb-8">
                      <Show when={article.imageUrl} fallback={
                        <div class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      }>
                        <img class='w-full h-1/3 mx-auto my-auto rounded-lg object-cover' 
                          src={article.imageUrl} alt={article.title} loading="lazy" />
                      </Show>
                      <div class="w-full my-auto items-center py-5 sm:w-11/12 sm:mx-auto">
                        <A href={`/${article.authorUsername}/${article.slug}`} 
                          class='text-neutral-800 font-semibold text-lg sm:text-base hover:text-neutral-600 transition-colors'>
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
                              <span class='text-[13px] text-neutral-400 font-medium sm:text-xs'>{article.authorUsername}</span>
                            </div>
                          </div>
                          <div class="flex items-center">
                            <span class="flex items-center text-neutral-700 text-sm">
                              <svg class='w-[25.5px] h-[25.5px] overflow-visible' viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fill-rule="evenodd" transform="translate(467 392)">
                                  <path id="heart" class="heart-path" d="M28.9955034,43.5021565 C29.8865435,42.7463028 34.7699838,39.4111958 36.0304386,38.4371087 C41.2235681,34.4238265 43.9999258,30.3756814 44.000204,25.32827 C43.8745444,20.7084503 40.2276972,17 35.8181279,17 C33.3361339,17 31.0635318,18.1584833 29.5323721,20.1689268 L28.9999629,20.8679909 L28.4675537,20.1689268 C26.936394,18.1584833 24.6637919,17 22.181798,17 C17.6391714,17 14,20.7006448 14,25.3078158 C14,30.4281078 16.7994653,34.5060727 22.0294634,38.5288772 C23.3319753,39.530742 27.9546492,42.6675894 28.9955034,43.5021565 Z" stroke="#333" stroke-width="2.5" fill="none"/>
                                </g>
                              </svg> 
                              {article.likeCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </Show>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;