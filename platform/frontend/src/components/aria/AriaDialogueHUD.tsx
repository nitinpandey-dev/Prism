import { useState, useRef, useEffect } from 'react';
import { useAriaStore } from '../../stores/useAriaStore';
import { usePhysicsStore } from '../../stores/usePhysicsStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { X, Send, Bot, Sparkles, HelpCircle } from 'lucide-react';

export default function AriaDialogueHUD() {
  const { isOpen, setOpen, messages, isThinking, currentMood, askAria } = useAriaStore();
  const { params, trajectory } = usePhysicsStore();
  const { stage, missionId } = useMissionStore();

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const activeActivity = useGameStore((s) => (s as any).activeActivity || 'outpost');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isThinking) return;

    const question = input.trim();
    setInput('');

    // Context packet sent to ARIA depending on current activity
    const context = activeActivity === 'skating'
      ? {
          missionId: 'PHY-ACT-001',
          activity: 'skating',
          stage: 'STAGE_5_EXPERIMENT',
          question,
        }
      : {
          missionId,
          stage,
          launchAngle: params.launchAngle,
          initialSpeed: params.initialSpeed,
          missDistance: trajectory.metrics.distanceToTarget,
          isHit: trajectory.metrics.isHit,
        };

    askAria(question, context);
  };

  const quickPrompts = activeActivity === 'skating'
    ? [
        'Why does slippery take longer to stop?',
        'What is the formula for stopping distance?',
        'Explain friction force F = μN',
        'How does speed affect stopping distance?',
      ]
    : [
        'How do I calculate range?',
        'Why is 45° not optimal here?',
        'What is the formula for flight time?',
        'Give me a calibration hint',
      ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 90,
        right: 24,
        width: 380,
        height: 520,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7)',
        zIndex: 90,
        overflow: 'hidden',
        color: '#f8fafc',
      }}
    >
      {/* ── ARIA Header ── */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(14, 165, 233, 0.6)',
            }}
          >
            <Bot size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>ARIA Companion</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                }}
              >
                {currentMood}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Autonomous Research & Intelligence Assistant
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Dialogue Messages Stream ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === 'student' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background:
                m.sender === 'student'
                  ? 'linear-gradient(135deg, #0284c7, #2563eb)'
                  : 'rgba(30, 41, 59, 0.85)',
              border: m.sender === 'student' ? 'none' : '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: '0.82rem',
              lineHeight: 1.45,
              color: '#f8fafc',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            {m.text}
          </div>
        ))}

        {isThinking && (
          <div
            style={{
              alignSelf: 'flex-start',
              background: 'rgba(30, 41, 59, 0.7)',
              borderRadius: 12,
              padding: '8px 14px',
              fontSize: '0.78rem',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Sparkles size={14} className="animate-spin" />
            <span>ARIA is analyzing telemetry...</span>
          </div>
        )}
      </div>

      {/* ── Quick Prompt Suggestions ── */}
      <div
        style={{
          padding: '8px 14px',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          background: 'rgba(15, 23, 42, 0.5)',
        }}
      >
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            onClick={() => askAria(q, { missionId, stage })}
            style={{
              whiteSpace: 'nowrap',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: 14,
              padding: '4px 10px',
              fontSize: '0.72rem',
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* ── Input Box ── */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 14px',
          borderTop: '1px solid rgba(148, 163, 184, 0.15)',
          display: 'flex',
          gap: 8,
          background: 'rgba(30, 41, 59, 0.6)',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ARIA a question..."
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: 8,
            padding: '8px 12px',
            color: '#f8fafc',
            fontSize: '0.82rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          style={{
            background: '#0284c7',
            border: 'none',
            borderRadius: 8,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: !input.trim() || isThinking ? 'not-allowed' : 'pointer',
            opacity: !input.trim() || isThinking ? 0.5 : 1,
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

