
```markdown
# AudioDownloader Component Documentation

## Overview

The `AudioDownloader` component is a SolidJS component that facilitates downloading audio and video from online platforms like YouTube and Bilibili. It uses socket.io for client-server communication, where the backend handles media extraction and format conversion.

## Component Structure

```jsx
import { createSignal, onCleanup, onMount } from 'solid-js';
import io from 'socket.io-client';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';
import VideoJSPlayer from './VideoJSPlayer';

const socket = io(`${import.meta.env.BASE_URL_API}`);

/**
 * `AudioDownloader` is a SolidJS component that allows users to download audio (and video) from various online platforms like YouTube and Bilibili.
 * It utilizes socket.io for communication with a backend server responsible for extracting and converting the media.
 *
 * @returns {JSX.Element} - A JSX element representing the audio downloader component.
 */
export default function AudioDownloader() {
  /**
   * `url` is a SolidJS signal that stores the URL of the media to be downloaded.
   *
   * @type {[() => string, (v: string) => string]} - A tuple containing the getter and setter functions for the URL signal.
   */
  const [url, setUrl] = createSignal('');
  /**
   * `format` is a SolidJS signal that stores the desired format for the downloaded media (e.g., mp3, wav, mp4).
   *
   * @type {[() => string, (v: string) => string]} - A tuple containing the getter and setter functions for the format signal.
   */
  const [format, setFormat] = createSignal('mp4');
  /**
   * `provider` is a SolidJS signal that stores the name of the media provider (e.g., youtube, bilibili).
   *
   * @type {[() => string, (v: string) => string]} - A tuple containing the getter and setter functions for the provider signal.
   */
  const [provider, setProvider] = createSignal('youtube');
  /**
   * `cookieAccess` is a SolidJS signal that determines whether cookies should be used when accessing the media provider. This is useful for accessing content that requires authentication.
   *
   * @type {[() => boolean, (v: boolean) => boolean]} - A tuple containing the getter and setter functions for the cookie access signal.
   */
  const [cookieAccess, setCookieAccess] = createSignal(false);
  /**
   * `progress` is a SolidJS signal that stores the download progress as a percentage (0-100).
   *
   * @type {[() => number, (v: number) => number]} - A tuple containing the getter and setter functions for the progress signal.
   */
  const [progress, setProgress] = createSignal(0);
  /**
   * `loading` is a SolidJS signal that indicates whether the download process is currently in progress.
   *
   * @type {[() => boolean, (v: boolean) => boolean]} - A tuple containing the getter and setter functions for the loading signal.
   */
  const [loading, setIsLoading] = createSignal(false);
  /**
   * `filePath` is a SolidJS signal that stores the path to the downloaded file on the server.
   *
   * @type {[() => string, (v: string) => string]} - A tuple containing the getter and setter functions for the file path signal.
   */
  const [filePath, setFilePath] = createSignal('');
    const [filename, setFilename] = createSignal('');
  /**
   * `error` is a SolidJS signal that stores any error message that occurred during the download process.
   *
   * @type {[() => string, (v: string) => string]} - A tuple containing the getter and setter functions for the error signal.
   */
  const [error, setError] = createSignal('');

  /**
   * `handleSubmit` is an event handler that initiates the audio extraction process. It sets the loading state to true, resets the progress, file path, and error messages, and emits a 'extract_audio' event to the server via socket.io.
   * The event includes the URL, format, provider, and cookie access settings.
   *
   * @returns {void}
   */
  const handleSubmit = () => {
    setIsLoading(true);
    setProgress(0);
    setFilePath('');
    setError('');

    socket.emit('extract_audio', {
      url: url(),
      format: format(),
      provider: provider(),
      cookieAccess: cookieAccess(),
    });
  };

  /**
   * `onMount` is a SolidJS lifecycle hook that is executed after the component has been mounted to the DOM.
   * It sets up socket.io event listeners for 'download_progress', 'download_complete', and 'download_error' events.
   * It also sets up an `onCleanup` hook to remove these event listeners when the component is unmounted, preventing memory leaks.
   *
   * @returns {void}
   */
  onMount(() => {
    socket.on('download_ready', (data) => {
      const fPath = `${import.meta.env.BASE_URL_API}/api/media/${encodeURIComponent(data.filePath.split('/').pop())}`;
      //setFilePath(fPath);
    });
    /**
     * Listens for 'download_progress' events from the server.
     * Updates the progress signal and sets loading to false when progress reaches 100%.
     *
     * @param {object} data - The data received from the server.
     * @param {number} data.progress - The download progress as a percentage.
     */
    socket.on('download_progress', (data) => {
      console.log(data, 'download_progress data');
      setProgress(data.progress);
      if (data.progress >= 100) {
        setIsLoading(false);
      }
    });

    /**
     * Listens for 'download_complete' events from the server.
     * Updates the filePath signal with the path to the downloaded file.
     *
     * @param {object} data - The data received from the server.
     * @param {string} data.filePath - The path to the downloaded file.
     */
    socket.on('download_complete', (data) => {
       setFilename(data.filename);
      setFilePath(data.filePath);
    });

    /**
     * Listens for 'download_error' events from the server.
     * Updates the error signal with the error message and sets loading to false.
     *
     * @param {object} data - The data received from the server.
     * @param {string} data.message - The error message.
     */
    socket.on('download_error', (data) => {
      setError(data.message);
      setIsLoading(false);
    });

    /**
     * `onCleanup` is a SolidJS lifecycle hook that is executed when the component is unmounted from the DOM.
     * It removes the socket.io event listeners to prevent memory leaks and ensure that the component does not continue to listen for events after it has been unmounted.
     *
     * @returns {void}
     */
    onCleanup(() => {
      socket.off('download_progress');
      socket.off('download_complete');
      socket.off('download_error');
    });
  });

  return (
    <div class="p-4">
      <input
        type="text"
        class="w-full px-4 py-2 border border-gray-500/30 rounded-md mb-4"
        placeholder="Enter URL (youtube, bilibili...)"
        value={url()}
        onInput={(e) => setUrl(e.currentTarget.value)}
      />

      <select
        class="w-full px-4 py-2 border border-gray-500/30 rounded-md mb-4"
        value={format()}
        onChange={(e) => setFormat(e.currentTarget.value)}
      >
        <option value="mp3">MP3 (Audio)</option>
        <option value="wav">WAV (Audio)</option>
        <option value="m4a">M4A (Audio)</option>
        <option value="webm">WebM (Video)</option>
        <option value="mp4">MP4 (Video)</option>
        <option value="flv">FLV (Video)</option>
      </select>

      <label class="flex items-center mb-4 gap-2">
        <input type="checkbox" checked={cookieAccess()} onChange={(e) => setCookieAccess(e.currentTarget.checked)} />
        <span class="text-sm">Use cookies for provider access</span>
      </label>

      <select
        class="w-full px-4 py-2 border border-gray-500/30 rounded-md mb-4"
        value={provider()}
        onChange={(e) => setProvider(e.currentTarget.value.toLowerCase())}
      >
        <option value="youtube">YouTube</option>
        <option value="bilibili">Bilibili</option>
        {/* Add more providers as needed */}
      </select>

      <Button
        class="w-full flex items-center gap-2 px-2 py-2 uppercase tracking-widest"
        variant="secondary"
        onClick={handleSubmit}
        disabled={loading()}
      >
        <Icon icon="mdi:download" width="2.2em" height="2.2em" />
        {loading() ? 'Downloading...' : 'Download'}
      </Button>

      {progress() > 0 && (
        <div class="mt-4">
          <p>Progress: {progress().toFixed(2)}%</p>
          <div class="h-2 bg-gray-300 rounded overflow-hidden">
            <div class="h-full bg-blue-500" style={{ width: `${progress()}%` }} />
          </div>
        </div>
      )}

      {filePath() && (
        <>
          <div class="mt-4 text-green-600">
            ✅ Download complete: <code>{filePath()}</code>
          </div>

          {format().startsWith('mp4') || format().startsWith('webm') || format().startsWith('flv') ? (
            <VideoJSPlayer
              options={{
                sources: [
                  {
                    src: `${import.meta.env.BASE_URL_API}/api/media/${filename()}`,
                    type: 'video/mp4',
                  },
                ],
              }}
              //src={`${import.meta.env.BASE_URL_API}/api/media/${filename()}`}
              //type={`video/${format() === 'mp4' ? 'mp4' : format()}`}
            />
          ) : (
            <audio controls class="mt-4 w-full">
              <source src={`${import.meta.env.BASE_URL_API}/api/media/${filename()}`} type={`audio/${format()}`} />
              Your browser does not support the audio element.
            </audio>
          )}
        </>
      )}

      {error() && <div class="mt-4 text-red-600">❌ Error: {error()}</div>}
    </div>
  );
}
```

## Core Functionality

1.  **User Input:**
    *   Accepts a URL from the user via a text input field.
    *   Allows the user to select the desired output format (mp3, wav, mp4, etc.) via a dropdown.
    *   Provides a checkbox to enable/disable the use of cookies for accessing the media provider.
    *   Allows the user to select the media provider (YouTube, Bilibili, etc.) via a dropdown.

2.  **Socket.io Communication:**
    *   Establishes a socket.io connection with the backend server using the URL defined in `import.meta.env.BASE_URL_API`.
    *   Emits an `extract_audio` event to the server upon form submission, including the URL, format, provider, and cookie access settings.
    *   Listens for `download_progress`, `download_complete`, and `download_error` events from the server to update the UI accordingly.

3.  **UI Updates:**
    *   Displays a progress bar to indicate the download progress.
    *   Shows a success message with a link to the downloaded file upon completion.
    *   Displays an error message if any error occurs during the download process.
    *   Renders a video player (using the `VideoJSPlayer` component) if the downloaded file is a video.
    *   Renders an audio player if the downloaded file is an audio.

## Signals

The component utilizes SolidJS signals for managing its state:

*   `url`: Stores the URL entered by the user.
*   `format`: Stores the selected output format.
*   `provider`: Stores the selected media provider.
*   `cookieAccess`: Stores the cookie access setting.
*   `progress`: Stores the download progress (0-100).
*   `loading`: Indicates whether the download process is in progress.
*   `filePath`: Stores the path to the downloaded file on the server.
    * `filename`: Store the name of the downloaded file
*   `error`: Stores any error message.

## Event Handlers

*   `handleSubmit`: Called when the "Download" button is clicked. It emits the `extract_audio` event to the server.

## Lifecycle Hooks

*   `onMount`: Sets up socket.io event listeners and defines the `onCleanup` hook.
*   `onCleanup`: Removes socket.io event listeners to prevent memory leaks.

## Socket.IO Events

### Emitted Events

*   `extract_audio`: Emitted to the server when the user submits the form, containing the URL, format, provider, and cookie access settings.

### Received Events

*   `download_ready`: Received from the server when the server is ready to start download.
*   `download_progress`: Received periodically from the server during the download process, containing the download progress as a percentage.
*   `download_complete`: Received from the server when the download is complete, containing the file path of the downloaded file and filename.
*   `download_error`: Received from the server if an error occurs during the download process, containing the error message.

## Dependencies

*   `solid-js`: The SolidJS framework.
*   `socket.io-client`: For client-server communication via WebSockets.
*   `@iconify-icon/solid`: For the download icon.
*   `./ui/Button`: A custom button component.
*   `./VideoJSPlayer`: A custom video player component.

## Environment Variables

*   `import.meta.env.BASE_URL_API`: The base URL of the backend API server.  This is used for establishing the socket.io connection and constructing the file path.

## Notes

*   The backend server is responsible for handling the actual media extraction and conversion.
*   Error handling is minimal and can be improved to provide more informative error messages to the user.
*   The component can be extended to support more media providers and output formats.
*   Consider adding input validation to ensure that the user enters a valid URL.
*   The video and audio players are conditionally rendered based on the selected output format.
```
