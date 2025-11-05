import type { GroundingChunk } from '@google/genai';

/**
 * Grounding chunk from Google Search or Maps results
 * Re-exported from @google/genai for convenience
 */
export type { GroundingChunk } from '@google/genai';

export interface GenerativeUI {
  type: string;
  props?: Record<string, any>;
  children?: (GenerativeUI | string)[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  textPart: string;
  uiPart: GenerativeUI | null;
  isError?: boolean;
  sources?: GroundingChunk[];
}

export type UiMode = 'generative-ui' | 'text-only';

// ============================================================================
// Google Capabilities Types - Ported from gen-ui-chat-2
// ============================================================================

/**
 * Chat message format for Google Gemini API
 * Used by generateText function
 */
export interface ChatMessageForGemini {
  role: 'user' | 'model';
  parts: { text: string }[];
}
