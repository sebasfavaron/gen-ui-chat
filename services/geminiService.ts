import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import type { UiMode, GenerativeUI } from '../types';
// Fix: Import Dispatch and SetStateAction types from React to resolve namespace error.
import type { Dispatch, SetStateAction } from 'react';

let ai: GoogleGenAI | null = null;
const API_KEY = process.env.API_KEY;

const getAi = () => {
    if (!ai) {
        if (!API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}

const HTML_GENERATION_PROMPT_EXTENSION = `
---
SYSTEM INSTRUCTION:
Your entire response MUST be a single, valid \`\`\`html block.
Do not provide any text or explanation outside of this block.
Inside the HTML, use Tailwind CSS classes for all styling. The app uses Tailwind, so you can use any of its classes (e.g., 'bg-blue-500', 'text-white', 'p-4', 'rounded-lg', 'flex', 'items-center').
For contextual images, use https://source.unsplash.com/500x300/?{query}, replacing {query} with relevant, comma-separated keywords (e.g., for a query about Miami weather, use 'miami,weather,sunny').
Your goal is to create a rich, visually appealing HTML component that directly answers the user's prompt.

Example for a weather query:
\`\`\`html
<div class="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 max-w-sm">
  <h3 class="text-xl font-bold text-white mb-2">Weather in Miami</h3>
  <img src="https://source.unsplash.com/500x300/?miami,weather,sunny" alt="Sunny day in Miami" class="rounded-md mb-3">
  <p class="text-gray-200">It's currently <strong class="text-cyan-400">sunny</strong> with a few clouds.</p>
  <div class="flex justify-between items-center mt-4">
    <span class="text-3xl font-semibold text-white">78°F</span>
    <span class="text-gray-300">Humidity: 65%</span>
  </div>
</div>
\`\`\`

Example for a user profile query:
\`\`\`html
<div class="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 flex items-center gap-4 max-w-sm">
  <img src="https://picsum.photos/seed/janedoe/100/100" alt="Jane Doe" class="w-20 h-20 rounded-full border-2 border-cyan-400">
  <div>
    <h4 class="text-lg font-bold text-white">Jane Doe</h4>
    <p class="text-sm text-gray-300">Software Engineer</p>
    <button class="mt-2 px-3 py-1 bg-cyan-600 text-white text-xs rounded-full hover:bg-cyan-500">Contact</button>
  </div>
</div>
\`\`\`
---
`;

function parseGeminiResponse(responseText: string): { textPart: string; uiPart: GenerativeUI | null } {
  const htmlRegex = /```html\s*([\s\S]*?)\s*```/;
  const match = responseText.match(htmlRegex);

  // If an HTML block is found, we use its content as the primary text part.
  if (match && match[1]) {
    const htmlContent = match[1].trim();
    return { textPart: htmlContent, uiPart: null };
  }

  // If no block is found, return the plain text.
  // We also clean up any potential markdown fences that might not have been matched.
  const cleanedText = responseText.replace(/```/g, '');
  return { textPart: cleanedText, uiPart: null };
}


export const sendMessageToGemini = async (
  prompt: string,
  chat: Chat | null,
  setChat: Dispatch<SetStateAction<Chat | null>>,
  uiMode: UiMode,
  onStreamUpdate: (text: string, ui: GenerativeUI | null) => void
): Promise<void> => {
  const googleAi = getAi();
  let currentChat = chat;

  if (!currentChat) {
    currentChat = googleAi.chats.create({
      model: 'gemini-2.5-flash',
    });
    setChat(currentChat);
  }

  const fullPrompt = uiMode === 'generative-ui'
    ? `${prompt}\n${HTML_GENERATION_PROMPT_EXTENSION}`
    : prompt;

  const stream = await currentChat.sendMessageStream({ message: fullPrompt });

  let accumulatedText = "";
  for await (const chunk of stream) {
    accumulatedText += chunk.text;
    const { textPart, uiPart } = parseGeminiResponse(accumulatedText);
    onStreamUpdate(textPart, uiPart);
  }
};