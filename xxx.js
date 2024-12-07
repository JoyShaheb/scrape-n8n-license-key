import crypto from "crypto";
import fs from "fs";
import forge from "node-forge";
import NodeRSA from "node-rsa";

// Generate RSA key pair
const key = new NodeRSA({ b: 2048 });
const publicKey = key.exportKey("public");
const privateKey = key.exportKey("private");

// Create license data
const licenseData = {
  id: "12345",
  consumerId: "your-consumer-id",
  tenantId: "your-tenant-id",
  productIdentifier: "your-product-identifier",
  createdAt: new Date().toISOString(),
  issuedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  terminatesAt: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
  entitlements: [
    {
      id: "entitlement-id",
      productId: "product-id",
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      features: {
        premium: true,
      },
      featureOverrides: {},
    },
  ],
  isEphemeral: false,
  deviceFingerprint: "your-device-fingerprint",
  deviceLock: true,
  renewalToken: "your-renewal-token",
  managementJwt: "your-management-jwt",
};

// Convert license data to JSON
const licenseJson = JSON.stringify(licenseData);

// Generate a 16-byte (128-bit) symmetric key
const symmetricKey = crypto.randomBytes(16);

// Encrypt the symmetric key with the public key
const rsaPublic = new NodeRSA();
rsaPublic.importKey(publicKey, "public");
// const encryptedSymmetricKey = rsaPublic.encrypt(symmetricKey, "base64");
const encryptedSymmetricKey =
  "nm8s75CYKxRXNEzrhwvZ7BpsZOoCWOP6SQSB70fqKUspN2fAdjTA+RrLkaP6vOPx5UYCfLplUFD0E3F2r3SJ9FUux2Tn1NRGyO5CxHx+6cluX9dld6R28fCaGrWKMnW4Ly3PwKcvLENb2yOcBy13UEn5+3HOJPZjaRLAEd0FqiAI44DhJnCJy/2MJskXK/D7YrMpc+119/IDYwBEubvjmPGCR0fEPrH3PbZ7G8TIc28aL3tl2MrJhmO1KeXAIcZsGqGP3cpDcMtjB4S2tK6faY/JHOFyv9iFLtjToqT0L8HYUSeX7dmGMMHya7zO5yRbG0Mq+tJUP08INGbHufaseA==||";

// Encrypt the license data with the symmetric key using AES-128-CBC
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv("aes-128-cbc", symmetricKey, iv);
let encryptedData = cipher.update(licenseJson, "utf8", "base64");
encryptedData += cipher.final("base64");

// Combine IV and encrypted data
const ivAndEncryptedData = iv.toString("base64") + encryptedData;

// Sign the license data
const sign = crypto.createSign("SHA256");
sign.update(licenseJson);
const signature = sign.sign(privateKey, "base64");

// Combine all parts into the license key format
const licenseKey =
  "-----BEGIN LICENSE KEY-----" +
  `${encryptedSymmetricKey}||` +
  `${ivAndEncryptedData}||` +
  `${signature}` +
  "-----END LICENSE KEY-----";

console.log("License Key:");
console.log(licenseKey);

// Generate licenseCert
function generateLicenseCert(publicKey, privateKey, licenseKey) {
  // Create a self-signed X.509 certificate
  const cert = forge.pki.createCertificate();
  cert.publicKey = forge.pki.publicKeyFromPem(publicKey);
  cert.serialNumber = "01" + crypto.randomBytes(19).toString("hex");
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  const attrs = [
    {
      name: "countryName",
      value: "DE",
    },
    {
      shortName: "ST",
      value: "Berlin",
    },
    {
      name: "localityName",
      value: "Berlin",
    },
    {
      name: "commonName",
      value: "license.n8n.io",
    },
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  // Sign the certificate with the private key
  cert.sign(forge.pki.privateKeyFromPem(privateKey), forge.md.sha256.create());

  // Convert the certificate to PEM format
  const pemCert = forge.pki.certificateToPem(cert);

  // Create the license cert container
  const licenseCertContainer = {
    x509: pemCert,
    licenseKey: licenseKey,
  };

  // Encode the container as base64
  const licenseCertStr = Buffer.from(
    JSON.stringify(licenseCertContainer)
  ).toString("base64");

  return licenseCertStr;
}

const licenseCert = generateLicenseCert(publicKey, privateKey, licenseKey);
console.log("\nLicense Cert:");
console.log(licenseCert);

// Print the public key for verification
console.log("\nPublic Key:");
console.log(publicKey);

// Save the private key to a file (keep this secure!)
fs.writeFileSync("private_key.pem", privateKey);
console.log("\nPrivate key saved to private_key.pem");
