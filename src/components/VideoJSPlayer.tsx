// src/components/VideoJSPlayer.tsx
import { onCleanup, onMount } from 'solid-js';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

import 'video.js/dist/video-js.css';
type VideoJSPlayerProps = {
  options: Record<string, any>;
  onReady?: (player: Player) => void;
};

export default function VideoJSPlayer(props: VideoJSPlayerProps) {
  let videoRef: HTMLVideoElement | undefined;
  let player: Player;

  onMount(() => {
    if (!videoRef) return;

    player = videojs(videoRef, props.options, () => {
      props.onReady?.(player);
    });
  });

  onCleanup(() => {
    if (player) {
      player.dispose();
    }
  });

  return (
    <div data-vjs-player>
      <video ref={videoRef} class="video-js vjs-big-play-centered vjs-default-skin"></video>
    </div>
  );
}
