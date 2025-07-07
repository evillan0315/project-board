import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { io, type Socket } from 'socket.io-client';
import ModalLayout from './layouts/ModalLayout';
import { getBlobFileUrl } from '../services/file';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Button } from './ui/Button';
const socketNamespace = '/ffmpeg';
const API_URL = import.meta.env.BASE_URL_API || 'http://localhost:5000';

export default function Transcoder() {
  const [inputPath, setInputPath] = createSignal('');
  const [format, setFormat] = createSignal<'hls' | 'mp4'>('hls');
  const [status, setStatus] = createSignal<string | null>(null);
  const [time, setTime] = createSignal<string | null>(null);
  const [videoUrl, setVideoUrl] = createSignal<string | null>(null);
  const [showPlayer, setShowPlayer] = createSignal(false);

  let socket: Socket;
  let player: videojs.Player | null = null;

  onMount(() => {
    socket = io(`${API_URL}${socketNamespace}`, {
      transports: ['websocket'],
    });

    socket.on('transcode_progress', (data) => {
      setTime(data.time);
      setStatus(`Processing… time=${data.time}`);
    });

    socket.on('transcode_complete', (data) => {
      setStatus('✅ Transcode complete');
      setVideoUrl(`${API_URL}${data.playlist}`);
    });

    socket.on('transcode_mp4_complete', (data) => {
      setStatus('✅ MP4 Transcode complete');
      setVideoUrl(`${API_URL}${data.output}`);
    });

    socket.on('transcode_error', (data) => {
      setStatus(`❌ Error: ${data.message}`);
    });
  });

  onCleanup(() => {
    socket?.disconnect();
    player?.dispose();
  });

  const startTranscode = () => {
    if (!inputPath().trim()) {
      setStatus('Please provide a valid input path');
      return;
    }

    setStatus('⏳ Starting transcode...');
    setTime(null);
    setVideoUrl(null);

    if (format() === 'hls') {
      socket.emit('start_transcode', { filePath: inputPath().trim() });
    } else {
      socket.emit('start_transcode_mp4', { filePath: inputPath().trim() });
    }
  };

  const initializeVideoJs = async () => {
    if (player) {
      player.dispose();
    }
    const vid_url = await getBlobFileUrl(videoUrl()!);
    player = videojs('videojs-player', {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'auto',
      poster: '/thumbnail.jpg', // Replace with dynamic thumbnail if available
      controlBar: {
        volumePanel: { inline: false },
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'playbackRateMenuButton',
          'fullscreenToggle',
        ],
      },
      sources: [
        {
          src: vid_url,
          type: format() === 'hls' ? 'application/x-mpegURL' : 'video/mp4',
        },
      ],
    });
  };

  return (
    <div class="max-w-xl mx-auto p-6 border rounded shadow space-y-4">
      <h2 class="text-xl font-semibold">FFmpeg Transcoder</h2>

      <input
        type="text"
        placeholder="Enter input video path"
        value={inputPath()}
        onInput={(e) => setInputPath(e.currentTarget.value)}
        class="w-full px-3 py-2 border rounded"
      />

      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2">
          <input
            type="radio"
            name="format"
            value="hls"
            checked={format() === 'hls'}
            onChange={() => setFormat('hls')}
          />
          HLS
        </label>
        <label class="flex items-center gap-2">
          <input
            type="radio"
            name="format"
            value="mp4"
            checked={format() === 'mp4'}
            onChange={() => setFormat('mp4')}
          />
          MP4
        </label>
      </div>
      <div class="flex  items-center gap-2">
        <Button onClick={startTranscode} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Start Transcode ({format().toUpperCase()})
        </Button>
        <Button
          class="px-4 py-2 rounded"
          onClick={() => {
            setVideoUrl(inputPath());
            setShowPlayer(true);
            setTimeout(initializeVideoJs, 0); // defer to DOM mount
          }}
        >
          Play in Video.js
        </Button>
      </div>
      <Show when={status()}>
        <p class="text-gray-800">{status()}</p>
      </Show>

      <Show when={time()}>
        <p class="text-sm text-gray-500">FFmpeg Time: {time()}</p>
      </Show>

      <div class="mt-4 space-y-2">
        <a href={videoUrl()!} target="_blank" class="text-blue-600 underline break-all">
          {videoUrl()}
        </a>
      </div>

      <Show when={showPlayer()}>
        <ModalLayout
          title="Video Player"
          onClose={() => {
            setShowPlayer(false);
            player?.dispose();
            player = null;
          }}
          size="xl"
        >
          <video id="videojs-player" class="video-js vjs-default-skin w-full h-auto" />
        </ModalLayout>
      </Show>
    </div>
  );
}
