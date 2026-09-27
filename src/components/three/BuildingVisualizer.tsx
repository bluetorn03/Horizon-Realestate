import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createStudioEnvironment } from '../../lib/threeEnv';
import { visualizerSceneState } from '../../lib/sceneState';

interface BuildingVisualizerProps {
  reducedMotion?: boolean;
  lightweight?: boolean;
  className?: string;
}

const STONE = '#eae4d8';
const STONE_DARK = '#cdc3b0';
const WOOD = '#8a6a45';
const GLASS = '#16202f';
const GOLD = '#b08d3f';
const WATER = '#93aab7';

/**
 * Scroll-scrubbed architectural visualisation of a signature residence.
 *
 * As the pinned section scrolls the camera dollies in, the building rotates,
 * and the floor plates separate to reveal the internal arrangement.
 * Pointer drag adds a manual rotation with inertia so the piece stays
 * interactive without fighting the scroll choreography.
 */
function Residence({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const floorsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const progress = visualizerSceneState.scrollProgress;
    const group = groupRef.current;
    if (group) {
      const baseRotation = -0.55 + progress * 1.1 + visualizerSceneState.dragRotation;
      group.rotation.y += (baseRotation - group.rotation.y) * 0.07;
    }
    const floors = floorsRef.current;
    if (floors) {
      floors.children.forEach((child, index) => {
        const targetY = index === 0 ? 0 : progress * 1.15 * index;
        child.position.y += (targetY - child.position.y) * 0.08;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      {/* Site plinth */}
      <RoundedBox args={[16, 0.4, 13]} radius={0.06} smoothness={2} position={[0, -0.2, 0]}>
        <meshStandardMaterial color={STONE_DARK} roughness={0.72} metalness={0.08} />
      </RoundedBox>

      <group ref={floorsRef}>
        {/* Ground floor */}
        <group position={[0, 0, 0]}>
          <RoundedBox args={[10.4, 3.1, 7.6]} radius={0.05} smoothness={2} position={[0, 1.55, 0]}>
            <meshStandardMaterial color={STONE} roughness={0.68} metalness={0.08} />
          </RoundedBox>
          <RoundedBox args={[10.8, 0.14, 8]} radius={0.03} smoothness={2} position={[0, 3.16, 0]}>
            <meshStandardMaterial color={GOLD} roughness={0.28} metalness={0.92} />
          </RoundedBox>
          {/* Full height glazing */}
          <RoundedBox args={[7.4, 2.5, 0.14]} radius={0.03} smoothness={2} position={[0, 1.35, 3.82]}>
            <meshStandardMaterial color={GLASS} roughness={0.1} metalness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.14, 2.5, 6.2]} radius={0.03} smoothness={2} position={[5.22, 1.35, 0.6]}>
            <meshStandardMaterial color={GLASS} roughness={0.1} metalness={0.7} />
          </RoundedBox>
        </group>

        {/* First floor cantilever */}
        <group position={[0, 0, 0]}>
          <RoundedBox args={[8.6, 3.0, 6.6]} radius={0.05} smoothness={2} position={[0.5, 4.6, -0.2]}>
            <meshStandardMaterial color={STONE} roughness={0.7} metalness={0.08} />
          </RoundedBox>
          <RoundedBox args={[8.9, 0.14, 6.9]} radius={0.03} smoothness={2} position={[0.5, 6.16, -0.2]}>
            <meshStandardMaterial color={STONE_DARK} roughness={0.55} metalness={0.16} />
          </RoundedBox>
          <RoundedBox args={[6.0, 2.4, 0.12]} radius={0.03} smoothness={2} position={[0.5, 5.4, 3.14]}>
            <meshStandardMaterial color={GLASS} roughness={0.1} metalness={0.7} />
          </RoundedBox>
          {/* Timber louvre screen */}
          {Array.from({ length: 9 }).map((_, index) => (
            <RoundedBox
              key={`louvre-${index}`}
              args={[0.1, 2.2, 0.34]}
              radius={0.02}
              smoothness={2}
              position={[5.02 - index * 0.42, 4.6, 2.4]}
            >
              <meshStandardMaterial color={WOOD} roughness={0.72} metalness={0.05} />
            </RoundedBox>
          ))}
        </group>

        {/* Terrace & pergola */}
        <group position={[0, 0, 0]}>
          <RoundedBox args={[8.2, 0.16, 5.6]} radius={0.03} smoothness={2} position={[0.6, 6.3, -0.3]}>
            <meshStandardMaterial color={STONE_DARK} roughness={0.6} metalness={0.14} />
          </RoundedBox>
          {Array.from({ length: 7 }).map((_, index) => (
            <RoundedBox
              key={`pergola-${index}`}
              args={[7.6, 0.08, 0.16]}
              radius={0.02}
              smoothness={2}
              position={[0.6, 7.5, -3.0 + index * 0.9]}
            >
              <meshStandardMaterial color={WOOD} roughness={0.7} metalness={0.05} />
            </RoundedBox>
          ))}
          <RoundedBox args={[0.12, 1.3, 5.6]} radius={0.03} smoothness={2} position={[-3.2, 6.95, -0.3]}>
            <meshStandardMaterial color={STONE} roughness={0.68} metalness={0.08} />
          </RoundedBox>
          <RoundedBox args={[0.12, 1.3, 5.6]} radius={0.03} smoothness={2} position={[4.4, 6.95, -0.3]}>
            <meshStandardMaterial color={STONE} roughness={0.68} metalness={0.08} />
          </RoundedBox>
        </group>
      </group>

      {/* Infinity pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, 0.06, -6.1]}>
        <planeGeometry args={[11.5, 2.4]} />
        <meshStandardMaterial color={WATER} roughness={0.05} metalness={0.6} />
      </mesh>
      <RoundedBox args={[12.1, 0.22, 3]} radius={0.04} smoothness={2} position={[0.4, 0.02, -6.1]}>
        <meshStandardMaterial color={STONE} roughness={0.74} metalness={0.06} />
      </RoundedBox>

      {/* Landscaping hedges */}
      {[
        [-6.6, 1.4],
        [-5.2, 1.4],
        [6.6, 1.4],
        [5.2, 1.4],
        [-6.6, -2.6],
        [6.6, -2.6],
      ].map(([x, z], index) => (
        <RoundedBox key={`hedge-${index}`} args={[1.1, 0.9, 3.4]} radius={0.28} smoothness={3} position={[x, 0.55, z]}>
          <meshStandardMaterial color="#5c6f5c" roughness={0.85} metalness={0.02} />
        </RoundedBox>
      ))}

      {/* Slender accent trees */}
      {[
        [-7.6, -5.4],
        [7.6, -5.4],
        [-7.4, 4.2],
      ].map(([x, z], index) => (
        <group key={`tree-${index}`} position={[x, 0, z]}>
          <mesh position={[0, 1.7, 0]}>
            <cylinderGeometry args={[0.11, 0.16, 3.4, 8]} />
            <meshStandardMaterial color={WOOD} roughness={0.8} metalness={0.03} />
          </mesh>
          <mesh position={[0, 3.9, 0]}>
            <icosahedronGeometry args={[1.5, 1]} />
            <meshStandardMaterial color="#5f7360" roughness={0.82} metalness={0.02} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DragRotation() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    // Desktop-only: on touch devices the gesture must stay with the page.
    const finePointer =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true;
    if (!finePointer) return;

    let dragging = false;
    let lastX = 0;
    let velocity = 0;

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      velocity = delta * 0.0055;
      visualizerSceneState.dragRotation += velocity;
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, [gl]);

  return null;
}

function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const progress = visualizerSceneState.scrollProgress;
    const desiredX = 0.2 + progress * 1.4;
    const desiredY = 10.5 - progress * 5.6;
    const desiredZ = 21 - progress * 6.4;

    camera.position.x += (desiredX - camera.position.x) * 0.05;
    camera.position.y += (desiredY - camera.position.y) * 0.05;
    camera.position.z += (desiredZ - camera.position.z) * 0.05;
    camera.lookAt(0, 3.1 - progress * 0.9, 0);
  });

  return null;
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

export default function BuildingVisualizer({
  reducedMotion = false,
  lightweight = false,
  className,
}: BuildingVisualizerProps) {
  return (
    <Canvas
      className={className}
      dpr={lightweight ? [1, 1.3] : [1, 1.75]}
      gl={{ antialias: !lightweight, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.2, 10.5, 21], fov: 36, near: 0.1, far: 160 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      onCreated={({ gl, scene, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
        if (reducedMotion) gl.render(scene, camera);
      }}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.44} />
      <hemisphereLight args={['#fff6e6', '#39415a', 0.6]} />
      <directionalLight position={[12, 16, 9]} intensity={2.4} color="#fff2dd" />
      <directionalLight position={[-11, 6, -7]} intensity={0.5} color="#c8d4e4" />
      <pointLight position={[0, 8, 9]} intensity={44} distance={40} decay={2} color="#f2cb84" />
      <fog attach="fog" args={['#0b1220', 34, 90]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <circleGeometry args={[44, 64]} />
        <meshStandardMaterial color="#c6beb0" roughness={0.62} metalness={0.06} />
      </mesh>

      <Residence reducedMotion={reducedMotion} />
      <DragRotation />
      <CameraRig />
    </Canvas>
  );
}
