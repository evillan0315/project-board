import { createSignal, For, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import MediaDownloaderForm from './MediaDownloaderForm';
import { TTS_VOICE_OPTIONS, TTS_LANGUAGE_OPTIONS } from '../../constants/tts';
import api from '../../services/api';

export default function MediaDownloader() {
  return (
    <div class="flex-1 scroll-smooth p-2">
      <p class="mb-4">
        MediaDownloader` is a SolidJS component that allows users to download audio (and video) from various online
        platforms like YouTube and Bilibili.
      </p>
      {/* Main Content */}
      <div class="flex flex-col">
        <MediaDownloaderForm />
      </div>
    </div>
  );
}
