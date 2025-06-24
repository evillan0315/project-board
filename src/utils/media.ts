export function getMediaStreamUrl(filePath: string): string {
  const baseUrl = import.meta.env.BASE_URL_API?.replace(/\/$/, '');
  return `${baseUrl}/file/stream?filePath=${encodeURIComponent(filePath)}`;
}

export interface MediaPlayerProgress {
  currentTime: number;
  duration: number;
  bufferedEnd: number;
  percentPlayed: number;
  percentBuffered: number;
}

export function setupMediaPlayer(
  mediaElement: HTMLMediaElement,
  onProgress: (progress: MediaPlayerProgress) => void,
  onError?: (error: string) => void,
) {
  const updateProgress = () => {
    const { currentTime, duration, buffered } = mediaElement;
    const bufferedEnd = buffered.length ? buffered.end(buffered.length - 1) : 0;
    const percentPlayed = duration ? (currentTime / duration) * 100 : 0;
    const percentBuffered = duration ? (bufferedEnd / duration) * 100 : 0;

    onProgress({
      currentTime,
      duration,
      bufferedEnd,
      percentPlayed,
      percentBuffered,
    });
  };

  mediaElement.addEventListener('timeupdate', updateProgress);
  mediaElement.addEventListener('progress', updateProgress);
  mediaElement.addEventListener('loadedmetadata', updateProgress);
  mediaElement.addEventListener('error', () => {
    if (onError) {
      const error = mediaElement.error;
      onError(error ? error.message : 'Unknown media error');
    }
  });

  // Clean up
  return () => {
    mediaElement.removeEventListener('timeupdate', updateProgress);
    mediaElement.removeEventListener('progress', updateProgress);
    mediaElement.removeEventListener('loadedmetadata', updateProgress);
    mediaElement.removeEventListener('error', () => {});
  };
}
