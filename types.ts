
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
}

export type UiMode = 'generative-ui' | 'text-only';