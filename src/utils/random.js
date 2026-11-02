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
 * Generate a unique ID for each chit
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'chit_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)
}

