import { onMount, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../contexts/AuthContext';

export default function LeftSidebar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  onMount(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  });

  return (
    <div id="leftSidebar" class="flex flex-col border-r border-gray-700 transition-all duration-200 overflow-hidden">
      <div class="w-1 cursor-ew-resize bg-gray-700 hover:bg-sky-500" />
    </div>
  );
}
