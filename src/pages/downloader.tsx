import { createSignal, createEffect, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import api from '../services/api';

const MiniAudioPlayer = () => {
  const [songs, setSongs] = createSignal([]);
  const [currentSong, setCurrentSong] = createSignal('');
  const [currentSongIndex, setCurrentSongIndex] = createSignal('');

  const [isPlaying, setIsPlaying] = createSignal(false);
  const [audio, setAudio] = createSignal(new Audio());
  const [showPlaylist, setShowPlaylist] = createSignal(false);

  const playSong = () => {
    const u = `${import.meta.env.BASE_URL_API}/api/media/audio/${currentSong()}`;
    console.log(u);
    const currentAudio = new Audio();

    currentAudio.src = u;
    currentAudio.play();
  };
  const fetchSongs = async () => {
    try {
      const res = await api.get('/file/list?directory=./downloads/audio');
      console.log(res.data);
      setSongs(res.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };
  onMount(() => {
    fetchSongs();
  });

  createEffect(() => {
    /*if (songs().length > 0) {
      const currentSong = songs();
      audio().src = currentSong.url;


      audio().addEventListener('ended', handleNextSong);
      return () => {
        audio().removeEventListener('ended', handleNextSong);
      };
    }*/
  });

  const togglePlay = () => {
    if (songs().length === 0) return;

    if (isPlaying()) {
      audio().pause();
    } else {
      audio().play();
    }
    setIsPlaying(!isPlaying());
  };

  createEffect(() => {
    isPlaying() ? audio().play() : audio().pause();
  });

  const handleNextSong = () => {
    if (songs().length === 0) return;

    //setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs().length);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (songs().length === 0) return;

    //setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs().length) % songs().length);
    setIsPlaying(true);
  };

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist());
  };

  return (
    <div class="w-[200px] h-[100px] bg-gray-800 text-white flex flex-col rounded-md shadow-md overflow-hidden">
      <div class="flex items-center justify-between p-2">
        <div class="text-sm font-semibold truncate w-24"></div>
        <div class="flex items-center space-x-2">
          <button
            onClick={handlePrevSong}
            class="text-gray-400 hover:text-white focus:outline-none disabled:opacity-50"
          >
            <Icon icon="mdi:skip-previous" width="20" height="20" />
          </button>
          <button
            onClick={togglePlay}
            disabled={songs().length === 0}
            class="text-gray-400 hover:text-white focus:outline-none disabled:opacity-50"
          >
            <Icon icon={isPlaying() ? 'mdi:pause' : 'mdi:play'} width="24" height="24" />
          </button>
          <button
            onClick={handleNextSong}
            disabled={songs().length === 0}
            class="text-gray-400 hover:text-white focus:outline-none disabled:opacity-50"
          >
            <Icon icon="mdi:skip-next" width="20" height="20" />
          </button>
          <button onClick={togglePlaylist} class="text-gray-400 hover:text-white focus:outline-none">
            <Icon icon="mdi:playlist-music" width="20" height="20" />
          </button>
        </div>
      </div>

      {showPlaylist() && (
        <div class="overflow-y-auto h-20 bg-gray-700">
          <ul>
            {songs().map((song, index) => (
              <li
                key={index}
                class={`px-2 py-1 text-sm hover:bg-gray-600 cursor-pointer ${song.path === setCurrentSong() ? 'bg-gray-600' : ''}`}
                onClick={() => {
                  setCurrentSong(song.name);
                  playSong();
                  setIsPlaying(true);
                }}
              >
                {song.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MiniAudioPlayer;
