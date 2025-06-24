import { Show, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import Loading from '../components/Loading';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  onMount(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  });

  return (
    <div class="flex-1 h-full overflow-auto">
      <Show when={!isAuthenticated()} fallback={<Loading />}>
        <LoginForm />
      </Show>
    </div>
  );
}
