import { hash, verify, Algorithm } from '@node-rs/argon2'

// 1. Password Hashing (Equivalent to 'Encrypt')
// Use this when the user sets or changes their master password.
async function hashMasterPassword(password) {
  try {
    // 2026 Recommended Security Parameters:
    // memoryCost: 65536 (64MB), timeCost: 3 (iterations), parallelism: 4 (threads)
    const passwordHash = await hash(password, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      algorithm: Algorithm.Argon2id // Hybrid variant resistant to GPU & side-channel attacks
    })

    return passwordHash // Store this string in your local database
  } catch (err) {
    console.error('Hashing failed:', err)
    throw err
  }
}

// 2. Password Verification (Equivalent to 'Decrypt')
// Use this when the user attempts to unlock their vault.
async function verifyMasterPassword(storedHash, plainPassword) {
  try {
    // The library automatically extracts parameters/salt from the storedHash string
    const isValid = await verify(storedHash, plainPassword)
    return isValid // Returns true if matched, false otherwise
  } catch (err) {
    console.error('Verification failed:', err)
    return false
  }
}

export { hashMasterPassword, verifyMasterPassword }
