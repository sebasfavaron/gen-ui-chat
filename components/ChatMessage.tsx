import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { DynamicUIRenderer } from './DynamicUIRenderer';
// Fix: Rename imported ChatMessage type to avoid conflict with the component name.
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  // Fix: Use the renamed ChatMessageType.
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  const sanitizedHtml = useMemo(() => {
    if (!message.textPart) return '';
    // The model now sends HTML directly. We don't need 'marked'.
    // We just need to sanitize it to prevent XSS attacks.
    return DOMPurify.sanitize(message.textPart);
  }, [message.textPart]);

  return (
    <div className={`flex items-start gap-3 ${!isModel ? 'flex-row-reverse' : ''}`}>
      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 border-2 border-gray-600">
        {isModel ? <BotIcon /> : <UserIcon />}
      </div>
      <div
        className={`
          max-w-xl lg:max-w-2xl rounded-lg px-4 py-3 shadow-md
          ${isModel ? 'bg-gray-800' : 'bg-cyan-800'}
          ${message.isError ? 'text-red-300' : 'text-gray-100'}
        `}
      >
        {message.textPart && (
            <div
              // Removed 'prose' classes to allow the generated HTML's Tailwind styles to apply without conflict.
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
        )}
        {message.uiPart && (
          <div className={message.textPart ? "mt-3 pt-3 border-t border-gray-600" : ""}>
             <DynamicUIRenderer schema={message.uiPart} />
          </div>
        )}
      </div>
    </div>
  );
};