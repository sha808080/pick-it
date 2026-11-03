/**
 * Cryptographically secure random integer in range [0, max - 1]
 * Uses Web Crypto API rejection sampling to avoid modulo bias.
 */
export function getSecureRandomInt(max) {
  if (max <= 1) return 0
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % max)
  const buffer = new Uint32Array(1)

  let randomVal
  do {
    crypto.getRandomValues(buffer)
    randomVal = buffer[0]
  } while (randomVal >= limit)

  return randomVal % max
}

/**
 * Single-pass Fisher-Yates (Knuth) shuffle using cryptographic randomness.
 * Guarantees uniform O(n) unbiased distribution.
 */
export function cryptoShuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Guaranteed shuffle that ensures cards visibly swap positions.
 * For length >= 2, guarantees that the new permutation is NOT identical
 * to the previous one, and maximizes moved cards (aims for derangement).
 */
export function guaranteedShuffle(array) {
  if (!array || array.length <= 1) return [...(array || [])]

  // Try up to 20 times to get a derangement (where EVERY element moves to a new slot)
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = cryptoShuffle(array)
    const allMoved = candidate.every((item, idx) => item.id !== array[idx].id)
    if (allMoved) {
      return candidate
    }
  }

  // Fallback 1: Ensure at least some elements moved if complete derangement didn't hit
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = cryptoShuffle(array)
    const isDifferent = candidate.some((item, idx) => item.id !== array[idx].id)
    if (isDifferent) {
      return candidate
    }
  }

  // Fallback 2: Guaranteed cyclic rotation by at least 1 position
  const shift = 1 + getSecureRandomInt(array.length - 1)
  return array.map((_, i) => array[(i + shift) % array.length])
}

/**
 * Generate a unique ID for each chit
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'chit_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)
}
