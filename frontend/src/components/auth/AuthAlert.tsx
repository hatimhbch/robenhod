import { Component, createSignal, onMount } from 'solid-js';
import { A } from '@solidjs/router';

interface AuthAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  feature?: string;
}

const AuthAlert: Component<AuthAlertProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [isAnimating, setIsAnimating] = createSignal(false);

  onMount(() => {
    if (props.isOpen) {
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 50);
    }
  });

  const closeAlert = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      props.onClose();
    }, 300);
  };

  const defaultMessage = () => props.message || `Join our community to ${props.feature || 'access this feature'}!`;

  return (
    <>
      {props.isOpen && (
        <>
          {/* Backdrop */}
          <div 
            class={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
              isAnimating() ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeAlert}
          />
          
          {/* Alert Card */}
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              class={`bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
                isAnimating() ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
              }`}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative' }} // Ensure relative positioning for absolute X
            >
              
              {/* Decorative Header */}
              <div class="relative overflow-hidden rounded-t-3xl p-8">
                <div class="relative z-10 text-center">
                  
                  <h3 class="text-2xl font-bold text-neutral-900 mb-2">
                    Ready to Write?
                  </h3>
                  <p class="text-neutral-700 text-base leading-relaxed">
                    {defaultMessage()}
                  </p>
                </div>
              </div>
              
              {/* Content */}
              <div class="p-8">
                
                {/* Action Buttons */}
                <div class="space-y-3">
                  <A
                    href="/signup" style={{ "font-family": "'Raleway', sans-serif" }}
                    class="w-full bg-neutral-900 text-sm text-white font-semibold py-[14px] px-6 rounded-full hover:bg-neutral-800 transform transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
                  >
                    Create Account
                  </A>
                  
                  <A
                    href="/login"
                    class="w-full border border-neutral-200 text-sm text-gray-700 font-semibold py-[14px] px-6 rounded-full hover:border-gray-300 hover:bg-gray-50 transform transition-all duration-200 flex items-center justify-center group"
                  >
                    Sign In
                  </A>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    closeAlert();
                    window.location.href = '/';
                  }}
                  class="absolute top-4 right-4 w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors duration-200 z-20 text-sm py-[14px]"
                  aria-label="Close and go home"
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default AuthAlert;