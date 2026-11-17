import { create } from 'zustand';
import { AriaState, AriaMessage, AriaMood } from '../types/aria';

interface AriaStore extends AriaState {
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setMood: (mood: AriaMood) => void;
  addMessage: (sender: 'aria' | 'student', text: string, mood?: AriaMood, isHint?: boolean) => void;
  clearMessages: () => void;
  askAria: (question: string, context?: Record<string, any>) => Promise<void>;
}

const initialMessages: AriaMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'aria',
    text: 'Greetings, Researcher. I am ARIA, your Autonomous Research and Intelligence Assistant. An ion storm has damaged Outpost Theta’s microwave relay array, isolating us from the orbital station.',
    timestamp: Date.now() - 4000,
    mood: 'guiding',
  },
  {
    id: 'msg-init-2',
    sender: 'aria',
    text: 'Our only option is to deliver the Emergency Signal Transponder capsule across the canyon to Relay Receiver #4. Proceed to the Launch Platform and access the terminal [E].',
    timestamp: Date.now() - 1000,
    mood: 'guiding',
    isHint: true,
  },
];

export const useAriaStore = create<AriaStore>((set, get) => ({
  isActive: true,
  isOpen: false,
  currentMood: 'guiding',
  isThinking: false,
  messages: initialMessages,
  unreadCount: 2,

  toggleOpen: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      unreadCount: !state.isOpen ? 0 : state.unreadCount,
    })),

  setOpen: (open) =>
    set({
      isOpen: open,
      unreadCount: open ? 0 : get().unreadCount,
    }),

  setMood: (mood) => set({ currentMood: mood }),

  addMessage: (sender, text, mood = 'guiding', isHint = false) => {
    const newMessage: AriaMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender,
      text,
      timestamp: Date.now(),
      mood,
      isHint,
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
      currentMood: mood,
      unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
    }));
  },

  clearMessages: () => set({ messages: [], unreadCount: 0 }),

  askAria: async (question: string, context: Record<string, any> = {}) => {
    // 1. Add student message
    get().addMessage('student', question);
    set({ isThinking: true, currentMood: 'analyzing' });

    try {
      // 2. Call backend API with timeout and graceful local pedagogical fallback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch('/api/aria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context }),
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (response && response.ok) {
        const data = await response.json();
        set({ isThinking: false });
        get().addMessage('aria', data.reply || data.text, data.mood || 'guiding');
        return;
      }
    } catch {
      // Fall through to offline Socratic pedagogical engine
    }

    // 3. High-Quality Socratic Pedagogical Fallback (always works even offline / without API keys)
    set({ isThinking: false });
    const qLower = question.toLowerCase();

    let reply =
      "Remember: Projectile motion decomposes into horizontal motion at constant velocity (vx = v0 * cos θ) and vertical motion under constant gravitational acceleration (vy = v0 * sin θ - g*t). How does increasing your launch angle alter the flight time?";
    let mood: AriaMood = 'guiding';

    if (qLower.includes('angle') || qLower.includes('theta')) {
      reply =
        "On flat ground, maximum horizontal range occurs at 45°. However, our target is 10.5 meters BELOW our launch platform! When launching to a lower elevation, a slightly shallower angle (between 38° and 42°) optimizes range. Try calibrating around 41°!";
      mood = 'guiding';
    } else if (qLower.includes('velocity') || qLower.includes('speed') || qLower.includes('fast')) {
      reply =
        "Initial speed determines total energy. The distance across the canyon is approximately 108 meters down-range. At an angle of ~41°, an initial speed between 32 and 36 m/s will land directly into the funnel.";
      mood = 'guiding';
    } else if (qLower.includes('drag') || qLower.includes('air') || qLower.includes('wind')) {
      reply =
        "In University Mode, Kepler-186f's dense atmospheric air drag acts opposite to the velocity vector, dissipating kinetic energy throughout flight. You will need higher initial speed to overcome this drag!";
      mood = 'analyzing';
    } else if (qLower.includes('equation') || qLower.includes('formula')) {
      reply =
        "The fundamental kinematic trajectory equation is: y(x) = y0 + x*tan(θ) - (g * x²) / (2 * v0² * cos²(θ)). By setting y equal to the target elevation (-7.5 m) and x to target distance (108 m), we can solve for v0!";
      mood = 'analyzing';
    } else if (qLower.includes('hint') || qLower.includes('help') || qLower.includes('how')) {
      reply =
        "Recommended calibration: Set Launch Angle to 41.5° and Initial Velocity to 34.0 m/s in School Mode. Watch the green trajectory arc align with the receiver funnel!";
      mood = 'guiding';
    }

    get().addMessage('aria', reply, mood);
  },
}));

