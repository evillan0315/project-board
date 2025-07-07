import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from '../ui/Button';
import { getBlobFileUrl } from '../../services/file';
import api from '../../services/api';
import { shuffleIndexes } from '../../utils/shuffleIndexes';
import { fileService } from '../../services/fileService';
import { shuffledQueue, queueIndex } from '../../stores/fileStore';
import { useStore } from '@nanostores/solid';
import { onClickOutside } from '../../utils/mouseEvent';

const VOLUME_KEY = 'audioPlayerVolume';
const LAST_SONG_KEY = 'audioPlayerLastSong';
const LAST_TIME_KEY = 'audioPlayerLastTime';

const FooterMiniAudioPlayer = () => {
  const [songs, setSongs] = createSignal<{ name: string; path: string }[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [showPlaylist, setShowPlaylist] = createSignal(false);
  const [showVolume, setShowVolume] = createSignal(false);
  const [volume, setVolume] = createSignal(parseFloat(localStorage.getItem(VOLUME_KEY) || '1'));
  const [formattedCurrentTime, setFormattedCurrentTime] = createSignal('00:00');
  const [formattedDuration, setFormattedDuration] = createSignal('00:00');
  const [currentTime, setCurrentTime] = createSignal(0);
  const [percentPlayed, setPercentPlayed] = createSignal(0);
  const [percentBuffered, setPercentBuffered] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [playlistFilter, setPlaylistFilter] = createSignal('');
  const filteredSongs = () => songs().filter((s) => s.name.toLowerCase().includes(playlistFilter().toLowerCase()));
  let ref: HTMLDivElement;
  const $shuffledQueue = useStore(shuffledQueue);
  const $queueIndex = useStore(queueIndex);

  const audio = new Audio();

  const fetchSongs = async () => {
    try {
      const dir = './downloads/audio';
      const res = await api.get(`/file/list?directory=${encodeURIComponent(dir)}&recursive=false`);
      const files = res.data;

      if (Array.isArray(files) && files.length > 0) {
        setSongs(files);

        const queue = shuffleIndexes(files.length);
        shuffledQueue.set(queue);
        queueIndex.set(0);

        const lastIdx = parseInt(localStorage.getItem(LAST_SONG_KEY) || '-1', 10);
        const time = parseFloat(localStorage.getItem(LAST_TIME_KEY) || '0');

        let startIdx = 0;
        if (!isNaN(lastIdx) && lastIdx >= 0 && lastIdx < files.length) {
          startIdx = lastIdx;
        } else {
          startIdx = queue[0];
        }

        setCurrentIndex(startIdx);
        await loadSong(startIdx, false);

        if (!isNaN(time) && time > 0) {
          audio.currentTime = time;
        }
      } else {
        setSongs([]);
        shuffledQueue.set([]);
        queueIndex.set(0);
      }
    } catch (error) {
      console.error('Failed to fetch audio files:', error);
    }
  };

  const loadSong = async (index: number, autoplay = true) => {
    const song = songs()[index];
    if (!song) return;

    try {
      const blobUrl = await getBlobFileUrl(song.path);
      if (!blobUrl) throw new Error('Failed to get blob URL');
      audio.src = blobUrl;
      audio.load();

      localStorage.setItem(LAST_SONG_KEY, String(index));
      if (autoplay) {
        await audio.play();
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    } catch (err) {
      console.error(`Error loading song "${song.name}":`, err);
      setIsPlaying(false);
    }
  };

  const play = async () => {
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  const pause = () => {
    audio.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    isPlaying() ? pause() : play();
  };

  const updateVolume = (value: number) => {
    audio.volume = value;
    setVolume(value);
    localStorage.setItem(VOLUME_KEY, String(value));
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgress = () => {
    const duration = audio.duration;
    const currentTime = audio.currentTime;

    if (!isNaN(duration) && duration > 0) {
      const playedPercent = (currentTime / duration) * 100;
      setPercentPlayed(Math.round(playedPercent * 100) / 100);

      const buffered = audio.buffered;
      if (buffered.length) {
        const end = buffered.end(buffered.length - 1);
        const bufferedPercent = (end / duration) * 100;
        setPercentBuffered(Math.round(bufferedPercent * 100) / 100);
      }

      setFormattedCurrentTime(formatTime(currentTime));
      setFormattedDuration(formatTime(duration));
    } else {
      setPercentPlayed(0);
      setPercentBuffered(0);
      setFormattedCurrentTime('00:00');
      setFormattedDuration('00:00');
    }
  };

  const next = async () => {
    if (songs().length === 0) return;

    let nextIdx = $queueIndex() + 1;
    if (nextIdx >= $shuffledQueue().length) {
      const newQueue = shuffleIndexes(songs().length);
      shuffledQueue.set(newQueue);
      nextIdx = 0;
    }

    queueIndex.set(nextIdx);
    const songIdx = $shuffledQueue()[nextIdx] ?? 0;
    setCurrentIndex(songIdx);
    await loadSong(songIdx);
  };

  const prev = async () => {
    if (songs().length === 0) return;

    let prevIdx = $queueIndex() - 1;
    if (prevIdx < 0) {
      prevIdx = $shuffledQueue().length - 1;
    }

    queueIndex.set(prevIdx);
    const songIdx = $shuffledQueue()[prevIdx] ?? 0;
    setCurrentIndex(songIdx);
    await loadSong(songIdx);
  };

  onMount(() => {
    fetchSongs();
    audio.volume = volume();

    audio.addEventListener('ended', next);
    audio.addEventListener('timeupdate', () => {
      localStorage.setItem(LAST_TIME_KEY, String(audio.currentTime));
      updateProgress();
    });
    audio.addEventListener('progress', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);

    const socket = fileService.connect();
    socket.on('fileUpdated', fetchSongs);
    socket.on('fileDeleted', fetchSongs);
    socket.on('fileCreated', fetchSongs);

    const cleanup = onClickOutside(
      () => ref,
      () => setShowPlaylist(false),
    );

    onCleanup(() => cleanup());
  });

  onCleanup(() => {
    audio.removeEventListener('ended', next);
    audio.removeEventListener('timeupdate', updateProgress);
    audio.removeEventListener('progress', updateProgress);
    audio.removeEventListener('loadedmetadata', updateProgress);
    audio.pause();
  });

  return (
    <div class="footer-mini-audio-player player relative flex flex-col border-r border-l">
      <Show when={showPlaylist()}>
        <div class="audio-player-playlist absolute bottom-10 left-1/2 transform -translate-x-1/2 overflow-x-hidden overflow-y-auto max-h-50 max-w-70 border z-20 rounded-t-md shadow-lg">
          {/* Player Header */}
          <div class="player-header flex flex-col gap-2 px-4 py-2 sticky top-0 z-20 shadow-md rounded-t-md border-b">
            {/* Controls + Title */}
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                <Button
                  onClick={prev}
                  disabled={songs().length === 0}
                  variant="secondary"
                  class="btn-icon disabled:opacity-50"
                  icon="mdi:skip-previous"
                />
                <Button
                  onClick={togglePlay}
                  disabled={songs().length === 0}
                  variant="secondary"
                  class="btn-icon disabled:opacity-50 text-xl"
                  icon={isPlaying() ? 'mdi:pause' : 'mdi:play'}
                />
                <Button
                  onClick={next}
                  disabled={songs().length === 0}
                  variant="secondary"
                  class="btn-icon disabled:opacity-50"
                  icon="mdi:skip-next"
                />
              </div>

              <div
                onClick={() => setShowPlaylist(!showPlaylist())}
                class="scrolling-text relative overflow-hidden h-6 w-40 border shadow-lg rounded cursor-pointer"
              >
                <div class="absolute text-xs py-1 whitespace-nowrap animate-scroll tracking-widest uppercase font-light text-shadow-2xs text-sky-600">
                  {songs().length > 0 ? songs()[currentIndex()].name : 'No Song'}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">{formattedCurrentTime()}</span>
              <div class="relative flex-1 h-1 bg-gray-200 rounded">
                <div
                  class="absolute left-0 top-0 h-1 bg-blue-500 z-20 rounded"
                  style={{ width: `${percentPlayed()}%` }}
                ></div>
                <div
                  class="absolute left-0 top-0 h-1 bg-blue-200 rounded"
                  style={{ width: `${percentBuffered()}%` }}
                ></div>
              </div>
              <span class="text-xs text-gray-500">{formattedDuration()}</span>
            </div>
            {/* Playlist Search */}
            <div class="flex">
              <input
                type="text"
                placeholder="Search songs..."
                value={playlistFilter()}
                onInput={(e) => setPlaylistFilter(e.currentTarget.value)}
                class="w-full p-1 border rounded text-sm focus:outline-none focus:ring focus:ring-sky-500"
              />
            </div>
            {/* Volume 
            <div class="flex items-center gap-2">
              <Icon icon="mdi:volume-high" width="1.2em" height="1.2em" class="text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume()}
                onInput={(e) => setVolume(parseFloat(e.currentTarget.value))}
                class="w-full"
              />
            </div>*/}
          </div>

          {/* Playlist */}

          <ul class="mt-1 audio-playlist w-full min-h-[100px]">
            <For each={filteredSongs()}>
              {(song, i) => (
                <li
                  title={song.name}
                  class={`text-sm whitespace-nowrap truncate w-full cursor-pointer ${
                    songs().indexOf(song) === currentIndex() ? 'active font-semibold text-sky-600' : ''
                  }`}
                  onClick={async () => {
                    const songIdx = songs().indexOf(song);
                    setCurrentIndex(songIdx);
                    await loadSong(songIdx);
                    play();
                    setShowPlaylist(false);
                  }}
                >
                  {song.name}
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>

      <div class="flex items-center justify-between px-2 gap-1">
        {/**<div
          onClick={() => setShowPlaylist(!showPlaylist())}
          class="scrolling-text relative overflow-hidden h-6 w-50 border shadow-lg rounded cursor-pointer"
        >
          <div class="absolute text-xs py-1 whitespace-nowrap animate-scroll tracking-widest uppercase font-light text-shadow-2xs text-sky-600">
            {songs().length > 0 ? songs()[currentIndex()].name : 'No Song'} 
            
          </div>
          
        </div>**/}
        <div class="flex items-center space-x-2">
          <Button
            title="Toggle Player"
            onClick={() => setShowPlaylist(!showPlaylist())}
            variant="secondary"
            class="btn-icon disabled:opacity-50"
            icon="mdi-light:music"
          />
          <Button
            onClick={prev}
            disabled={songs().length === 0}
            variant="secondary"
            class="btn-icon disabled:opacity-50"
            icon="mdi:skip-previous"
          />
          <Button
            onClick={togglePlay}
            disabled={songs().length === 0}
            variant="secondary"
            class="btn-icon disabled:opacity-50 text-xl"
            icon={isPlaying() ? 'mdi:pause' : 'mdi:play'}
          />
          <Button
            onClick={next}
            disabled={songs().length === 0}
            variant="secondary"
            class="btn-icon disabled:opacity-50"
            icon="mdi:skip-next"
          />
        </div>
      </div>
    </div>
  );
};

export default FooterMiniAudioPlayer;
