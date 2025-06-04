import AudioDownloader from '../components/AudioDownloader';
import { Icon } from '@iconify-icon/solid';
import { FileGallery } from '../components/FileGallery';

export default function Downloader() {
  return (
    <div class="py-6">
      <div class="flex justify-center">
        <div class="flex flex-col md:flex-row gap-6 w-full max-w-6xl p-6">
          {/* Main Content */}
          <div class="w-full md:w-2/3 space-y-4 border rounded-lg p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold">Download and Extract YouTube Audio</h2>
              <Icon icon="mdi:download" width="2.2em" height="2.2em" />
            </div>

            <AudioDownloader />

            <FileGallery />
          </div>

          {/* Sidebar Info */}
          <div class="w-full md:w-1/3 space-y-4 p-4 border rounded-lg">
            <h3 class="text-xl font-semibold">🎧 About Audio Downloader</h3>
            <p class="text-gray-600">
              This tool allows you to extract audio from YouTube videos using a custom backend powered by{' '}
              <code>yt-dlp</code>. Simply paste the video URL and track download progress in real-time.
            </p>

            <h4 class="font-medium text-gray-800 mt-4">✨ Features</h4>
            <ul class="list-disc pl-5 text-gray-700 space-y-1">
              <li>Supports direct YouTube audio extraction</li>
              <li>Real-time download progress updates</li>
              <li>MP3 format with automatic file generation</li>
              <li>Cancelable download process</li>
              <li>One-click download of result</li>
            </ul>

            <h4 class="font-medium text-gray-800 mt-4">🔒 Privacy</h4>
            <p class="text-gray-600">
              Downloads are processed server-side and stored temporarily for access. No login required.
            </p>

            <h4 class="font-medium text-gray-800 mt-4">🧰 Tech Stack</h4>
            <p class="text-gray-600">
              Built with <strong>SolidJS</strong>, <strong>NestJS</strong>, <code>yt-dlp</code>, and{' '}
              <strong>WebSockets</strong> for fast, reactive updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
