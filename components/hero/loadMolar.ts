import { buildMolar, type MolarArrays } from "./molarGeometry";

/**
 * The molar's arrays, built once per page in a Web Worker.
 *
 * Two reasons this is not a useMemo in the component. Meshing the field is
 * a few hundred milliseconds of pure arithmetic, which on the main thread
 * is a frozen page; and React throws a memo away when a component suspends
 * on its first render - the model does, waiting for its matcap - so the
 * work was quietly being done twice.
 *
 * If a worker cannot be started (an old browser, a strict policy) the same
 * function runs here instead. Slower, never broken.
 */
let pending: Promise<MolarArrays> | null = null;

export function loadMolar(): Promise<MolarArrays> {
  if (pending) return pending;

  pending = new Promise<MolarArrays>((resolve) => {
    const inline = () => resolve(buildMolar());
    try {
      const worker = new Worker(new URL("./molar.worker.ts", import.meta.url));
      worker.onmessage = (event: MessageEvent<MolarArrays>) => {
        resolve(event.data);
        worker.terminate();
      };
      worker.onerror = () => {
        worker.terminate();
        inline();
      };
      worker.postMessage(0);
    } catch {
      inline();
    }
  });

  return pending;
}
