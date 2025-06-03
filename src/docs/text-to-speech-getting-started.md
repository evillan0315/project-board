# 📘 TTSForm Usage Guide

The `TTSForm` component is a SolidJS-powered interface for generating high-quality Text-to-Speech (TTS) audio. It enables users to input prompts, configure language and voice options, and retrieve downloadable audio in real-time.

---

## 🧱 Component Overview

```tsx
import TTSForm from './components/TTSForm';

function App() {
  return (
    <main>
      <TTSForm />
    </main>
  );
}
```

> **Note:** This component is **self-contained** and does not accept any props. All state is managed internally via SolidJS signals.

---

## 🎛 User Interface Sections

### 1. **Prompt Input**

* A `textarea` where users can input the text that should be converted into speech.
* Minimum height: `160px` for sufficient input space.

### 2. **Language Selector**

* A dropdown menu listing all supported languages/locales (e.g., `en-US`, `hi-IN`, `fr-FR`).
* Selecting a language ensures appropriate phonetics and voice compatibility.

### 3. **Speaker Configuration**

Each speaker entry includes:

* `Speaker Name`: A custom label (e.g., "Narrator", "Eddie", etc.).
* `Voice Profile`: Select from predefined tones (e.g., `Bright`, `Informative`, `Smooth`) or choose `Custom` to manually specify a voice.
* `Custom Voice Input`: When `Custom` is selected, an additional field appears for entering a raw voice name.
* `Remove` Button: Deletes a speaker block.
* `+ Add Speaker` Button: Adds a new speaker to the list.

### 4. **Generate Button**

* Sends the prompt, language, and speaker config to the backend API.
* Disables on loading to prevent duplicate submissions.

### 5. **Audio Output**

* If the request is successful, an HTML `<audio>` element appears for playback.
* A separate **Download** button becomes available to save the `.wav` file.

### 6. **Error Handling**

* Any errors during API submission will be displayed in red beneath the action buttons.

---

## 🌐 API Integration

### Endpoint

```
POST /google-tts/generate
```

### Payload Format

```json
{
  "prompt": "Your text input",
  "languageCode": "en-US",
  "speakers": [
    { "speaker": "Alice", "voiceName": "BrightVoice" },
    { "speaker": "Bob", "voiceName": "CustomVoice" }
  ]
}
```

### Response

* **Success**: Returns a binary audio stream (`audio/wav`)
* **Failure**: Returns a structured error with message

---

## 🧪 Example Workflow

1. Enter a prompt such as:
   `"Welcome to our interactive tutorial!"`

2. Choose a language like:
   `English (United States)`

3. Add speakers:

   * Speaker 1: `Host`, Voice: `Bright`
   * Speaker 2: `Guest`, Voice: `Smooth`

4. Click **Generate Audio**

5. After processing:

   * Use the **audio player** to preview the result
   * Click **Download Audio** to save the file locally

---

## 🧠 State Signals

| Signal      | Type              | Description                         |
| ----------- | ----------------- | ----------------------------------- |
| `prompt`    | `string`          | Text entered for conversion         |
| `language`  | `string`          | Selected locale code                |
| `speakers`  | `SpeakerConfig[]` | Array of speaker name & voice pairs |
| `audioSrc`  | `string \| null`  | Object URL for audio playback       |
| `audioBlob` | `Blob \| null`    | Raw audio blob for file download    |
| `loading`   | `boolean`         | Controls UI loading state           |
| `error`     | `string`          | Error message display               |

---

## 🔧 Dependencies

Ensure the following packages and components are available:

* `solid-js`
* `@iconify-icon/solid`
* Local `Button` UI component
* Local `api.ts` wrapper for RESTful requests

---

## 🧩 Tips & Best Practices

* Prefer predefined voices when available to ensure best quality.
* Use short, distinct speaker names for clarity in multi-speaker setups.
* Test different tones for variation (e.g., `Bright` vs. `Calm`).
* Use the same language for all speakers to avoid phonetic mismatches.

---

## 📈 Planned Enhancements

| Feature                     | Status  |
| --------------------------- | ------- |
| WebSocket streaming         | Planned |
| Voice tone preview playback | Planned |
| Authenticated access        | Planned |
| Schema-based validation     | Planned |

---

## 📂 File Structure (Reference)

```
components/
  └── TTSForm.tsx
services/
  └── api.ts
```

---

