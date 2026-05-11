import crypto from 'node:crypto'
import zlib from 'node:zlib'

const SAVE_PASSWORD = "Why would you want to cheat?... :o It's no fun. :') :'D"

function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100, 16, 'sha1')
}

export function decryptSave(fileBuffer: Buffer): object {
  const iv = fileBuffer.subarray(0, 16)
  const encrypted = fileBuffer.subarray(16)
  const key = deriveKey(SAVE_PASSWORD, iv)
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  let decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  if (decrypted[0] === 0x1f && decrypted[1] === 0x8b) {
    decrypted = zlib.gunzipSync(decrypted)
  }
  return JSON.parse(decrypted.toString('utf-8'))
}

export function encryptSave(jsonData: object): Buffer {
  const payload = Buffer.from(JSON.stringify(jsonData, null, 4), 'utf-8')
  const iv = crypto.randomBytes(16)
  const key = deriveKey(SAVE_PASSWORD, iv)
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  const encrypted = Buffer.concat([cipher.update(payload), cipher.final()])
  return Buffer.concat([iv, encrypted])
}
