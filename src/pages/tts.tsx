import { createSignal, For, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from '../components/ui/Button';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { PageHeader } from '../components/ui/PageHeader';
import TTSFormComponent from '../components/TTSFormComponent';

import api from '../services/api';

interface SpeakerConfig {
  speaker: string;
  voiceName: string;
}
const languageOptions = [
  { label: 'Arabic (Egyptian)', code: 'ar-EG' },
  { label: 'German (Germany)', code: 'de-DE' },
  { label: 'English (US)', code: 'en-US' },
  { label: 'Spanish (US)', code: 'es-US' },
  { label: 'French (France)', code: 'fr-FR' },
  { label: 'Hindi (India)', code: 'hi-IN' },
  { label: 'Indonesian (Indonesia)', code: 'id-ID' },
  { label: 'Italian (Italy)', code: 'it-IT' },
  { label: 'Japanese (Japan)', code: 'ja-JP' },
  { label: 'Korean (Korea)', code: 'ko-KR' },
  { label: 'Portuguese (Brazil)', code: 'pt-BR' },
  { label: 'Russian (Russia)', code: 'ru-RU' },
  { label: 'Dutch (Netherlands)', code: 'nl-NL' },
  { label: 'Polish (Poland)', code: 'pl-PL' },
  { label: 'Thai (Thailand)', code: 'th-TH' },
  { label: 'Turkish (Turkey)', code: 'tr-TR' },
  { label: 'Vietnamese (Vietnam)', code: 'vi-VN' },
  { label: 'Romanian (Romania)', code: 'ro-RO' },
  { label: 'Ukrainian (Ukraine)', code: 'uk-UA' },
  { label: 'Bengali (Bangladesh)', code: 'bn-BD' },
  { label: 'English (India)', code: 'en-IN' },
  { label: 'Marathi (India)', code: 'mr-IN' },
  { label: 'Tamil (India)', code: 'ta-IN' },
  { label: 'Telugu (India)', code: 'te-IN' },
];
const voiceOptions = [
  { name: 'Zephyr', tone: 'Bright' },
  { name: 'Puck', tone: 'Upbeat' },
  { name: 'Charon', tone: 'Informative' },
  { name: 'Kore', tone: 'Firm' },
  { name: 'Fenrir', tone: 'Excitable' },
  { name: 'Leda', tone: 'Youthful' },
  { name: 'Orus', tone: 'Firm' },
  { name: 'Aoede', tone: 'Breezy' },
  { name: 'Callirrhoe', tone: 'Easy-going' },
  { name: 'Autonoe', tone: 'Bright' },
  { name: 'Enceladus', tone: 'Breathy' },
  { name: 'Iapetus', tone: 'Clear' },
  { name: 'Umbriel', tone: 'Easy-going' },
  { name: 'Algieba', tone: 'Smooth' },
  { name: 'Despina', tone: 'Smooth' },
  { name: 'Erinome', tone: 'Clear' },
  { name: 'Algenib', tone: 'Gravelly' },
  { name: 'Rasalgethi', tone: 'Informative' },
  { name: 'Laomedeia', tone: 'Upbeat' },
  { name: 'Achernar', tone: 'Soft' },
  { name: 'Alnilam', tone: 'Firm' },
  { name: 'Schedar', tone: 'Even' },
  { name: 'Gacrux', tone: 'Mature' },
  { name: 'Pulcherrima', tone: 'Forward' },
  { name: 'Achird', tone: 'Friendly' },
  { name: 'Zubenelgenubi', tone: 'Casual' },
  { name: 'Vindemiatrix', tone: 'Gentle' },
  { name: 'Sadachbia', tone: 'Lively' },
  { name: 'Sadaltager', tone: 'Knowledgeable' },
  { name: 'Sulafat', tone: 'Warm' },
];

export default function TTSForm() {
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

  const addSpeaker = () => setSpeakers([...speakers(), { speaker: '', voiceName: voiceOptions[0].name }]);
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
    <div class="flex flex-col max-w-7xl mx-auto">
      <div class="flex-1 scroll-smooth px-4 space-y-4">
        <PageHeader icon="mdi:tts">
          <h2 class="leading-0 uppercase tracking-widest text-xl">
            <b>TTS</b> Audio
          </h2>
        </PageHeader>
        <p class="">
          This interactive TTS generator transforms written prompts into human-like speech using the Google Cloud
          Text-to-Speech API. Customize the language, assign unique voices to multiple speakers, and preview or download
          the resulting audio.
        </p>
        {/* Main Content */}
        <div class="flex flex-col md:flex-row gap-6">
          <TTSFormComponent
            audioSrc={() => audioSrc() ?? null}
            audioBlob={() => audioBlob() ?? null}
            prompt={prompt}
            setPrompt={setPrompt}
            language={language}
            setLanguage={setLanguage}
            languageOptions={languageOptions}
            speakers={speakers}
            updateSpeaker={updateSpeaker}
            removeSpeaker={removeSpeaker}
            addSpeaker={addSpeaker}
            voiceOptions={voiceOptions}
            autoPlay={autoPlay}
            setAutoPlay={setAutoPlay}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            downloadAudio={downloadAudio}
          />

          {/* Sidebar Info */}
          <div class="w-full md:w-1/4 space-y-4 ">
            <div class="p-4 border rounded-lg bg-gray-800/10 border-gray-500/30">
              <h3 class="text-xl font-semibold">🔊 About Text-to-Speech</h3>

              <h4 class="font-medium mt-4">✨ Key Features</h4>
              <ul class="list-disc pl-5  space-y-1">
                <li>Supports over 20 languages and dialects</li>
                <li>Custom speaker and voice assignment</li>
                <li>Real-time playback of synthesized speech</li>
                <li>Downloadable `.wav` audio files</li>
                <li>Clean and responsive UI with SolidJS</li>
              </ul>

              <h4 class="font-medium mt-4">🌐 Language Support</h4>
              <p class="">Includes locales such as English (US, IN), Japanese, Hindi, Arabic, French, and more.</p>

              <h4 class="font-medium mt-4">🎙 Voice Profiles</h4>
              <p class="">
                Choose from curated tones like <em>Bright</em>, <em>Smooth</em>, or enter custom voice names for more
                control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
