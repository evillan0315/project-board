// src/components/settings/AISettings.tsx
import type { JSX } from 'solid-js';

interface AISettingsProps {
  model: string;
  temperature: number;
  maxTokens: number;
  onChange: <K extends 'model' | 'temperature' | 'maxTokens'>(key: K, value: AISettingsProps[K]) => void;
}

export default function AISettings(props: AISettingsProps): JSX.Element {
  return (
    <div class="space-y-3">
      <div>
        <label class="block text-gray-300 mb-1">Model</label>
        <select
          class="w-full bg-gray-800 text-gray-300 rounded p-1"
          value={props.model}
          onInput={(e) => props.onChange('model', e.currentTarget.value)}
        >
          <option>ChatGPT</option>
          <option>Gemini</option>
          <option>Bedrock</option>
        </select>
      </div>

      <div>
        <label class="block text-gray-300 mb-1">Temperature ({props.temperature})</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={props.temperature}
          onInput={(e) => props.onChange('temperature', parseFloat(e.currentTarget.value))}
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-gray-300 mb-1">Max Tokens</label>
        <input
          type="number"
          class="w-full bg-gray-800 text-gray-300 rounded p-1"
          min="100"
          max="4096"
          value={props.maxTokens}
          onInput={(e) => props.onChange('maxTokens', parseInt(e.currentTarget.value, 10))}
        />
      </div>
    </div>
  );
}
