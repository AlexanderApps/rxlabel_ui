import base32Decode from 'base32-decode'
import { verify } from 'node:crypto'
import log from './logger'
// import { createVerify, generateKeyPairSync, verify } from 'node:crypto'

// const { publicKey, privateKey } = generateKeyPairSync('ed25519')

// fs.writeFileSync('license_private.key', privateKey.export({ type: 'pkcs8', format: 'pem' }))

// fs.writeFileSync('license_public.key', publicKey.export({ type: 'spki', format: 'pem' }))

// console.log('Keys generated')

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAVFDUs8INt5zWgVb5BHCjGTJ1dzd0T1UWwpqACTgZ2OM=
-----END PUBLIC KEY-----`

// try {
//   PUBLIC_KEY = fs.readFileSync('./license_public.key')
//   log.info('License public key loaded successfully')
// } catch (err) {
//   log.error('Failed to load license public key', {
//     error: err.message,
//     path: './license_public.key'
//   })
//   throw err
// }

export function verifyLicense(licenseKey) {
  log.debug('License verification initiated')

  try {
    const normalized = licenseKey.replace(/-/g, '').toUpperCase()
    log.debug('License key normalized')

    const data = Buffer.from(base32Decode(normalized, 'Crockford'))

    const payloadLength = data.readUInt16BE(0)
    const payloadStart = 2
    const payloadEnd = payloadStart + payloadLength

    // ✅ Use subarray instead of slice
    const payloadBuffer = data.subarray(payloadStart, payloadEnd)
    const signature = data.subarray(payloadEnd)

    log.debug('License payload extracted', {
      payloadLength,
      signatureLength: signature.length
    })

    const valid = verify(null, payloadBuffer, PUBLIC_KEY, signature)

    if (!valid) {
      log.warn('License verification failed - invalid signature')
      return { valid: false, reason: 'INVALID_SIGNATURE' }
    }

    log.debug('License signature verified successfully')

    const payload = JSON.parse(payloadBuffer.toString('utf8'))

    // ---- Custom checks ----
    if (payload.app !== 'com.rxlabel.desktop') {
      log.warn('License verification failed - wrong application', {
        expected: 'com.rxlabel.desktop',
        received: payload.app
      })
      return { valid: false, reason: 'WRONG_APP' }
    }

    if (payload.exp) {
      const expiry = new Date(payload.exp)
      const now = Date.now() / 1000

      log.debug('Checking license expiration', {
        expiryDate: expiry.toISOString(),
        expiryTimestamp: expiry.getTime(),
        currentTimestamp: now
      })

      if (now > expiry.getTime()) {
        log.warn('License verification failed - license expired', {
          expiryDate: expiry.toISOString()
        })
        return { valid: false, reason: 'EXPIRED' }
      }
    }

    log.info('License verification successful', {
      app: payload.app,
      hasExpiry: !!payload.exp,
      // Log non-sensitive metadata only
      ...(payload.type && { type: payload.type }),
      ...(payload.plan && { plan: payload.plan })
    })

    return { valid: true, payload }
  } catch (err) {
    log.error('License verification error', {
      error: err.message,
      errorType: err.constructor.name
      // DO NOT log the actual license key
    })
    return { valid: false, reason: 'MALFORMED_KEY' }
  }
}
