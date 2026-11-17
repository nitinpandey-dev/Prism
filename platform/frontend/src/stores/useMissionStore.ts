import { create } from 'zustand';
import { MissionState, MissionStage } from '../types/mission';
import { TrajectoryMetrics } from '../types/physics';

interface MissionStore extends MissionState {
  setStage: (stage: MissionStage) => void;
  completeObjective: (id: string) => void;
  recordLaunchAttempt: (metrics: TrajectoryMetrics) => boolean; // returns true if mission passed
  resetMission: () => void;
}

const initialObjectives = [
  {
    id: 'obj-explore',
    title: 'Investigate Outpost Theta',
    description: 'Walk toward the Launch Pad and interact with the Pneumatic Launcher Terminal [E].',
    isCompleted: false,
    isCurrent: true,
  },
  {
    id: 'obj-calibrate',
    title: 'Calibrate Launcher Kinematics',
    description: 'Calculate angle and velocity required to clear the canyon and hit Emergency Relay Funnel #4.',
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'obj-launch',
    title: 'Execute Beacon Delivery',
    description: 'Fire the emergency transponder capsule and achieve an impact score >= 75%.',
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'obj-restore',
    title: 'Restore Outpost Communications',
    description: 'Verify relay telemetry handshake and transmit Kepler-186f distress signal.',
    isCompleted: false,
    isCurrent: false,
  },
];

export const useMissionStore = create<MissionStore>((set, get) => ({
  missionId: 'PHY-001',
  title: 'The Last Signal',
  stage: 'BRIEFING',
  objectives: initialObjectives,
  attemptsCount: 0,
  bestScore: 0,
  lastScore: 0,
  isRelayOnline: false,

  setStage: (stage) => set({ stage }),

  completeObjective: (id) =>
    set((state) => {
      let nextFound = false;
      const updated = state.objectives.map((obj) => {
        if (obj.id === id) {
          return { ...obj, isCompleted: true, isCurrent: false };
        }
        if (!obj.isCompleted && !nextFound) {
          nextFound = true;
          return { ...obj, isCurrent: true };
        }
        return obj;
      });
      return { objectives: updated };
    }),

  recordLaunchAttempt: (metrics: TrajectoryMetrics) => {
    const attempts = get().attemptsCount + 1;
    const score = metrics.score;
    const best = Math.max(get().bestScore, score);
    const passed = metrics.isHit;

    set({
      attemptsCount: attempts,
      lastScore: score,
      bestScore: best,
      isRelayOnline: passed,
      stage: passed ? 'COMPLETED' : 'EVALUATION',
    });

    if (passed) {
      get().completeObjective('obj-launch');
      get().completeObjective('obj-restore');
    }

    return passed;
  },

  resetMission: () =>
    set({
      stage: 'BRIEFING',
      objectives: initialObjectives,
      attemptsCount: 0,
      bestScore: 0,
      lastScore: 0,
      isRelayOnline: false,
    }),
}));

