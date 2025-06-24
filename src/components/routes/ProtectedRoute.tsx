// Optional in ProtectedRoute.tsx
import { Show, createEffect } from 'solid-js';
import type { JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute(props: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  });

  return <Show when={isAuthenticated()}>{props.children}</Show>;
}
