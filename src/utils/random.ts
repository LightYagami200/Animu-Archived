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

export default mulberry32;
// =====================!SECTION
