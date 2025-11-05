
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ModeToggle } from './components/ModeToggle';
import { Header } from './components/Header';
import type { ChatMessage, UiMode } from './types';
import { sendMessageToGemini } from './services/geminiService';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uiMode, setUiMode] = useState<UiMode>('generative-ui');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'init',
        role: 'model',
        textPart: 'Hello! How can I help you today? Try asking me to create a UI component, like "show me a user profile card".',
        uiPart: null,
      },
    ]);
  }, []);

  const handleSend = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      textPart: prompt,
      uiPart: null,
    };
    setMessages(prev => [...prev, userMessage]);

    const botMessageId = (Date.now() + 1).toString();
    // Add a placeholder for the bot's response
    setMessages(prev => [
      ...prev,
      { id: botMessageId, role: 'model', textPart: '', uiPart: null },
    ]);

    try {
      await sendMessageToGemini(
        prompt,
        chat,
        setChat,
        uiMode,
        (text, ui) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId
                ? { ...msg, textPart: text, uiPart: ui }
                : msg
            )
          );
        }
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(e);
      setError(errorMessage);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, textPart: `Error: ${errorMessage}`, isError: true }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <ModeToggle uiMode={uiMode} setUiMode={setUiMode} />
      <ChatWindow messages={messages} isLoading={isLoading} />
      {error && <div className="text-center text-red-400 px-4 py-2">{error}</div>}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default App;