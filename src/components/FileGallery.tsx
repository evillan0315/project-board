import { createResource, Show, For, createSignal, onCleanup } from 'solid-js';
import api from '../services/api';
import Loading from './Loading';

type FileMeta = {
  name: string;
  type: 'video' | 'audio' | 'image' | 'unknown';
  url: string;
};

const getFileType = (filename: string): FileMeta['type'] => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return 'unknown';
  if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'webm', 'm4a'].includes(ext)) return 'audio';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
  return 'unknown';
};

export const FileGallery = () => {
  const [directory] = createSignal('/file/list?directory=downloads&recursive=true');
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  let mediaRef: HTMLMediaElement | null = null;

  const [files] = createResource(async () => {
    const res = await api.get<string[]>(directory());

    const result = res.data.map((file: any) => ({
      name: file.name,
      type: getFileType(file.name),
      url: `http://localhost:5000/api/media/${encodeURIComponent(file.name)}`
    }));

    // Select a random playable media file
    const playableIndexes = result
      .map((f, i) => (f.type === 'video' || f.type === 'audio' ? i : null))
      .filter((i) => i !== null) as number[];

    if (playableIndexes.length > 0) {
      const randomIndex = playableIndexes[Math.floor(Math.random() * playableIndexes.length)];
      setActiveIndex(randomIndex);
    }

    return result;
  });

  const handleEnded = () => {
    const playableIndexes = files()
      ?.map((f, i) => (f.type === 'video' || f.type === 'audio' ? i : null))
      .filter((i) => i !== null) as number[];

    if (playableIndexes.length > 1) {
      let newIndex: number;
      do {
        newIndex = playableIndexes[Math.floor(Math.random() * playableIndexes.length)];
      } while (newIndex === activeIndex());

      setActiveIndex(newIndex);
    }
  };

  onCleanup(() => {
    if (mediaRef) {
      mediaRef.removeEventListener('ended', handleEnded);
    }
  });

  return (
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">Media Gallery</h2>

      <Show when={!files.loading} fallback={<Loading />}>
        <div class="grid grid-cols-1 gap-4">
          <For each={files()}>
            {(file, index) => (
              <div class="p-2">
                <p class="text-sm font-medium break-words mb-2">{file.name}</p>

                <Show when={file.type === 'video'}>
                  <video
                    class="w-full h-auto rounded"
                    controls
                    autoplay={index() === activeIndex()}
                    muted
                    ref={(el) => {
                      if (index() === activeIndex()) {
                        mediaRef = el;
                        el.addEventListener('ended', handleEnded);
                      }
                    }}
                  >
                    <source src={file.url} />
                    Your browser does not support the video tag.
                  </video>
                </Show>

                <Show when={file.type === 'audio'}>
                  <audio
                    class="w-full"
                    controls
                    autoplay={index() === activeIndex()}
                    ref={(el) => {
                      if (index() === activeIndex()) {
                        mediaRef = el;
                        el.addEventListener('ended', handleEnded);
                      }
                    }}
                  >
                    <source src={file.url} />
                    Your browser does not support the audio tag.
                  </audio>
                </Show>

                <Show when={file.type === 'image'}>
                  <img src={file.url} alt={file.name} class="w-full h-auto rounded" />
                </Show>

                <Show when={file.type === 'unknown'}>
                  <p class="text-red-500">Unsupported file type</p>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

