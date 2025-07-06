import { Component, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { authService } from '../../services/authService';

const Signup: Component = () => {
  const navigate = useNavigate();
  const [username, setUsername] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    
    if (password() !== confirmPassword()) {
      setError('Passwords do not match');
      return;
    }
    
    if (password().length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authService.signup({
        username: username(),
        email: email(),
        password: password()
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        const userInfo = {
          id: response.id || '',
          username: username(),
          email: email()
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        navigate('/', { replace: true });
      } else if (response.message && response.message.includes('successfully')) {

        navigate('/login', { replace: true });
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex w-full min-h-screen justify-center items-center bg-neutral-50 mx-auto">
      <form onSubmit={handleSubmit} class="w-full sm:w-1/2 py-8 px-32 rounded-lg">
        <h1 class="text-3xl font-bold mb-12 text-center text-gray-800">Create Your Account</h1>
        
        {error() && (
          <div class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error()}
          </div>
        )}
        <div class="w-full sm:w-3/4 mx-auto">
        <div class="mb-8">
          <input id="username" type="text" placeholder="Choose a username" value={username()} onInput={(e) => setUsername(e.currentTarget.value)}
            class="w-full px-6 py-4 border text-sm bg-white border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading()} required />
        </div>
        
        <div class="mb-8">
          <input id="email" type="email" placeholder="Enter your email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)}
            class="w-full px-6 py-4 border text-sm bg-white border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading()} required />
        </div>
        
        <div class="mb-8">
          <input id="password" type="password" placeholder="Create a password" value={password()} onInput={(e) => setPassword(e.currentTarget.value)}
            class="w-full px-6 py-4 border border-neutral-700 bg-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading()} required />
        </div>
        
        <div class="mb-8">
          <input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword()} onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            class="w-full px-6 py-4 border border-neutral-700 bg-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading()} required />
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-neutral-900 text-white px-6 py-4 text-sm rounded-full hover:bg-neutral-800 transition-colors font-normal"
          disabled={isLoading()}
        >
          {isLoading() ? 'Creating Account...' : 'Sign Up'}
        </button>
        </div> 
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Already have an account? <a href="/login" class="text-indigo-600 hover:text-indigo-800">Login here</a>
          </p>
        </div>
      </form>
      <img class='hidden sm:flexw-1/2' src='/signup.jfif' />
    </div>
  );
};

export default Signup;
