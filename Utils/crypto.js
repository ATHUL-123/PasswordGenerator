import crypto from 'crypto';
import { configDotenv } from 'dotenv';
configDotenv()

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');

// Function to encrypt the password
export const encryptPassword = (password) => {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
};

// Function to decrypt the password
export const decryptPassword = (encryptedData, iv) => {
    try {
      const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error("Decryption Error:", error);
      // Handle decryption error (e.g., return null or throw a specific error)
    }
  };