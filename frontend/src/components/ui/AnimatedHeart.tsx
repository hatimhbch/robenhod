import { Component, createSignal, createEffect } from 'solid-js';
import './AnimatedHeart.css';

interface AnimatedHeartProps {
  isLiked: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedHeart: Component<AnimatedHeartProps> = (props) => {
  const [isAnimating, setIsAnimating] = createSignal(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };
  
  const size = () => props.size || 'md';
  
  const handleClick = () => {
    if (props.disabled) return;
    
    setIsAnimating(true);
    props.onClick();
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div class="relative w-8 h-8 items-center inline-block">
      <button
        onClick={handleClick}
        disabled={props.disabled}
        class={`
          ${sizeClasses[size()]} 
          cursor-pointer select-none
          transition-transform duration-200 ease-out
        `}
        aria-label={props.isLiked ? "Unlike" : "Like"}
      >
        <svg 
          class={`w-full h-full overflow-visible ${props.isLiked ? 'heart-liked' : 'heart-unliked'}`}
          viewBox="467 392 58 57" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" fill-rule="evenodd" transform="translate(467 392)">
            {/* Main heart path */}
            <path 
              id="heart"
              class="heart-path"
              d="M28.9955034,43.5021565 C29.8865435,42.7463028 34.7699838,39.4111958 36.0304386,38.4371087 C41.2235681,34.4238265 43.9999258,30.3756814 44.000204,25.32827 C43.8745444,20.7084503 40.2276972,17 35.8181279,17 C33.3361339,17 31.0635318,18.1584833 29.5323721,20.1689268 L28.9999629,20.8679909 L28.4675537,20.1689268 C26.936394,18.1584833 24.6637919,17 22.181798,17 C17.6391714,17 14,20.7006448 14,25.3078158 C14,30.4281078 16.7994653,34.5060727 22.0294634,38.5288772 C23.3319753,39.530742 27.9546492,42.6675894 28.9955034,43.5021565 Z" 
              stroke="#fc2779" 
              fill={props.isLiked ? "#fc2779" : "none"}
            />
            
            {/* Main circle for explosion effect */}
            
            {/* Particle groups */}
            <g class="particle-group grp1" opacity="0" transform="translate(24)">
              <circle class="particle-a" fill="#9FC7FA" cx="2.5" cy="3" r="2" />
              <circle class="particle-b" fill="#9FC7FA" cx="7.5" cy="2" r="2" />
            </g>
            
            <g class="particle-group grp2" opacity="0" transform="translate(44 6)">
              <circle class="particle-b" fill="#CC8EF5" cx="5" cy="6" r="2" />
              <circle class="particle-a" fill="#CC8EF5" cx="2" cy="2" r="2" />
            </g>
            
            <g class="particle-group grp3" opacity="0" transform="translate(52 28)">
              <circle class="particle-b" fill="#9CD8C3" cx="2" cy="7" r="2" />
              <circle class="particle-a" fill="#8CE8C3" cx="4" cy="2" r="2" />
            </g>
            
            <g class="particle-group grp4" opacity="0" transform="translate(35 50)">
              <circle class="particle-a" fill="#F48EA7" cx="6" cy="5" r="2" />
              <circle class="particle-b" fill="#F48EA7" cx="2" cy="2" r="2" />
            </g>
            
            <g class="particle-group grp5" opacity="0" transform="translate(14 50)">
              <circle class="particle-a" fill="#91D2FA" cx="6" cy="5" r="2" />
              <circle class="particle-b" fill="#91D2FA" cx="2" cy="2" r="2" />
            </g>
            
            <g class="particle-group grp6" opacity="0" transform="translate(0 28)">
              <circle class="particle-a" fill="#CC8EF5" cx="2" cy="7" r="2" />
              <circle class="particle-b" fill="#91D2FA" cx="3" cy="2" r="2" />
            </g>
            
            <g class="particle-group grp7" opacity="0" transform="translate(7 6)">
              <circle class="particle-a" fill="#9CD8C3" cx="2" cy="6" r="2" />
              <circle class="particle-b" fill="#8CE8C3" cx="5" cy="2" r="2" />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
};

export default AnimatedHeart; 