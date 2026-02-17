import { hash, verify, Algorithm } from '@node-rs/argon2'
import log from './logger'

// 1. Password Hashing (Equivalent to 'Encrypt')
// Use this when the user sets or changes their master password.
async function hashMasterPassword(password) {
  log.debug('Password hashing initiated')
  try {
    // 2026 Recommended Security Parameters:
    // memoryCost: 65536 (64MB), timeCost: 3 (iterations), parallelism: 4 (threads)
    const passwordHash = await hash(password, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      algorithm: Algorithm.Argon2id // Hybrid variant resistant to GPU & side-channel attacks
    })

    log.info('Password hash generated successfully')
    return passwordHash // Store this string in your local database
  } catch (err) {
    log.error('Password hashing failed', {
      error: err.message
      // DO NOT log the password itself or the hash
    })
    throw err
  }
}

// 2. Password Verification (Equivalent to 'Decrypt')
// Use this when the user attempts to unlock their vault.
async function verifyMasterPassword(storedHash, plainPassword) {
  log.debug('Password verification initiated')
  try {
    // The library automatically extracts parameters/salt from the storedHash string
    const isValid = await verify(storedHash, plainPassword)

    if (isValid) {
      log.info('Password verification successful')
    } else {
      log.warn('Password verification failed - invalid credentials')
    }

    return isValid // Returns true if matched, false otherwise
  } catch (err) {
    log.error('Password verification error', {
      error: err.message
      // DO NOT log passwords or hashes
    })
    return false
  }
}

export { hashMasterPassword, verifyMasterPassword }
