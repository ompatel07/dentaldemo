"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";

/**
 * The studio the hero molar is lit in - used only to bake its matcap.
 *
 * A sphere in glazed porcelain, under the same cards and lamps the tooth
 * used to be lit by live. scripts/bake-matcap.mjs photographs it and the
 * result becomes public/images/tooth-matcap.webp: every surface direction
 * the camera can see, already lit.
 *
 * Why bake at all: live environment lighting means three.js prefilters the
 * environment on first draw, and compiling that shader on Windows froze the
 * main thread for the better part of a second. The camera never moves, so a
 * matcap gives the same picture for the cost of one texture lookup.
 *
 * Change the look here, re-run the bake, and the hero follows.
 */

/** The sphere must land exactly where three's matcap lookup expects it. */
const SIZE = 512;
const ZOOM = SIZE * 0.495;

/**
 * The subject never moves, so there is no loop: a handful of frames, spaced
 * out so the environment has baked before the last one, and then silence.
 */
function Develop() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const timers = [50, 400, 1200, 2400].map((ms) => window.setTimeout(() => invalidate(), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [invalidate]);
  return null;
}

export default function StudioSphere() {
  return (
    <div style={{ width: SIZE, height: SIZE }}>
      <Canvas orthographic frameloop="demand" dpr={2} camera={{ position: [0, 0, 5], zoom: ZOOM, near: 0.1, far: 20 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={["#9a9a9a"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} color="#FFFFFF" />
        <directionalLight position={[-4, 1, -2]} intensity={0.7} color="#72E5C0" />
        <directionalLight position={[2, -3, 2]} intensity={0.45} color="#FF6A3D" />

        <mesh>
          <sphereGeometry args={[1, 192, 192]} />
          <meshPhysicalMaterial
            color="#FDFBF6"
            roughness={0.2}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={0.3}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[200, 480]}
            sheen={0.6}
            sheenColor="#DDEFE7"
            sheenRoughness={0.5}
            envMapIntensity={1.15}
          />
        </mesh>

        {/* One mint and one coral card tie the reflections to the palette. */}
        <Environment resolution={512} frames={1}>
          <Lightformer form="rect" intensity={3} position={[2.5, 3, 3]} scale={[5, 5, 1]} color="#FFFFFF" />
          <Lightformer form="rect" intensity={1.6} position={[-4, 1, 1]} scale={[3, 7, 1]} color="#BFF0DE" />
          <Lightformer form="circle" intensity={2.2} position={[0, 4, -2]} scale={3.5} color="#FFFFFF" />
          <Lightformer form="rect" intensity={1.2} position={[1, -3.5, 1.5]} scale={[6, 2, 1]} color="#FFB59C" />
          <Lightformer form="rect" intensity={0.9} position={[0, 0, -5]} scale={[10, 10, 1]} color="#F4F6F3" />
        </Environment>

        <Develop />
      </Canvas>
    </div>
  );
}
