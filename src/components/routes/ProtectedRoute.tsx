// src/components/routes/ProtectedRoute.tsx
import { JSX, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute(props: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <Show when={isAuthenticated()}>
      {props.children}
    </Show>
  );
}

