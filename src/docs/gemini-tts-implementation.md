# `TTSForm` Component

A fully interactive **Text-to-Speech (TTS)** generator form built with **SolidJS**. This component allows users to input prompts, select a language, configure multiple speakers with different voice profiles, and generate downloadable TTS audio using a backend service.

---

## ✨ Features

* **Prompt input** for generating speech content
* **Multilingual support** via a wide range of predefined language codes
* **Dynamic speaker configuration** with customizable voice tones
* **TTS generation** through a RESTful API (`/google-tts/generate`)
* **Real-time playback** of generated audio
* **Audio download** capability for local storage

---

## 🧩 Props

This component does **not** accept props. It manages all state internally using `createSignal`.

---

## 🔧 Dependencies

* [`solid-js`](https://www.solidjs.com/)
* [`@iconify-icon/solid`](https://docs.iconify.design/icon-components/solid/)
* Local `Button` UI component
* Local `api` service wrapper for HTTP requests

---

## 🌐 Language Options

The form includes built-in support for over 20 languages and locales, such as:

* English (US, India)
* Hindi (India)
* Japanese (Japan)
* Arabic (Egyptian)
* French (France)
* ...and more

These are mapped via the `languageOptions` array.

---

## 🎙 Voice Options

The form offers a variety of voice profiles, each associated with a "tone" (e.g., `Bright`, `Upbeat`, `Smooth`, `Informative`). Users may select a predefined voice or enter a **Custom** voice name.

Voice definitions are stored in the `voiceOptions` array.

---

## 📤 API Integration

### Endpoint

```
POST /google-tts/generate
```

### Request Payload

```json
{
  "prompt": "Your text input",
  "languageCode": "en-US",
  "speakers": [
    { "speaker": "Eddie", "voiceName": "Kore" },
    { "speaker": "Marionette", "voiceName": "Puck" }
  ]
}
```

### Response

* `200 OK`: Returns a binary audio stream (`audio/wav`)
* On success: Plays the audio and enables download
* On failure: Displays error message

---

## 🧠 State Signals

| Signal      | Type              | Purpose                                   |
| ----------- | ----------------- | ----------------------------------------- |
| `prompt`    | `string`          | Text prompt for TTS generation            |
| `language`  | `string`          | Language code (e.g., `en-US`)             |
| `speakers`  | `SpeakerConfig[]` | Dynamic speaker/voice pairs               |
| `audioSrc`  | `string \| null`  | Object URL for audio playback             |
| `audioBlob` | `Blob \| null`    | Raw binary audio for download             |
| `loading`   | `boolean`         | Controls button state and feedback        |
| `error`     | `string`          | Displays error message on request failure |

---

## 📦 Component Structure

### Speaker Editor

* Allows multiple speaker inputs
* Supports voice selection or custom override
* Ability to dynamically add/remove speakers

### Submission & Feedback

* Submits via `handleSubmit()`
* Uses `api.post` to send the form data
* On success: renders `<audio>` player and download button
* On failure: displays inline error message

---

## 📎 Example Usage

No props or configuration is required:

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

---

## 🧪 TODOs / Enhancements

* Support for streaming audio response (WebSockets)
* Voice tone preview/sample playback
* Authentication integration
* Validation schema for speaker config


