import { createSignal, Show, onCleanup } from 'solid-js';
import MiniAudioPlayer from './MiniAudioPlayer';

export default function AudioPlayerToggle() {
  const [showPlayer, setShowPlayer] = createSignal(false);

  const handleClickOutside = (e: MouseEvent) => {
    const player = document.getElementById('mini-audio-player');
    if (player && !player.contains(e.target as Node)) {
      setShowPlayer(false);
    }
  };

  const togglePlayer = () => {
    setShowPlayer(true);
  };

  document.addEventListener('click', handleClickOutside);
  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <>
      <div id="mini-audio-player" class=" fixed bottom-10 right-4 z-50"></div>
    </>
  );
}
