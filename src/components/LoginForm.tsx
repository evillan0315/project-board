import { createSignal, Show } from 'solid-js';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@solidjs/router';
import Loading from './Loading';
import SignInWithGoogle from './SignInWithGoogle';
import SignInWithGithub from './SignInWithGithub';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({ email: username(), password: password() });

      if (response && response.accessToken) {
        // Optionally store token in localStorage/sessionStorage or context
        // localStorage.setItem('token', response.access_token);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Show when={!loading()} fallback={<Loading />}>
      <div class="bg-white dark:bg-gray-950 py-16">
        <div class="flex items-center justify-center">
          <div class="w-full max-w-md rounded-lg bg-gray-950 p-8 border border-gray-800 dark:border-sky-800 shadow-lg">
            <h2 class="text-center text-2xl font-bold text-white">Welcome Back 👋</h2>
            {error() && <p class="text-center text-sm text-red-400">{error()}</p>}
            <form class="space-y-4 mt-4" onSubmit={handleSubmit}>
              <div>
                <label class="block text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  class="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-800 p-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
                  value={username()}
                  onInput={(e) => setUsername(e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label class="block text-gray-400">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  class="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-800 p-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full rounded-md bg-blue-600 p-3 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Sign In
              </button>
            </form>
            <SignInWithGoogle />
            <SignInWithGithub />
          </div>
        </div>
      </div>
    </Show>
  );
};

export default LoginForm;

