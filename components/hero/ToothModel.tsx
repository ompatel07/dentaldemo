"use client";

import { use, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, SRGBColorSpace, TextureLoader, type Group } from "three";
import { loadMolar } from "./loadMolar";

const MATCAP = "/images/tooth-matcap.webp";

type Props = {
  /** 0 at the top of the hero, 1 once it has scrolled a full viewport. */
  scrollRef: React.RefObject<number>;
  reduced: boolean;
};

/**
 * The hero molar: geometry from molarGeometry.ts, finished as glazed
 * porcelain.
 *
 * The glaze is a matcap - a photograph of a porcelain sphere in the studio,
 * looked up by surface direction - multiplied by the shading baked into
 * the geometry's vertex colours (the dark of the fissures, the ivory of the
 * roots). The matcap is already tone-mapped, so the material is not.
 */
export function ToothModel({ scrollRef, reduced }: Props) {
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0 });

  // Both are asked for before either is waited on, so the worker meshes
  // the tooth while the texture is still on the wire.
  const pending = loadMolar();
  useLoader.preload(TextureLoader, MATCAP);
  const matcap = useLoader(TextureLoader, MATCAP);
  const molar = use(pending);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(molar.positions, 3));
    geo.setAttribute("normal", new BufferAttribute(molar.normals, 3));
    geo.setAttribute("color", new BufferAttribute(molar.colors, 3));
    geo.setIndex(new BufferAttribute(molar.indices, 1));
    geo.computeBoundingSphere();
    return geo;
  }, [molar]);

  useLayoutEffect(() => {
    matcap.colorSpace = SRGBColorSpace;
    matcap.needsUpdate = true;
  }, [matcap]);

  // The canvas is pointer-events-none so the page under it stays clickable,
  // which means R3F never sees a pointer. Track it on the window instead.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    if (reduced) {
      g.rotation.set(0.28, -0.55, 0.06);
      return;
    }

    const p = scrollRef.current ?? 0;
    const t = state.clock.elapsedTime;

    // Frame-rate independent easing toward the pointer.
    const k = 1 - Math.pow(0.002, delta);
    eased.current.x += (pointer.current.x - eased.current.x) * k;
    eased.current.y += (pointer.current.y - eased.current.y) * k;

    g.rotation.y = -0.55 + t * 0.22 + eased.current.x * 0.5 + p * Math.PI * 1.1;
    g.rotation.x = 0.28 + eased.current.y * 0.22 - p * 0.3;
    g.rotation.z = 0.06 + Math.sin(t * 0.4) * 0.04;
    g.position.y = 0.08 + Math.sin(t * 0.7) * 0.05;
  });

  return (
    <group ref={group} position={[0, 0.08, 0]} rotation={[0.28, -0.55, 0.06]}>
      <mesh geometry={geometry} position={[0, -0.02, 0]} scale={1.12}>
        <meshMatcapMaterial matcap={matcap} vertexColors toneMapped={false} />
      </mesh>
    </group>
  );
}
