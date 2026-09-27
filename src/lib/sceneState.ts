/**
 * Tiny mutable store shared between React (ScrollTrigger) and the WebGL
 * render loops. Using a plain object avoids React re-renders on every scroll
 * frame — the 3D scenes read it directly inside `useFrame`.
 */
export interface PointerState {
  x: number;
  y: number;
}

export const heroSceneState = {
  pointer: { x: 0, y: 0 } as PointerState,
  scrollProgress: 0,
  pointerActive: false,
};

export const visualizerSceneState = {
  scrollProgress: 0,
  dragRotation: 0,
};

export function resetSceneState(): void {
  heroSceneState.pointer.x = 0;
  heroSceneState.pointer.y = 0;
  heroSceneState.scrollProgress = 0;
  heroSceneState.pointerActive = false;
  visualizerSceneState.scrollProgress = 0;
  visualizerSceneState.dragRotation = 0;
}
