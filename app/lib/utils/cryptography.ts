import crypto from 'crypto';

const securityKey = crypto.randomBytes(32);
const algorithm: string = 'aes-256-cbc';
const initVector = crypto.randomBytes(16);

const createHash = (value: any): string => {
  if (value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
  return value;
};

const encrypt = (value: any): string => {
  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
  return cipher.update(value, 'utf-8', 'hex') + cipher.final('hex');
};

const decrypt = (value: string): string => {
  const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);
  return decipher.update(value, 'hex', 'utf-8') + decipher.final('utf-8');
};

export { createHash, encrypt, decrypt };
