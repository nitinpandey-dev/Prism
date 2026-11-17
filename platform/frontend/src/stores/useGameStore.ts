import { create } from 'zustand';
import { AppMode, CameraViewMode, PlayerState, InteractableEntity } from '../types/game';
import { LearningMode } from '../types/physics';

export type StoryActivity = 'outpost' | 'skating';

interface GameStore {
  appMode: AppMode;
  activeActivity: StoryActivity;
  learningMode: LearningMode;
  cameraView: CameraViewMode;
  player: PlayerState;
  activeInteractable: InteractableEntity | null;
  isConsoleOpen: boolean;
  isActivityModalOpen: boolean;
  isSoundEnabled: boolean;
  
  // Actions
  setAppMode: (mode: AppMode) => void;
  setActiveActivity: (act: StoryActivity) => void;
  setActivityModalOpen: (open: boolean) => void;
  setLearningMode: (mode: LearningMode) => void;
  setCameraView: (view: CameraViewMode) => void;
  updatePlayerPosition: (pos: [number, number, number], rot: number, moving: boolean) => void;
  setNearInteractable: (interactable: InteractableEntity | null) => void;
  openConsole: (interactable: InteractableEntity) => void;
  closeConsole: () => void;
  toggleSound: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  appMode: 'story',
  activeActivity: 'skating', // Default to the newly implemented skating activity
  learningMode: 'school',
  cameraView: 'third_person',
  player: {
    position: [0, 1.0, -10], // Near Habitation Pod facing Outpost
    rotation: 0,
    isMoving: false,
    isGrounded: true,
    isInteracting: false,
    nearInteractableId: null,
  },
  activeInteractable: null,
  isConsoleOpen: false,
  isActivityModalOpen: false,
  isSoundEnabled: true,

  setAppMode: (mode) => set({ appMode: mode }),
  setActiveActivity: (act) => set({ activeActivity: act }),
  setActivityModalOpen: (open) => set({ isActivityModalOpen: open }),
  setLearningMode: (mode) => set({ learningMode: mode }),
  setCameraView: (view) => set({ cameraView: view }),
  updatePlayerPosition: (pos, rot, moving) =>
    set((state) => ({
      player: {
        ...state.player,
        position: pos,
        rotation: rot,
        isMoving: moving,
      },
    })),
  setNearInteractable: (interactable) =>
    set((state) => ({
      activeInteractable: interactable,
      player: {
        ...state.player,
        nearInteractableId: interactable ? interactable.id : null,
      },
    })),
  openConsole: (interactable) =>
    set({
      isConsoleOpen: true,
      activeInteractable: interactable,
      cameraView: 'terminal_view',
    }),
  closeConsole: () =>
    set({
      isConsoleOpen: false,
      cameraView: 'third_person',
    }),
  toggleSound: () => set((s) => ({ isSoundEnabled: !s.isSoundEnabled })),
}));

