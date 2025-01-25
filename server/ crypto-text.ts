import crypto from 'crypto';

// ENCRYPTION_KEY is a string of 32 0-255 ("byte") value comma separated decimal numbers
const encKey = process.env.ENCRYPTION_KEY;
if (!encKey) throw new Error('ENCRYPTION_KEY not found in .env');
//
const encKeyBuffer = Buffer.from(encKey.split(',').map(Number));
const ivLength = 16;

export function encryptText(text: string): string {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv('aes-256-cbc', encKeyBuffer, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptText(encryptedText: string): string {
  const [ivHex, encryptedData] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', encKeyBuffer, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
