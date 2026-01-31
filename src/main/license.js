import fs from 'fs'
import base32Decode from 'base32-decode'
import { verify } from 'node:crypto'
// import { createVerify, generateKeyPairSync, verify } from 'node:crypto'

// const { publicKey, privateKey } = generateKeyPairSync('ed25519')

// fs.writeFileSync('license_private.key', privateKey.export({ type: 'pkcs8', format: 'pem' }))

// fs.writeFileSync('license_public.key', publicKey.export({ type: 'spki', format: 'pem' }))

// console.log('Keys generated')

const PUBLIC_KEY = fs.readFileSync('./license_public.key')

export function verifyLicense(licenseKey) {
  try {
    const normalized = licenseKey.replace(/-/g, '').toUpperCase()

    const data = Buffer.from(base32Decode(normalized, 'Crockford'))

    const payloadLength = data.readUInt16BE(0)
    const payloadStart = 2
    const payloadEnd = payloadStart + payloadLength

    // ✅ Use subarray instead of slice
    const payloadBuffer = data.subarray(payloadStart, payloadEnd)
    const signature = data.subarray(payloadEnd)

    const valid = verify(null, payloadBuffer, PUBLIC_KEY, signature)

    if (!valid) {
      return { valid: false, reason: 'INVALID_SIGNATURE' }
    }

    const payload = JSON.parse(payloadBuffer.toString('utf8'))

    // ---- Custom checks ----
    if (payload.app !== 'com.rxlabel.desktop') {
      return { valid: false, reason: 'WRONG_APP' }
    }

    if (payload.exp) {
      console.log(payload.exp)
      console.log(Date.now())
      const expiry = new Date(payload.exp)
      if (Date.now() / 1000 > expiry.getTime()) {
        return { valid: false, reason: 'EXPIRED' }
      }
    }

    return { valid: true, payload }
  } catch (err) {
    console.error('License verification error:', err)
    return { valid: false, reason: 'MALFORMED_KEY' }
  }
}
