import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import api from '../../services/api';

const MiniAudioPlayer = () => {
  const [songs, setSongs] = createSignal<{ name: string; path: string }[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [showPlaylist, setShowPlaylist] = createSignal(false);
  // const [position, setPosition] = createSignal({ x: 10, y: 40 });

  const [position, setPosition] = createSignal({
    x: window.innerWidth - 280 - 20, // 20px margin from the right
    y: window.innerHeight - 60 - 20, // 20px margin from the bottom
  });
  let playerRef: HTMLDivElement | undefined;

  const audio = new Audio();

  const fetchSongs = async () => {
    try {
      const res = await api.get('/file/list?directory=./downloads/audio');
      setSongs(res.data);
      if (res.data.length > 0) {
        setCurrentIndex(0);
        loadSong(0);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
    }
  };

  const loadSong = (index: number) => {
    const song = songs()[index];
    if (!song) return;
    audio.src = `${import.meta.env.BASE_URL_API}/api/media/audio/${song.name}`;
    audio.load();
  };

  const play = () => {
    audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audio.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    isPlaying() ? pause() : play();
  };

  const next = () => {
    if (songs().length === 0) return;
    const nextIdx = (currentIndex() + 1) % songs().length;
    setCurrentIndex(nextIdx);
    loadSong(nextIdx);
    play();
  };

  const prev = () => {
    if (songs().length === 0) return;
    const prevIdx = (currentIndex() - 1 + songs().length) % songs().length;
    setCurrentIndex(prevIdx);
    loadSong(prevIdx);
    play();
  };

  const enableDrag = () => {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      offsetX = e.clientX - position().x;
      offsetY = e.clientY - position().y;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    playerRef?.addEventListener('mousedown', onMouseDown);

    onCleanup(() => {
      playerRef?.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    });
  };

  onMount(() => {
    fetchSongs();
    audio.addEventListener('ended', next);
    enableDrag();
  });

  onCleanup(() => {
    audio.removeEventListener('ended', next);
    audio.pause();
  });

  return (
    <div
      ref={(el) => (playerRef = el)}
      class="mini-audio-player player w-72 flex flex-col rounded-md overflow-hidden shadow-lg border  fixed cursor-move"
      style={{
        left: `${position().x}px`,
        top: `${position().y}px`,
      }}
    >
      <div class="flex items-center justify-between p-2">
        <div class="text-sm font-semibold truncate w-24">
          {songs().length > 0 ? songs()[currentIndex()].name : 'No Song'}
        </div>
        <div class="flex items-center space-x-2">
          <button
            onClick={prev}
            disabled={songs().length === 0}
            class="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <Icon icon="mdi:skip-previous" width="20" height="20" />
          </button>
          <button
            onClick={togglePlay}
            disabled={songs().length === 0}
            class="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <Icon icon={isPlaying() ? 'mdi:pause' : 'mdi:play'} width="24" height="24" />
          </button>
          <button
            onClick={next}
            disabled={songs().length === 0}
            class="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <Icon icon="mdi:skip-next" width="20" height="20" />
          </button>
          <button onClick={() => setShowPlaylist(!showPlaylist())} class="text-gray-400 hover:text-white">
            <Icon icon="mdi:playlist-music" width="20" height="20" />
          </button>
        </div>
      </div>
      <Show when={showPlaylist()}>
        <div class="overflow-y-auto max-h-20 bg-gray-700 border border-gray-800">
          <ul>
            {songs().map((song, idx) => (
              <li
                class={`px-2 py-1 text-sm hover:bg-gray-600 cursor-pointer ${idx === currentIndex() ? 'bg-gray-600' : ''}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  loadSong(idx);
                  play();
                }}
              >
                {song.name}
              </li>
            ))}
          </ul>
        </div>
      </Show>
    </div>
  );
};

export default MiniAudioPlayer;
