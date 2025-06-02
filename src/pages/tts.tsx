import { createSignal, For, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from '../components/ui/Button';
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

  const [audioSrc, setAudioSrc] = createSignal<string | null>(null);
  const [audioBlob, setAudioBlob] = createSignal<Blob | null>(null);
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
    setAudioSrc(null);
    setAudioBlob(null);

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
        }
      );

      if (!response.data) throw new Error('Failed to generate audio');

      const blob = response.data;
      const audioUrl = URL.createObjectURL(blob);
      setAudioSrc(audioUrl);
      setAudioBlob(blob);

      const audio = new Audio(audioUrl);
      audio.play();
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
    <div class="py-6">
      <div class="flex items-center justify-center">
        <div class="w-full max-w-3xl mx-auto p-6 rounded-2xl shadow-lg space-y-4 border">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">Generate TTS Audio</h2>
          <Icon icon="mdi:tts" width="2.2em" height="2.2em" />
          </div>
          <textarea
            rows={4}
            class="w-full p-3 min-h-[160px] border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Enter your prompt here..."
            value={prompt()}
            onInput={(e) => setPrompt(e.currentTarget.value)}
          />

          <div>
            <label class="block mb-1 text-sm font-medium">Language</label>
            <select
              class="w-full p-2 border rounded-md"
              value={language()}
              onChange={(e) => setLanguage(e.currentTarget.value)}
            >
              <For each={languageOptions}>{(lang) => <option value={lang.code}>{lang.label}</option>}</For>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block font-medium">Speakers</label>
            <For each={speakers()}>
              {(speaker, index) => (
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <input
                      type="text"
                      class="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Speaker name"
                      value={speaker.speaker}
                      onInput={(e) => updateSpeaker(index(), 'speaker', e.currentTarget.value)}
                    />
                    <select
                      class="w-1/2 p-2 border rounded-md"
                      value={speaker.voiceName}
                      onChange={(e) => updateSpeaker(index(), 'voiceName', e.currentTarget.value)}
                    >
                      <For each={voiceOptions}>
                        {(opt) => (
                          <option value={opt.name}>
                            {opt.name === 'Custom' ? 'Custom (manual)' : `${opt.name} (${opt.tone})`}
                          </option>
                        )}
                      </For>
                    </select>
                    <Button onClick={() => removeSpeaker(index())} class="px-2 py-1 text-sm">
                      ✕
                    </Button>
                  </div>
                  <Show when={speaker.voiceName === 'Custom'}>
                    <input
                      type="text"
                      class="w-full p-2 border rounded-md"
                      placeholder="Enter custom voice name"
                      onInput={(e) => updateSpeaker(index(), 'voiceName', e.currentTarget.value)}
                    />
                  </Show>
                </div>
              )}
            </For>

            <Button onClick={addSpeaker} class="text-sm">
              + Add Speaker
            </Button>
          </div>

          <Button
            class="w-full flex items-center gap-2 px-2 py-2 uppercase tracking-widest"
            onClick={handleSubmit}
            disabled={loading()}
          >
            <Icon icon="mdi:tts" width="2.2em" height="2.2em" />
            {loading() ? 'Generating...' : 'Generate Audio'}
          </Button>

          {error() && <p class="text-red-500">{error()}</p>}

          <div class="flex item-center justify-between gap-2">
            <Show when={audioSrc()}>
              <audio controls class="w-full rounded-lg shadow-lg">
                <source src={audioSrc()} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </Show>
            <Show when={audioBlob()}>
              <Button
                class="w-full flex items-center gap-2 px-2 py-2 uppercase tracking-widest"
                onClick={downloadAudio}
              >
                <Icon icon="mdi:download" width="2em" height="2em" />
                Download Audio
              </Button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}

