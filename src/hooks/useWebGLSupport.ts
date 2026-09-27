import { useEffect, useState } from 'react';

let cachedSupport: boolean | null = null;

function detect(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (cachedSupport !== null) return cachedSupport;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGLRenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    const supported = Boolean(gl);
    if (gl && 'getExtension' in gl) {
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    }
    cachedSupport = supported;
    return supported;
  } catch {
    cachedSupport = false;
    return false;
  }
}

/**
 * Reports whether the current device can render WebGL.
 * Used to fall back to lightweight photography on old devices / locked-down
 * browsers, and to keep heavy 3D scenes off the main bundle path.
 */
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(() => detect());

  useEffect(() => {
    setSupported(detect());
  }, []);

  return supported;
}

/** True when the device is small enough that full 3D is not worth the cost. */
export function usePrefersLightweight3D(): boolean {
  const [lightweight, setLightweight] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const evaluate = () => {
      const smallScreen = window.matchMedia('(max-width: 767px)').matches;
      const lowCore = (navigator.hardwareConcurrency ?? 8) <= 4;
      const saveData =
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
        true;
      setLightweight(smallScreen || lowCore || saveData);
    };
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  return lightweight;
}
