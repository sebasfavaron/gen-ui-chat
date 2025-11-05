
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-800 border-b border-gray-700 shadow-md">
      <h1 className="text-xl md:text-2xl font-bold text-center text-cyan-400">
        <span role="img" aria-label="sparkles" className="mr-2">✨</span>
        Generative UI Chatbot
        <span role="img" aria-label="robot" className="ml-2">🤖</span>
      </h1>
      <p className="text-center text-gray-400 text-sm mt-1">Powered by Gemini</p>
    </header>
  );
};