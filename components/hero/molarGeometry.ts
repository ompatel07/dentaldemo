import { EDGE_TABLE, TRI_TABLE } from "./marchingTables";

/**
 * A molar, modelled as a signed-distance field and meshed with marching
 * cubes.
 *
 * The first attempts at this object were surfaces of revolution, and a
 * lathe can only ever produce a vase: no cusps, no fissure, no second root.
 * A distance field has none of those limits. The tooth below is a handful
 * of primitives - a rounded block for the crown, four spheres for the
 * cusps, a carved fossa and grooves, two tapering cones for the roots -
 * blended with a smooth minimum so they melt into one another the way
 * enamel actually does.
 *
 * Normals come from the field's gradient rather than from the triangles, so
 * the surface shades as a continuous form even at a modest grid.
 *
 * The hero never has to fetch a model file. Building one is a few hundred
 * thousand field samples, though, so this module is deliberately free of
 * three.js and of the DOM: it runs in a Web Worker (molar.worker.ts, via
 * loadMolar.ts) and hands back plain typed arrays.
 */

export type MolarArrays = {
  positions: Float32Array;
  normals: Float32Array;
  /** Linear-light vertex colours: occlusion and the ivory of the roots. */
  colors: Float32Array;
  indices: Uint32Array;
};

type V3 = [number, number, number];

/* ---------------- distance primitives ---------------- */

// The built-in hypot is an order of magnitude slower than a plain sqrt in
// V8, and the field is sampled a few million times. These are the hot path.
const len2 = (x: number, y: number) => Math.sqrt(x * x + y * y);
const len3 = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z);

const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

const sphere = (x: number, y: number, z: number, c: V3, r: number) =>
  len3(x - c[0], y - c[1], z - c[2]) - r;

function roundBox(x: number, y: number, z: number, c: V3, b: V3, r: number) {
  const qx = Math.abs(x - c[0]) - b[0];
  const qy = Math.abs(y - c[1]) - b[1];
  const qz = Math.abs(z - c[2]) - b[2];
  const outside = len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0));
  return outside + Math.min(Math.max(qx, qy, qz), 0) - r;
}

function ellipsoid(x: number, y: number, z: number, c: V3, r: V3) {
  const px = x - c[0], py = y - c[1], pz = z - c[2];
  const k0 = len3(px / r[0], py / r[1], pz / r[2]);
  const k1 = len3(px / (r[0] * r[0]), py / (r[1] * r[1]), pz / (r[2] * r[2]));
  return k1 === 0 ? -Math.min(r[0], r[1], r[2]) : (k0 * (k0 - 1)) / k1;
}

function capsule(x: number, y: number, z: number, a: V3, b: V3, r: number) {
  const pax = x - a[0], pay = y - a[1], paz = z - a[2];
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2];
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
  return len3(pax - bax * h, pay - bay * h, paz - baz * h) - r;
}

/** A capsule whose radius tapers from r1 at `a` to r2 at `b`. */
function taperedCapsule(x: number, y: number, z: number, a: V3, b: V3, r1: number, r2: number) {
  const pax = x - a[0], pay = y - a[1], paz = z - a[2];
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2];
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
  return len3(pax - bax * h, pay - bay * h, paz - baz * h) - (r1 + (r2 - r1) * h);
}

/* ---------------- the tooth ---------------- */

function molar(x: number, y: number, z: number): number {
  // Crown: a rounded block with a fuller belly than shoulders.
  let d = roundBox(x, y, z, [0, 0.36, 0], [0.29, 0.13, 0.23], 0.27);
  d = smin(d, ellipsoid(x, y, z, [0, 0.27, 0], [0.61, 0.33, 0.54]), 0.1);

  // Four cusps.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      d = smin(d, sphere(x, y, z, [sx * 0.275, 0.635, sz * 0.225], 0.2), 0.15);
    }
  }

  // The occlusal surface: a central fossa and a cross of grooves.
  d = smax(d, -sphere(x, y, z, [0, 0.95, 0], 0.3), 0.13);
  d = smax(d, -capsule(x, y, z, [-0.44, 0.83, 0], [0.44, 0.83, 0], 0.055), 0.08);
  d = smax(d, -capsule(x, y, z, [0, 0.83, -0.38], [0, 0.83, 0.38], 0.055), 0.08);


  // Two roots, splayed and unequal - symmetry is what makes models look fake.
  d = smin(d, taperedCapsule(x, y, z, [-0.26, 0.1, 0.0], [-0.36, -0.82, 0.04], 0.29, 0.1), 0.18);
  d = smin(d, taperedCapsule(x, y, z, [0.27, 0.1, 0.0], [0.33, -0.74, -0.03], 0.285, 0.105), 0.18);

  // A waist at the gum line, carved last with a ring, so crown and roots
  // read as two things rather than one swelling.
  const ring = len2(len2(x / 1.12, z) - 0.72, y - 0.0) - 0.17;
  d = smax(d, -ring, 0.12);

  return d;
}

/* ---------------- marching cubes ---------------- */

// Corner offsets and bit weights, in the order three's tables expect.
const CORNERS: [number, number, number, number][] = [
  [0, 0, 0, 1],
  [1, 0, 0, 2],
  [0, 1, 0, 8],
  [1, 1, 0, 4],
  [0, 0, 1, 16],
  [1, 0, 1, 32],
  [0, 1, 1, 128],
  [1, 1, 1, 64],
];

// Each of the 12 cube edges: the corner it starts from and the axis it runs along.
const EDGES: [number, number, number, 0 | 1 | 2][] = [
  [0, 0, 0, 0],
  [1, 0, 0, 1],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0],
  [1, 0, 1, 1],
  [0, 1, 1, 0],
  [0, 0, 1, 1],
  [0, 0, 0, 2],
  [1, 0, 0, 2],
  [1, 1, 0, 2],
  [0, 1, 0, 2],
];

/** How far the occlusion probe reaches, and how dark a fissure may get. */
const AO_REACH = [0.035, 0.09, 0.2];
const AO_FLOOR = 0.5;
/** Linear-light multiplier for the roots. */
const ROOT_TINT: V3 = [0.97, 0.88, 0.74];

export function buildMolar(step = 0.034): MolarArrays {
  const min: V3 = [-0.9, -1.06, -0.76];
  const max: V3 = [0.9, 1.0, 0.76];

  const nx = Math.ceil((max[0] - min[0]) / step) + 1;
  const ny = Math.ceil((max[1] - min[1]) / step) + 1;
  const nz = Math.ceil((max[2] - min[2]) / step) + 1;

  // Sample the field once.
  const field = new Float32Array(nx * ny * nz);
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        field[at(i, j, k)] = molar(min[0] + i * step, min[1] + j * step, min[2] + k * step);
      }
    }
  }

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const cache = new Map<number, number>();

  const e = step * 0.5;
  const pushVertex = (x: number, y: number, z: number) => {
    // Gradient of the field = outward surface normal.
    let gx = molar(x + e, y, z) - molar(x - e, y, z);
    let gy = molar(x, y + e, z) - molar(x, y - e, z);
    let gz = molar(x, y, z + e) - molar(x, y, z - e);
    const len = len3(gx, gy, gz) || 1;
    gx /= len; gy /= len; gz /= len;
    positions.push(x, y, z);
    normals.push(gx, gy, gz);

    // Ambient occlusion, read straight off the field: step out along the
    // normal and see how much open space is there. On the belly of the
    // crown the answer is "all of it"; down a fissure, very little.
    let open = 0;
    for (const d of AO_REACH) open += Math.min(1, Math.max(0, molar(x + gx * d, y + gy * d, z + gz * d) / d));
    const shade = AO_FLOOR + (1 - AO_FLOOR) * Math.pow(open / AO_REACH.length, 1.4);

    // Below the gum line enamel gives way to cementum, which is ivory.
    const t = Math.min(1, Math.max(0, (0.14 - y) / 0.42));
    const root = t * t * (3 - 2 * t);
    colors.push(
      shade * (1 + (ROOT_TINT[0] - 1) * root),
      shade * (1 + (ROOT_TINT[1] - 1) * root),
      shade * (1 + (ROOT_TINT[2] - 1) * root),
    );
    return positions.length / 3 - 1;
  };

  const edgeVertex = (i: number, j: number, k: number, edge: number) => {
    const [ox, oy, oz, axis] = EDGES[edge];
    const ai = i + ox, aj = j + oy, ak = k + oz;
    const key = at(ai, aj, ak) * 3 + axis;
    const hit = cache.get(key);
    if (hit !== undefined) return hit;

    const bi = ai + (axis === 0 ? 1 : 0);
    const bj = aj + (axis === 1 ? 1 : 0);
    const bk = ak + (axis === 2 ? 1 : 0);
    const fa = field[at(ai, aj, ak)];
    const fb = field[at(bi, bj, bk)];
    const t = fa / (fa - fb);

    const index = pushVertex(
      min[0] + (ai + (bi - ai) * t) * step,
      min[1] + (aj + (bj - aj) * t) * step,
      min[2] + (ak + (bk - ak) * t) * step,
    );
    cache.set(key, index);
    return index;
  };

  for (let k = 0; k < nz - 1; k++) {
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        let cube = 0;
        for (const [ox, oy, oz, bit] of CORNERS) {
          // Bits mark corners OUTSIDE the surface (field > 0).
          if (field[at(i + ox, j + oy, k + oz)] > 0) cube |= bit;
        }
        if (EDGE_TABLE[cube] === 0) continue;

        const row = cube << 4;
        for (let t = 0; TRI_TABLE[row + t] !== -1; t += 3) {
          indices.push(
            edgeVertex(i, j, k, TRI_TABLE[row + t]),
            edgeVertex(i, j, k, TRI_TABLE[row + t + 1]),
            edgeVertex(i, j, k, TRI_TABLE[row + t + 2]),
          );
        }
      }
    }
  }

  // Make sure triangle winding agrees with the gradient normals; flip all
  // of it once if the tables disagree, rather than trusting a convention.
  if (indices.length >= 3) {
    const [a, b, c] = [indices[0] * 3, indices[1] * 3, indices[2] * 3];
    const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2];
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx;
    if (fx * normals[a] + fy * normals[a + 1] + fz * normals[a + 2] < 0) {
      for (let t = 0; t < indices.length; t += 3) {
        const tmp = indices[t + 1];
        indices[t + 1] = indices[t + 2];
        indices[t + 2] = tmp;
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    indices: new Uint32Array(indices),
  };
}
