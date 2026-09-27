import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createStudioEnvironment, createContactShadowTexture } from '../../lib/threeEnv';
import { heroSceneState } from '../../lib/sceneState';

interface HeroSceneProps {
  /** Static single-frame render when the user prefers reduced motion. */
  reducedMotion?: boolean;
  /** Drop particles and detail on low-power devices. */
  lightweight?: boolean;
  className?: string;
}

interface TowerSpec {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  tone: 0 | 1 | 2;
  bands: number;
}

const TOWERS: TowerSpec[] = [
  { x: -5.05, z: -1.6, w: 2.4, d: 2.4, h: 8.6, tone: 0, bands: 3 },
  { x: -1.95, z: -3.3, w: 3.05, d: 2.85, h: 11.9, tone: 1, bands: 4 },
  { x: 1.95, z: -2.7, w: 2.6, d: 2.6, h: 7.4, tone: 2, bands: 2 },
  { x: 5.05, z: -1.1, w: 2.2, d: 2.2, h: 5.3, tone: 0, bands: 1 },
  { x: -0.15, z: 0.9, w: 3.7, d: 2.1, h: 2.3, tone: 0, bands: 0 },
];

const STONE = '#e7e0d2';
const STONE_DARK = '#cec4b0';
const GLASS = '#151f30';
const GOLD = '#b08d3f';
const GROUND = '#cfc7b8';

function createFacadeTexture(tone: TowerSpec['tone']): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const base = tone === 1 ? STONE : tone === 2 ? STONE_DARK : '#ece6da';
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle vertical jointing.
  ctx.fillStyle = 'rgba(120,110,92,0.10)';
  for (let x = 0; x < canvas.width; x += 32) {
    ctx.fillRect(x, 0, 1, canvas.height);
  }

  // Floor bands + glazing.
  const floorHeight = 34;
  for (let y = 12; y < canvas.height - 20; y += floorHeight) {
    ctx.fillStyle = tone === 2 ? 'rgba(24,34,52,0.92)' : 'rgba(28,40,60,0.88)';
    ctx.fillRect(10, y, canvas.width - 20, 19);
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.fillRect(10, y, canvas.width - 20, 2);
    ctx.fillStyle = 'rgba(120,110,92,0.16)';
    ctx.fillRect(0, y + 24, canvas.width, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

/** Slow architectural drift + pointer parallax + scroll dolly. */
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 3.5, 0));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scroll = heroSceneState.scrollProgress;
    const px = heroSceneState.pointer.x;
    const py = heroSceneState.pointer.y;

    const driftX = reducedMotion ? 0 : Math.sin(t * 0.11) * 0.55;
    const driftY = reducedMotion ? 0 : Math.sin(t * 0.08 + 1.2) * 0.18;

    const desiredX = 0.7 + driftX + px * 1.35 + scroll * 1.1;
    const desiredY = 3.7 + driftY - py * 0.75 - scroll * 0.9;
    const desiredZ = 16.6 + scroll * 2.4;

    camera.position.x += (desiredX - camera.position.x) * 0.045;
    camera.position.y += (desiredY - camera.position.y) * 0.045;
    camera.position.z += (desiredZ - camera.position.z) * 0.045;

    const lookY = 3.5 - scroll * 1.6;
    target.current.y += (lookY - target.current.y) * 0.05;
    camera.lookAt(target.current);
  });

  return null;
}

function Tower({ spec, lightweight }: { spec: TowerSpec; lightweight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const map = useMemo(() => createFacadeTexture(spec.tone), [spec.tone]);

  useFrame(({ clock }) => {
    if (!groupRef.current || lightweight) return;
    // Very subtle breathing so the skyline never feels like a frozen diorama.
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.35 + spec.x) * 0.045;
  });

  return (
    <group position={[spec.x, 0, spec.z]}>
      <group ref={groupRef}>
        {/* Glazed plinth */}
        <RoundedBox args={[spec.w + 0.28, 1.1, spec.d + 0.28]} radius={0.05} smoothness={2} position={[0, 0.55, 0]}>
          <meshStandardMaterial color={GLASS} roughness={0.16} metalness={0.72} />
        </RoundedBox>

        {/* Facade */}
        <RoundedBox args={[spec.w, spec.h, spec.d]} radius={0.06} smoothness={2} position={[0, 1.1 + spec.h / 2, 0]}>
          <meshStandardMaterial
            color="#ffffff"
            map={map ?? undefined}
            roughness={0.72}
            metalness={0.06}
          />
        </RoundedBox>

        {/* Gold accent bands */}
        {Array.from({ length: spec.bands }).map((_, index) => {
          const y = 1.1 + ((index + 1) * spec.h) / (spec.bands + 1);
          return (
            <RoundedBox
              key={index}
              args={[spec.w + 0.12, 0.075, spec.d + 0.12]}
              radius={0.02}
              smoothness={2}
              position={[0, y, 0]}
            >
              <meshStandardMaterial color={GOLD} roughness={0.26} metalness={0.94} />
            </RoundedBox>
          );
        })}

        {/* Crown slab */}
        <RoundedBox args={[spec.w * 0.55, 0.22, spec.d * 0.55]} radius={0.03} smoothness={2} position={[0, 1.1 + spec.h + 0.11, 0]}>
          <meshStandardMaterial color={STONE_DARK} roughness={0.62} metalness={0.14} />
        </RoundedBox>
      </group>
    </group>
  );
}

/** Warm atmospheric dust — extremely subtle, adds depth without noise. */
function Atmosphere({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 16 + 0.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24 - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.012;
    pointsRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.35;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.055}
        color="#f4dcae"
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  useEffect(() => {
    const env = createStudioEnvironment(gl);
    if (!env) return;
    scene.environment = env.texture;
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene]);
  return null;
}

export default function HeroScene({ reducedMotion = false, lightweight = false, className }: HeroSceneProps) {
  const shadowTexture = useMemo(() => createContactShadowTexture(), []);

  return (
    <Canvas
      className={className}
      dpr={lightweight ? [1, 1.3] : [1, 1.75]}
      gl={{ antialias: !lightweight, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.7, 3.7, 16.6], fov: 34, near: 0.1, far: 120 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      onCreated={({ gl, scene, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.06;
        if (reducedMotion) gl.render(scene, camera);
      }}
    >
      <StudioEnvironment />

      <ambientLight intensity={0.42} />
      <hemisphereLight args={['#fff6e6', '#3b4256', 0.55]} />
      <directionalLight position={[9, 13, 7]} intensity={2.35} color="#fff3e0" />
      <directionalLight position={[-10, 5, -5]} intensity={0.55} color="#cbd6e6" />
      <pointLight position={[0, 5.5, 7]} intensity={38} distance={34} decay={2} color="#f0c777" />

      <fog attach="fog" args={['#0b1220', 22, 62]} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
        <circleGeometry args={[46, 64]} />
        <meshStandardMaterial color={GROUND} roughness={0.52} metalness={0.08} />
      </mesh>

      {/* Contact shadows */}
      {TOWERS.map((tower) => (
        <mesh
          key={`shadow-${tower.x}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[tower.x, 0.012, tower.z]}
        >
          <planeGeometry args={[tower.w * 3.1, tower.d * 3.1]} />
          <meshBasicMaterial
            map={shadowTexture ?? undefined}
            transparent
            opacity={0.75}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Podium / landscaped deck */}
      <RoundedBox args={[15.5, 0.34, 7.4]} radius={0.05} smoothness={2} position={[0, 0.17, -1.4]}>
        <meshStandardMaterial color={STONE} roughness={0.66} metalness={0.1} />
      </RoundedBox>

      {/* Terrace water body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.15, 0.36, 0.9]}>
        <planeGeometry args={[3.1, 1.55]} />
        <meshStandardMaterial color="#8fa6b4" roughness={0.08} metalness={0.55} />
      </mesh>

      {TOWERS.map((tower) => (
        <Tower key={`tower-${tower.x}`} spec={tower} lightweight={lightweight} />
      ))}

      {!lightweight && <Atmosphere count={260} />}

      <CameraRig reducedMotion={reducedMotion} />
    </Canvas>
  );
}
