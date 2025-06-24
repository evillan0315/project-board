import { createSignal, For, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from '../ui/Button';
import ToggleSwitch from '../ui/ToggleSwitch';
import { PageHeader } from '../ui/PageHeader';
import TextToSpeechForm from './TextToSpeechForm';
import { TTS_VOICE_OPTIONS, TTS_LANGUAGE_OPTIONS } from '../../constants/tts';
import api from '../../services/api';

interface SpeakerConfig {
  speaker: string;
  voiceName: string;
}

export default function TextToSpeech() {
  const [prompt, setPrompt] = createSignal('');
  const [languageCode, setLanguageCode] = createSignal('en-US');
  const [language, setLanguage] = createSignal('en-US');
  const [speakers, setSpeakers] = createSignal<SpeakerConfig[]>([
    { speaker: 'Eddie', voiceName: 'Kore' },
    { speaker: 'Marionette', voiceName: 'Puck' },
  ]);
  const [autoPlay, setAutoPlay] = createSignal(false);

  const [audioSrc, setAudioSrc] = createSignal<string | undefined>();
  const [audioBlob, setAudioBlob] = createSignal<Blob | undefined>();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const updateSpeaker = (index: number, field: keyof SpeakerConfig, value: string) => {
    const updated = [...speakers()];
    updated[index][field] = value;
    setSpeakers(updated);
  };

  const addSpeaker = () => setSpeakers([...speakers(), { speaker: '', voiceName: TTS_VOICE_OPTIONS[0].name }]);
  const removeSpeaker = (index: number) => {
    const updated = [...speakers()];
    updated.splice(index, 1);
    setSpeakers(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setAudioSrc(undefined);
    setAudioBlob(undefined);

    try {
      const response = await api.post(
        '/google-tts/generate',
        {
          prompt: prompt(),
          languageCode: language(),
          speakers: speakers(),
        },
        {
          responseType: 'blob',
        },
      );

      if (!response.data) throw new Error('Failed to generate audio');

      const blob = response.data;
      const audioUrl = URL.createObjectURL(blob);
      setAudioSrc(audioUrl);
      setAudioBlob(blob);

      if (autoPlay()) {
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = () => {
    const blob = audioBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tts-audio.mp3';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div class="flex-1 scroll-smooth p-2">
      <p class="mb-4">
        This interactive TTS generator transforms written prompts into human-like speech using the Google Cloud
        Text-to-Speech API. Customize the language, assign unique voices to multiple speakers, and preview or download
        the resulting audio.
      </p>
      {/* Main Content */}
      <div class="flex flex-col">
        <TextToSpeechForm
          audioSrc={() => audioSrc() ?? null}
          audioBlob={() => audioBlob() ?? null}
          prompt={prompt}
          setPrompt={setPrompt}
          language={language}
          setLanguage={setLanguage}
          languageOptions={TTS_LANGUAGE_OPTIONS}
          speakers={speakers}
          updateSpeaker={updateSpeaker}
          removeSpeaker={removeSpeaker}
          addSpeaker={addSpeaker}
          voiceOptions={TTS_VOICE_OPTIONS}
          autoPlay={autoPlay}
          setAutoPlay={setAutoPlay}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          downloadAudio={downloadAudio}
        />
      </div>
    </div>
  );
}
