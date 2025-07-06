import { Component, createSignal, createEffect, onMount, Show } from 'solid-js';
import { articleService } from '../../services/articleService';
import { getToken } from '../../utils/storage';
import AnimatedHeart from './AnimatedHeart';
import './LikeButton.css';

interface LikeButtonProps {
  articleId: number;
  initialLikeCount: number;
  initialHasLiked: boolean;
}

const LikeButton: Component<LikeButtonProps> = (props) => {
  const isAuthenticated = () => !!getToken();
  
  const [likeCount, setLikeCount] = createSignal(props.initialLikeCount);
  const [hasLiked, setHasLiked] = createSignal(Boolean(props.initialHasLiked));
  const [isLoading, setIsLoading] = createSignal(false);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [showTooltip, setShowTooltip] = createSignal(false);

  const [pulseAnimation, setPulseAnimation] = createSignal(false);
  const [bounceAnimation, setBounceAnimation] = createSignal(false);

  createEffect(() => {
    setLikeCount(props.initialLikeCount);
    setHasLiked(Boolean(props.initialHasLiked));
  });

  const handleLikeClick = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      return;
    }
    
    if (isLoading() || isAnimating()) return;
    
    setIsLoading(true);
    setIsAnimating(true);
    
    const originalLiked = hasLiked();
    const originalCount = likeCount();
    
    const newLikedState = !originalLiked;
    setHasLiked(newLikedState);
    setLikeCount(newLikedState ? originalCount + 1 : originalCount - 1);
    
     if (newLikedState) {
       setBounceAnimation(true);
       setPulseAnimation(true);
       setTimeout(() => setBounceAnimation(false), 600);
       setTimeout(() => setPulseAnimation(false), 800);
       
       if ('vibrate' in navigator) {
         navigator.vibrate(50);
       }
     }
    
    try {
      const response = await articleService.toggleLike(props.articleId);
      
      setHasLiked(Boolean(response.hashLiked));
      setLikeCount(response.likeCount);
      

      
    } catch (error: any) {
      setHasLiked(originalLiked);
      setLikeCount(originalCount);
      
      console.error('Like toggle error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const showTooltipHandler = () => {
    if (!isLoading()) setShowTooltip(true);
  };

  const hideTooltipHandler = () => {
    setShowTooltip(false);
  };

  return (
    <>
      {/* Main Like Button */}
      <div class="relative inline-block">
    <button 
      onClick={handleLikeClick}
          onMouseEnter={showTooltipHandler}
          onMouseLeave={hideTooltipHandler}
      disabled={isLoading()}
          class={`
            group relative flex items-center gap-3
            transition-all duration-300 ease-out
            ${isLoading() ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
            ${bounceAnimation() ? 'animate-bounce' : ''}
            ${pulseAnimation() ? 'animate-pulse' : ''}
            focus:outline-none
            transform hover:scale-105 active:scale-95
            bg-transparent border-none
          `}
          aria-label={hasLiked() ? "Unlike this article" : "Like this article"}
          aria-pressed={hasLiked()}
        >
          {/* Animated Heart */}
          <AnimatedHeart
            isLiked={hasLiked()}
            onClick={() => {}} // Empty function since we handle click on the parent button
            disabled={isLoading()}
            size="sm"
          />
          
          {/* Like Count with Animation */}
          <span class={`
            font-semibold ml-[-10px] text-sm transition-all duration-300 ease-out
            ${hasLiked() ? 'text-pink-600' : 'text-gray-700'}
            ${isLoading() ? 'opacity-50' : ''}
          `}>
        {likeCount()}
      </span>
          


    </button>

        {/* Tooltip */}
        <Show when={showTooltip()}>
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 animate-fade-in">
            {isAuthenticated() 
              ? (hasLiked() ? 'Remove like' : 'Like this article')
              : 'Login to like articles'
            }
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </Show>


      </div>




    </>
  );
};

export default LikeButton;