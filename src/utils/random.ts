// =====================
// SECTION | RANDOM
// =====================
/**
 * Generate a random number based on seed using Mulberry32 algorithm
 *
 * @param seed - Seed to use for random number generation
 */
function mulberry32(seed: number) {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Generate a random number based on seed using splitmix32 algorithm
 *
 * @param seed - Seed to use for random number generation
 */
function splitmix32(seed: number) {
  seed |= 0;
  seed = (seed + 0x9e3779b9) | 0;
  let t = seed ^ (seed >>> 15);
  t = Math.imul(t, 0x85ebca6b);
  t = t ^ (t >>> 13);
  t = Math.imul(t, 0xc2b2ae35);
  return ((t = t ^ (t >>> 16)) >>> 0) / 4294967296;
}

export { mulberry32, splitmix32 };
// =====================!SECTION
