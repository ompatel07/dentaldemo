"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ToothModel } from "./ToothModel";

/**
 * The hero canvas.
 *
 * There are no lights in here. The molar is lit by a matcap baked from a
 * studio scene (components/hero/StudioSphere.tsx, scripts/bake-matcap.mjs).
 * Live environment lighting looked the same and cost far more: on Windows
 * (ANGLE, Direct3D) compiling the physical material and three's environment
 * prefilter froze the main thread for over two seconds between them -
 * measured, they were the two largest long tasks on the page. The camera
 * never moves, so a baked lookup is the same picture for one small shader.
 *
 * Nothing is drawn until that shader is ready: <Warmup> hands it to the
 * driver, which builds it off the main thread, and the loop only starts
 * once it is linked. The rendered still stays up in the meantime.
 *
 * The loop also stops whenever the hero leaves the viewport; it has no
 * business running while someone reads the pricing section.
 */
type Props = {
  reduced?: boolean;
  /** Fired once the first real frame is on screen, so the still can fade. */
  onReady?: () => void;
};

/** Compiles every program in the scene without blocking, then reports back. */
function Warmup({ onWarm }: { onWarm: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    let alive = true;
    const done = () => {
      if (alive) onWarm();
    };
    // Browsers without KHR_parallel_shader_compile resolve immediately and
    // simply compile on first draw, as before.
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, onWarm]);

  return null;
}

export default function TeethScene({ reduced = false, onReady }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(0);
  const [active, setActive] = useState(true);
  const [warm, setWarm] = useState(false);
  const [settled, setSettled] = useState(false);
  const markWarm = useCallback(() => setWarm(true), []);

  // Hero progress, 0 to 1 over the first viewport. scrollY is a cheap read
  // and does not force layout, so this can live on the frame loop.
  useEffect(() => {
    const read = () => {
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  // Once the programs are linked: two frames so the object is really on
  // screen before the still is taken away. Under reduced motion the loop is
  // then parked - the object is drawn, held still, and costs nothing.
  useEffect(() => {
    if (!warm) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => onReady?.());
    });
    const t = reduced ? window.setTimeout(() => setSettled(true), 600) : 0;
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      window.clearTimeout(t);
    };
  }, [warm, reduced, onReady]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frameloop = !warm ? "never" : reduced ? (settled ? "demand" : "always") : active ? "always" : "never";

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5.2], fov: 30 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => {
          // Reading the link log is a synchronous round trip to the driver.
          // Worth it while developing, not in front of a visitor.
          gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
        }}
      >
        <Suspense fallback={null}>
          <ToothModel scrollRef={scrollRef} reduced={reduced} />

          <Warmup onWarm={markWarm} />
        </Suspense>
      </Canvas>
    </div>
  );
}
