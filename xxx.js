import crypto from "crypto";
import fs from "fs";

// Generate RSA key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// Create license data
const licenseData = {
  id: "12345",
  createdAt: new Date().toISOString(),
  issuedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  terminatesAt: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
  entitlements: [
    {
      feature: "premium",
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// Convert license data to JSON
const licenseJson = JSON.stringify(licenseData);

// Generate a random symmetric key
const symmetricKey = crypto.randomBytes(32);

// Encrypt the symmetric key with the public RSA key
const encryptedSymmetricKey = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  symmetricKey
);

// Encrypt the license data with the symmetric key
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv("aes-256-cbc", symmetricKey, iv);
let encryptedData = cipher.update(licenseJson, "utf8", "base64");
encryptedData += cipher.final("base64");

// Sign the license data
const sign = crypto.createSign("SHA256");
sign.update(licenseJson);
const signature = sign.sign(privateKey, "base64");

// Combine all parts into the license key format
const licenseKey =
  "-----BEGIN LICENSE KEY-----" +
  `${encryptedSymmetricKey.toString("base64")}||` +
  `${iv.toString("base64")}${encryptedData}||` +
  `${signature}` +
  "-----END LICENSE KEY-----";

console.log(licenseKey);

// Also print the public key for verification
console.log("\nPublic Key:");
console.log(publicKey);

// Optionally, save the private key to a file (keep this secure!)
fs.writeFileSync("private_key.pem", privateKey);
console.log("\nPrivate key saved to private_key.pem");
