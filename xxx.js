import crypto from "crypto";
import fs from "fs";

function generateKeyFiles() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
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

  fs.writeFileSync("public_key.pem", keyPair.publicKey);
  fs.writeFileSync("private_key.pem", keyPair.privateKey);
}

function encryptString(plaintext, publicKeyFile) {
  const publicKey = fs.readFileSync(publicKeyFile, "utf8");
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(plaintext)
  );
  return encrypted.toString("base64");
}

function decryptString(encryptedText, privateKeyFile) {
  const privateKey = fs.readFileSync(privateKeyFile, "utf8");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(encryptedText, "base64")
  );
  return decrypted.toString("utf8");
}

// Generate keys
generateKeyFiles();

// Defining a text to be encrypted
const plainText = JSON.stringify({
  sjdc: "sssss",
});

// Encrypting the text
const encrypted = encryptString(plainText, "./public_key.pem");

console.log("Plaintext:", plainText);
console.log("Encrypted: ", encrypted);

// Decrypting the text
const decrypted = decryptString(encrypted, "./private_key.pem");

console.log("Decrypted:", decrypted);
