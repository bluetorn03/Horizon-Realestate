import * as THREE from 'three';

/**
 * Builds a tiny procedural equirectangular "studio" environment used to light
 * the architectural scenes. Generating it locally keeps the bundle free of
 * external HDR downloads, which would be a network dependency and a source of
 * runtime failure on locked-down networks.
 */
export function createStudioEnvironment(
  renderer: THREE.WebGLRenderer,
): THREE.WebGLRenderTarget | null {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#fffaf0'); // warm sky
  gradient.addColorStop(0.42, '#efe6d4');
  gradient.addColorStop(0.52, '#b9b2a4'); // horizon bounce
  gradient.addColorStop(0.72, '#4a5468'); // shaded ground
  gradient.addColorStop(1, '#0d1420'); // deep shade
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // A soft bright "window" so metal accents read as metal rather than black.
  const highlight = ctx.createRadialGradient(10, 26, 0, 10, 26, 22);
  highlight.addColorStop(0, 'rgba(255,255,255,0.95)');
  highlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, 32, 128);

  const source = new THREE.CanvasTexture(canvas);
  source.mapping = THREE.EquirectangularReflectionMapping;
  source.colorSpace = THREE.SRGBColorSpace;
  source.needsUpdate = true;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const target = pmrem.fromEquirectangular(source);
  pmrem.dispose();
  source.dispose();

  // The render target (not just its texture) is returned so the caller can
  // release the GPU memory when the scene unmounts.
  return target;
}

/** Soft radial "contact shadow" texture — cheap depth cue without shadow maps. */
export function createContactShadowTexture(): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(6, 11, 22, 0.42)');
  gradient.addColorStop(0.55, 'rgba(6, 11, 22, 0.16)');
  gradient.addColorStop(1, 'rgba(6, 11, 22, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
