import { buildMolar } from "./molarGeometry";

/**
 * Builds the molar off the main thread and posts the arrays back, handing
 * over their buffers rather than copying them.
 */
addEventListener("message", () => {
  const molar = buildMolar();
  postMessage(molar, {
    transfer: [molar.positions.buffer, molar.normals.buffer, molar.colors.buffer, molar.indices.buffer],
  });
});
