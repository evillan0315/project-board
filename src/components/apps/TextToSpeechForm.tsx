// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/components/TTSFormComponent.tsx

import { For, Show } from 'solid-js';
import type { JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from '../ui/Button';
import ToggleSwitch from '../ui/ToggleSwitch';

/**
 * Type definition for the properties of the TTSFormComponent.
 */
type TextToSpeechFormProps = {
  /**
   * A signal function that returns the current prompt text.
   */
  prompt: () => string;
  /**
   * A signal function that sets the current prompt text.
   * @param val - The new prompt text.
   */
  setPrompt: (val: string) => void;
  /**
   * A signal function that returns the current language code.
   */
  language: () => string;
  /**
   * A signal function that sets the current language code.
   * @param val - The new language code.
   */
  setLanguage: (val: string) => void;
  /**
   * An array of language options, each containing a code and a label.
   */
  languageOptions: { code: string; label: string }[];
  /**
   * A signal function that returns an array of speaker objects, each containing a speaker name and a voice name.
   */
  speakers: () => { speaker: string; voiceName: string }[];
  /**
   * A function that updates a speaker's information at a given index.
   * @param index - The index of the speaker to update.
   * @param field - The field to update ('speaker' or 'voiceName').
   * @param value - The new value for the field.
   */
  updateSpeaker: (index: number, field: 'speaker' | 'voiceName', value: string) => void;
  /**
   * A function that removes a speaker at a given index.
   * @param index - The index of the speaker to remove.
   */
  removeSpeaker: (index: number) => void;
  /**
   * A function that adds a new speaker.
   */
  addSpeaker: () => void;
  /**
   * An array of voice options, each containing a name and an optional tone.
   */
  voiceOptions: { name: string; tone?: string }[];
  /**
   * A signal function that returns a boolean indicating whether autoplay is enabled.
   */
  autoPlay: () => boolean;
  /**
   * A signal function that sets the autoplay state.
   * @param value - The new autoplay state (true or false).
   */
  setAutoPlay: (value: boolean) => void;
  /**
   * A function that handles the form submission.
   */
  handleSubmit: () => void;
  /**
   * A signal function that returns a boolean indicating whether the component is loading.
   */
  loading: () => boolean;
  /**
   * A signal function that returns an error message, or an empty string if there is no error.
   */
  error: () => string;
  /**
   * A signal function that returns the URL of the generated audio.
   */
  audioSrc: () => string | null;
  /**
   * A signal function that returns the audio blob.
   */
  audioBlob: () => Blob | null;
  /**
   * A function that downloads the generated audio.
   */
  downloadAudio: () => void;
};

/**
 * A form component for text-to-speech (TTS) functionality.  Allows users to input a prompt,
 * select a language, configure multiple speakers with different voices, enable autoplay,
 * and generate/download audio.  Displays loading and error states, and provides audio playback.
 *
 * @param props - The properties for the TTSFormComponent.
 * @returns A JSX Element representing the TTS form.
 */
export default function TextToSpeechForm(props: TextToSpeechFormProps): JSX.Element {
  return (
    <div class="tts-wrapper space-y-4">
      <label class="block mb-1">Prompt</label>
      <textarea
        rows={4}
        class="w-full p-3 min-h-[160px] border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Enter your prompt here..."
        value={props.prompt()}
        onInput={(e) => props.setPrompt(e.currentTarget.value)}
      />

      <div>
        <label class="block mb-1 text-sm font-medium">Language</label>
        <select
          class="w-full p-2 border rounded-md"
          value={props.language()}
          onChange={(e) => props.setLanguage(e.currentTarget.value)}
        >
          <For each={props.languageOptions}>{(lang) => <option value={lang.code}>{lang.label}</option>}</For>
        </select>
      </div>

      <div class="space-y-2">
        <label class="block font-medium">Speakers</label>
        <For each={props.speakers()}>
          {(speaker, index) => (
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  class="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Speaker name"
                  value={speaker.speaker}
                  onInput={(e) => props.updateSpeaker(index(), 'speaker', e.currentTarget.value)}
                />
                <select
                  class="w-1/2 p-2 border rounded-md"
                  value={speaker.voiceName}
                  onChange={(e) => props.updateSpeaker(index(), 'voiceName', e.currentTarget.value)}
                >
                  <For each={props.voiceOptions}>
                    {(opt) => (
                      <option value={opt.name}>
                        {opt.name === 'Custom' ? 'Custom (manual)' : `${opt.name} (${opt.tone})`}
                      </option>
                    )}
                  </For>
                </select>
                <Button
                  variant="outline"
                  onClick={() => props.removeSpeaker(index())}
                  class="w-8 h-8 px-1 py-1 text-sm"
                >
                  <Icon icon="mdi:close" width="18" height="18" class="text-red-500" />
                </Button>
              </div>
              <Show when={speaker.voiceName === 'Custom'}>
                <input
                  type="text"
                  class="w-full p-2 border rounded-md"
                  placeholder="Enter custom voice name"
                  onInput={(e) => props.updateSpeaker(index(), 'voiceName', e.currentTarget.value)}
                />
              </Show>
            </div>
          )}
        </For>

        <div class="flex items-center justify-between">
          <Button onClick={props.addSpeaker} variant="secondary" class="primary px-4 py-1">
            + Add Speaker
          </Button>
          <ToggleSwitch label="Autoplay" checked={props.autoPlay()} onChange={props.setAutoPlay} />
        </div>
      </div>

      <Button
        class="w-full flex items-center gap-2 px-2 py-2 uppercase tracking-widest"
        onClick={props.handleSubmit}
        variant="secondary"
        disabled={props.loading()}
      >
        <Icon icon="mdi:tts" width="2.2em" height="2.2em" />
        {props.loading() ? 'Generating...' : 'Generate Audio'}
      </Button>

      <Show when={props.error()}>
        <p class="text-red-500">{props.error()}</p>
      </Show>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
        <Show when={props.audioSrc()}>
          <audio controls class="w-full rounded-lg shadow-lg">
            <source src={props.audioSrc()!} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </Show>
        <Show when={props.audioBlob()}>
          <Button
            class="w-full flex items-center gap-2 px-2 py-2 uppercase tracking-widest"
            onClick={props.downloadAudio}
          >
            <Icon icon="mdi:download" width="2em" height="2em" />
            Download Audio
          </Button>
        </Show>
      </div>
    </div>
  );
}
