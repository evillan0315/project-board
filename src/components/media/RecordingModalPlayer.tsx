import { createEffect, onCleanup, Show } from 'solid-js';

import videojs, { type VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';
import ModalLayout from '../layouts/ModalLayout';

export default function RecordingModalPlayer(props: { path: string; onClose: () => void }) {
  let videoRef: HTMLVideoElement | null = null;
  let player: VideoJsPlayer | undefined;

  createEffect(() => {
    if (videoRef && props.path) {
      if (player) {
        player.dispose();
      }

      player = videojs(videoRef, {
        controls: true,
        autoplay: false,
        responsive: true,
        fluid: true,
      });

      player.src({
        type: 'video/mp4',
        src: `${props.path}`,
      });
      console.log(player, props.path);
    }
  });

  onCleanup(() => {
    if (player) {
      player.dispose();
    }
  });

  return (
    <Show when={props.path}>
      <ModalLayout title="Recording Preview" onClose={props.onClose}>
        <video ref={(el) => (videoRef = el)} class="video-js vjs-default-skin w-full h-full" playsInline />
      </ModalLayout>
    </Show>
  );
}
