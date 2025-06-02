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
      await login({ email: username(), password: password() });

      // If login succeeds, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Show when={!loading()} fallback={<Loading />}>
      <div class="py-16">
        <div class="flex items-center justify-center">
          <div class="w-full max-w-md rounded-lg p-8 border shadow-lg">
            <h2 class="text-center text-2xl font-bold">Welcome Back 👋</h2>
            {error() && <p class="text-center text-sm text-red-400">{error()}</p>}
            <form class="space-y-4 mt-4" onSubmit={handleSubmit}>
              <div>
                <label class="block">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  class="mt-1 w-full rounded-md border p-3 focus:ring-2 focus:ring-blue-500"
                  value={username()}
                  onInput={(e) => setUsername(e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label class="block">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  class="mt-1 w-full rounded-md border p-3 focus:ring-2 focus:ring-blue-500"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full rounded-md bg-sky-500 p-3 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
