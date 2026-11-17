/**
 * ARIA AI Companion Types
 * Autonomous Research & Intelligence Assistant
 */

export type AriaMood = 'idle' | 'analyzing' | 'guiding' | 'celebrating' | 'warning';

export interface AriaMessage {
  id: string;
  sender: 'aria' | 'student';
  text: string;
  timestamp: number;
  mood?: AriaMood;
  isHint?: boolean;
}

export interface AriaState {
  isActive: boolean;
  isOpen: boolean;
  currentMood: AriaMood;
  isThinking: boolean;
  messages: AriaMessage[];
  unreadCount: number;
}

