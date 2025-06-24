import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import api from '../../services/api';
import { getBlobFileUrl } from '../../services/file';

type MiniVideoPlayerProps = {
  options: Record<string, any>;
  directory?: string;
  url: string;
  onReady?: (player: Player) => void;
};

export default function MiniVideoPlayer(props: MiniVideoPlayerProps) {
  let videoRef: HTMLVideoElement | undefined;
  let containerRef: HTMLDivElement | undefined;
  let player: Player;

  //const [position, setPosition] = createSignal({ x: 50, y: 50 });
  const [position, setPosition] = createSignal({
    x: window.innerWidth - 320 - 20, // 20px margin from the right
    y: window.innerHeight - 180 - 20, // 20px margin from the bottom
  });
  const [size, setSize] = createSignal({ width: 320, height: 180 });
  const [videos, setVideos] = createSignal<{ name: string; path: string }[]>([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [showList, setShowList] = createSignal(false);

  const fetchVideos = async (directory = './downloads/recordings', collected: any[] = []) => {
    try {
      const res = await api.get(`/file/list?directory=${encodeURIComponent(directory)}&recursive=true`);
      for (const item of res.data) {
        if (item.isDirectory) {
          // Recurse into the subdirectory
          await fetchVideos(item.path, collected);
        } else if (item.name.endsWith('.mp4')) {
          collected.push(item);
        }
      }

      // Only update state when initial call finishes
      if (directory === './downloads/recordings') {
        setVideos(collected);
        if (collected.length > 0) {
          setCurrentIndex(0);
          loadVideo(0, collected);
        }
      }
    } catch (err) {
      console.error(`Error fetching videos in ${directory}:`, err);
    }
  };

  const loadVideo = async (index: number) => {
    const vid = videos()[index];
    if (!vid || !player) return;
    player.src({ type: 'video/mp4', src: await getBlobFileUrl(vid.path) });
    player.load();
    player.play().catch((err) => console.warn('Autoplay blocked:', err));
  };

  const nextVideo = () => {
    if (videos().length === 0) return;
    const nextIdx = (currentIndex() + 1) % videos().length;
    setCurrentIndex(nextIdx);
    loadVideo(nextIdx);
  };

  const enableDrag = () => {
    let offsetX = 0,
      offsetY = 0;
    let dragging = false;

    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      offsetX = e.clientX - position().x;
      offsetY = e.clientY - position().y;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPosition({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const onMouseUp = () => {
      dragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    containerRef?.addEventListener('mousedown', onMouseDown);

    onCleanup(() => {
      containerRef?.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    });
  };

  const enableResize = () => {
    let resizing = false;
    let startX = 0,
      startY = 0,
      startW = 0,
      startH = 0;

    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = size().width;
      startH = size().height;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!resizing) return;
      const newWidth = Math.max(160, startW + (e.clientX - startX));
      const newHeight = Math.max(90, startH + (e.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      resizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const handle = document.createElement('div');
    handle.style.position = 'absolute';
    handle.style.right = '0';
    handle.style.bottom = '0';
    handle.style.width = '16px';
    handle.style.height = '16px';
    handle.style.cursor = 'se-resize';
    handle.style.background = 'rgba(255,255,255,0.3)';
    handle.style.zIndex = '10';

    containerRef?.appendChild(handle);
    handle.addEventListener('mousedown', onMouseDown);

    onCleanup(() => {
      handle.removeEventListener('mousedown', onMouseDown);
      handle.remove();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    });
  };

  onMount(() => {
    fetchVideos();

    player = videojs(videoRef!, props.options, () => {
      props.onReady?.(player);
    });

    player.on('ended', nextVideo);

    //if (window.innerWidth < 640) {
    enableDrag();
    enableResize();
    //}

    const handleResize = () => {
      const { width, height } = size();
      setPosition({
        x: window.innerWidth - width - 20,
        y: window.innerHeight - height - 20,
      });
    };

    window.addEventListener('resize', handleResize);
    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      if (player) player.dispose();
    });
  });

  onCleanup(() => {
    if (player) player.dispose();
  });

  return (
    <div
      ref={containerRef}
      class="fixed flex flex-col rounded-md bg-black border border-gray-700 shadow-lg z-50"
      style={{
        left: `${position().x}px`,
        top: `${position().y}px`,
        width: `${size().width}px`,
        height: `${size().height}px`,
      }}
    >
      <div class="flex justify-between items-center p-1 bg-gray-800 text-white text-xs">
        <span class="truncate max-w-[150px]">{videos().length > 0 ? videos()[currentIndex()].name : 'No Video'}</span>
        <button class="text-gray-400 hover:text-white" onClick={() => setShowList(!showList())}>
          ☰
        </button>
      </div>
      <div data-vjs-player class="flex-1 relative">
        <video
          ref={videoRef}
          class="video-js vjs-default-skin w-full h-full object-contain"
          style={{ width: '100%', height: '100%' }}
        ></video>
      </div>
      <Show when={showList()}>
        <div class="max-h-24 overflow-y-auto bg-gray-700 border-t border-gray-600 text-white text-md">
          <ul>
            <For each={videos()}>
              {(vid, idx) => (
                <li
                  class={`p-1 cursor-pointer hover:bg-gray-600 ${idx() === currentIndex() ? 'bg-gray-600' : ''}`}
                  onClick={() => {
                    setCurrentIndex(idx());
                    loadVideo(idx());
                  }}
                >
                  {vid.name}
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  );
}
