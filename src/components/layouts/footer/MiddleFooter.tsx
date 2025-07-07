import { Show, createSignal, type JSX, onMount } from 'solid-js';
import { Button } from '../../../components/ui/Button';
import { showToast } from '../../../stores/toast';
import api from '../../../services/api';
import { getBlobFileUrl } from '../../../services/file';
import RecordingModalPlayer from '../../../components/media/RecordingModalPlayer';
import MiniVideoPlayer from '../../../components/media/MiniVideoPlayer';
import FooterMiniAudioPlayer from '../../../components/media/FooterMiniAudioPlayer';
import { saveRecordId } from '../../../stores/fileStore';
import { useStore } from '@nanostores/solid';
interface MiddleFooterProps {
  show?: boolean;
}

export const MiddleFooter = (props: MiddleFooterProps): JSX.Element => {
  const [isRecording, setIsRecording] = createSignal(false);
  const [recordingPath, setRecordingPath] = createSignal<string | null>(null);
  const [recordingUrl, setRecordingUrl] = createSignal<string | null>(null);
  const [recordingId, setRecordingId] = createSignal<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = createSignal(false);

  const $recordId = useStore(saveRecordId);
  onMount(() => {
    const existingId = $recordId();
    if (existingId) {
      setIsRecording(true);
      setRecordingId(existingId);
    }
  });
  const handleScreenRecordToggle = async () => {
    try {
      if (!isRecording() || !$recordId()) {
        const response = await api.post('/recording/record-start');
        const id = response.data?.id;
        const path = response.data?.path;
        if (!id) throw new Error('Invalid start response');
        setRecordingId(id);
        if (!path) throw new Error('Missing Path');
        setRecordingPath(response.data?.path);
        setIsRecording(true);
        saveRecordId.set(id);
        showToast(`🟢 Recording id: ${id} started `, 'info');
      } else {
        const response = await api.post(`/recording/record-stop?id=${$recordId()}`);
        setIsRecording(false);
        if (response.data?.path) {
          const fileUrl = await getBlobFileUrl(recordingPath());
          console.log(fileUrl, recordingPath());
          if (fileUrl) {
            setRecordingUrl(fileUrl);
          }
          saveRecordId.set('');
          showToast(`✅ Screen recording id: ${recordingId()} stopped`, 'success');
        } else {
          showToast(`⚠ ${response.data?.message || 'Recording stop failed'}`, 'warn');
        }
      }
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      showToast(`❌ Error: ${(err as any).message}`, 'error');
    }
  };

  const handleScreenShot = async () => {
    try {
      const response = await api.post('/recording/capture');
      console.log(response.data, 'response.data');
      const path = response.data?.path;
      if (!path) throw new Error('Invalid screenshot response');

      const url = await getBlobFileUrl(path);
      console.log(url, path);
      showToast(
        `<div class="flex items-center gap-2">
          <img src="${url}" alt="screenshot" class="w-10 h-10 rounded" />
          Screen captured successfully
        </div>`,
        'success',
      );
    } catch (err) {
      console.error(err);
      showToast(`❌ Error: ${(err as any).message}`, 'error');
    }
  };

  return (
    <>
      <Show when={props.show}>
        <div class="flex items-center gap-2">
          <FooterMiniAudioPlayer />
          <Button
            icon="streamline-ultimate:video-player-movie-bold"
            class="btn-icon"
            onClick={() => setIsVideoOpen(!isVideoOpen())}
            title="Open Mini Video Player"
          />
          <Button
            icon="mdi:monitor-screenshot"
            class="btn-icon"
            onClick={handleScreenShot}
            title="Take a screenshot of the current screen"
          />
          <Button
            icon={isRecording() || $recordId() ? 'mdi:stop-circle' : 'mdi:record-rec'}
            onClick={handleScreenRecordToggle}
            title={isRecording() || $recordId() ? 'Stop screen recording' : 'Start screen recording'}
            class={isRecording() ? 'text-red-600' : ''}
          >
            {isRecording() || $recordId() ? 'Recording...' : 'Record Screen'}
          </Button>
        </div>
      </Show>

      <Show when={!isRecording() && recordingUrl()}>
        <RecordingModalPlayer path={recordingUrl()!} onClose={() => recordingUrl(null)} />
      </Show>
      <Show when={isVideoOpen()}>
        <MiniVideoPlayer />
      </Show>
    </>
  );
};
