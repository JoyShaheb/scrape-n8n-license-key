import crypto from "crypto";
import fs from "fs";
import forge from "node-forge";

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
      name: "commonName",
      value: "YourCompany License Authority",
    },
    {
      name: "countryName",
      value: "US",
    },
    {
      shortName: "ST",
      value: "California",
    },
    {
      name: "localityName",
      value: "San Francisco",
    },
    {
      name: "organizationName",
      value: "YourCompany",
    },
    {
      shortName: "OU",
      value: "License Department",
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
