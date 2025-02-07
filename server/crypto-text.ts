import crypto from 'crypto';

// ENCRYPTION_KEY is a string of 32 0-255 ("byte") value comma separated
// decimal (not hex) numbers in the format ENCRYPTION_KEY=1,2,3,4,5,6,7,8,9,
// 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32
// but random such as generated from crypto.randomBytes(32);
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
