import { atom, onMount } from 'nanostores';

export const showLeftSidebar = atom<boolean>(true);
export const showRightSidebar = atom<boolean>(true);

// Define the type for terminal mode
export type TerminalMode = 'none' | 'ai' | 'local';

export const activeTerminal = atom<TerminalMode>('none');

// --- Initialize from localStorage ---

onMount(showLeftSidebar, () => {
  const saved = localStorage.getItem('showLeftSidebar');
  showLeftSidebar.set(saved !== null ? saved === 'true' : true);
});

onMount(showRightSidebar, () => {
  const saved = localStorage.getItem('showRightSidebar');
  showRightSidebar.set(saved !== null ? saved === 'true' : true);
});

onMount(activeTerminal, () => {
  const saved = localStorage.getItem('activeTerminal') as TerminalMode | null;
  if (saved === 'ai' || saved === 'local') {
    activeTerminal.set(saved);
  } else {
    activeTerminal.set('none');
  }
});

// --- Persist changes ---

showLeftSidebar.subscribe((value) => {
  localStorage.setItem('showLeftSidebar', String(value));
});

showRightSidebar.subscribe((value) => {
  localStorage.setItem('showRightSidebar', String(value));
});

activeTerminal.subscribe((value) => {
  localStorage.setItem('activeTerminal', value);
});
