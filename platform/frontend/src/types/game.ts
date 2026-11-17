/**
 * PRISM Game Runtime Types
 */

export type AppMode = 'story' | 'lab';

export type CameraViewMode = 'third_person' | 'launcher_aim' | 'terminal_view' | 'flight_follow';

export interface PlayerState {
  position: [number, number, number];
  rotation: number; // yaw angle in radians
  isMoving: boolean;
  isGrounded: boolean;
  isInteracting: boolean;
  nearInteractableId: string | null;
}

export interface InteractableEntity {
  id: string;
  name: string;
  prompt: string;
  position: [number, number, number];
  interactionDistance: number;
}

