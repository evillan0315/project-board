// src/components/Chat/Chat.tsx

import { createSignal, For, onMount, createEffect } from 'solid-js';
import { render } from 'solid-js/web';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [input, setInput] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const sendMessage = async () => {
    if (!input()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: input(),
    };

    setMessages([...messages(), userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'bot',
        content: data.response,
      };

      setMessages([...messages(), userMessage, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'bot',
        content: 'Failed to get response. Please try again.',
      };
      setMessages([...messages(), userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: Event) => {
    setInput((e.target as HTMLInputElement).value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Scroll to bottom on new messages
  createEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });

  return (
    <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-950">
      <div class="flex-grow overflow-y-auto p-4" id="chat-container">
        <For each={messages()}>
          {(message) => (
            <div class={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                class={`rounded-lg py-2 px-3 max-w-2/3 break-words ${
                  message.sender === 'user'
                    ? 'bg-sky-950 text-gray-100 dark:bg-sky-600 dark:text-gray-100'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                }`}
              >
                {message.content}
              </div>
            </div>
          )}
        </For>
        {isLoading() && (
          <div class="flex justify-start mb-2">
            <div class="rounded-lg py-2 px-3 bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              Loading...
            </div>
          </div>
        )}
      </div>

      <div class="p-4 bg-gray-200 dark:bg-gray-800">
        <div class="flex rounded-lg overflow-hidden">
          <input
            type="text"
            class="flex-grow bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none"
            placeholder="Type your message..."
            value={input()}
            onInput={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            class="bg-sky-950 dark:bg-sky-600 text-gray-100 font-semibold py-2 px-4 hover:bg-sky-800 dark:hover:bg-sky-500 focus:outline-none"
            onClick={sendMessage}
            disabled={isLoading()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

/*

# Usage Example

To use this Chat component, you need to render it within your SolidJS application.  Below is a commented example of how to do that:

```typescript
// src/index.tsx (or your main entry point)
import { render } from 'solid-js/web';
import Chat from './components/Chat/Chat';
import './index.css'; // Import your tailwind css if you are using it.

const App = () => {
  return (
    <>
      <Chat />
    </>
  );
};

render(() => <App />, document.getElementById('root'));
```

## Explanation:

1.  **Import necessary modules:**
    *   `render` from `solid-js/web` for rendering the component.
    *   `Chat` from `./components/Chat/Chat` (assuming you saved the Chat component in that location).
    *   `./index.css` for your Tailwind CSS styles.  Make sure your tailwindcss is built, or you can use the cdn approach.

2.  **Create an App component:**
    *   This is the main component where you'll include the `Chat` component.
    *   It returns the `Chat` component wrapped in a fragment (`<>...</>`).

3.  **Render the App component:**
    *   `render(() => <App />, document.getElementById('root'))` renders the `App` component into the HTML element with the ID "root".  Make sure you have an element with `id="root"` in your `index.html` file.

## Setting up the API Endpoint (/api/chat)

The `Chat` component sends messages to the `/api/chat` endpoint. You need to implement this endpoint in your backend (e.g., Node.js with Express, Next.js API route, etc.).  Here's a commented example using Next.js:

```typescript
// pages/api/chat.ts (Next.js API route example)
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  response: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { message } = req.body;

    // Simulate a bot response (replace with your actual logic)
    const botResponse = `You said: ${message}`;

    // Send the response back to the client
    res.status(200).json({ response: botResponse });
  } else {
    // Handle other methods
    res.status(405).json({ response: 'Method Not Allowed' });
  }
}
```

## Explanation:

1.  **Import types:**
    *   Import `NextApiRequest` and `NextApiResponse` from `next/server`.

2.  **Define response type:**
    *   `Data` type defines the structure of the JSON response.

3.  **Create the handler function:**
    *   This function will be executed when the API endpoint is called.
    *   It checks if the request method is `POST`.

4.  **Extract the message:**
    *   `const { message } = req.body;` extracts the message from the request body.

5.  **Simulate a bot response:**
    *   `const botResponse = \`You said: ${message}\`;`  This is a placeholder for your actual bot logic.  Replace it with your desired processing (e.g., calling an OpenAI API, performing some calculations, etc.).

6.  **Send the response:**
    *   `res.status(200).json({ response: botResponse });` sends the bot's response back to the client as a JSON object with a 200 OK status.

7.  **Handle other methods:**
    *   If the request method is not `POST`, it returns a 405 Method Not Allowed error.

## Tailwind CSS Configuration
Make sure tailwindcss is install and setup with the correct configuration to use the latest version.



Remember to replace the simulation bot response logic with the actual logic you want.
*/
