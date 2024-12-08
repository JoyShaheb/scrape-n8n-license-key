import NodeRSA from "node-rsa";
import cryptoJS from "crypto-js";
import crypto from "crypto";
import forge from "node-forge";

// License data
const licenseData = {
  user: "John Doe",
  expirationDate: "2028-12-31",
  features: ["feature1", "feature2"],
};

// Generate RSA key pair
const key = new NodeRSA({ b: 2048 });

// Create X.509 certificate
function createX509Certificate(licenseData) {
  const pki = forge.pki;
  const keys = pki.rsa.generateKeyPair(2048);
  const cert = pki.createCertificate();

  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date(licenseData.expirationDate);

  const attrs = [
    {
      name: "commonName",
      value: licenseData.user,
    },
    {
      name: "countryName",
      value: "US",
    },
    {
      shortName: "ST",
      value: "Virginia",
    },
    {
      name: "localityName",
      value: "Blacksburg",
    },
    {
      name: "organizationName",
      value: "Test",
    },
    {
      shortName: "OU",
      value: "Test",
    },
  ];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.setExtensions([
    {
      name: "basicConstraints",
      cA: true,
    },
    {
      name: "keyUsage",
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: "subjectAltName",
      altNames: [
        {
          type: 6, // URI
          value: "http://example.org/webid#me",
        },
      ],
    },
  ]);

  // Self-sign the certificate
  cert.sign(keys.privateKey);

  return {
    cert: pki.certificateToPem(cert),
    privateKey: pki.privateKeyToPem(keys.privateKey),
  };
}

// Generate license key
function generateLicenseKey(licenseData, privateKey) {
  // Generate a symmetric key
  const symmetricKey = crypto.randomBytes(32).toString("hex");

  // Encrypt the license data with the symmetric key
  const encryptedData = cryptoJS.AES.encrypt(
    JSON.stringify(licenseData),
    symmetricKey
  ).toString();

  // Encrypt the symmetric key with the public key
  const rsaPublicKey = new NodeRSA(privateKey);
  const encryptedSymmetricKey = rsaPublicKey.encrypt(symmetricKey, "base64");

  // Sign the encrypted data
  const signer = crypto.createSign("SHA256");
  signer.update(encryptedData);
  const signature = signer.sign(privateKey, "base64");

  // Construct the license key
  const licenseKey = `-----BEGIN LICENSE KEY-----${encryptedSymmetricKey}||${encryptedData}||${signature}-----END LICENSE KEY-----`;

  return licenseKey;
}

// Create license certificate and key
const { cert: x509, privateKey } = createX509Certificate(licenseData);
const licenseKey = generateLicenseKey(licenseData, privateKey);

// Create the final licenseCert structure
const licenseCertObj = {
  x509: x509,
  licenseKey: licenseKey,
};

// Convert to JSON and then to base64
const licenseCert = Buffer.from(JSON.stringify(licenseCertObj)).toString(
  "base64"
);

// decryption mechanism
// step 1
const { x509: t, licenseKey: n } = JSON.parse(
  Buffer.from(licenseCert, "base64").toString("ascii")
);

// step 2
let x509Cert = new crypto.X509Certificate(t);

// step 3
let s = x509Cert.publicKey.export({
  format: "pem",
  type: "pkcs1",
});

// Step 4

let thisKey = new NodeRSA(s);

// Step 5

let e = n.replace(/(\r\n|\n|\r)/gm, "");
let matched = e.match(
  /^-----BEGIN LICENSE KEY-----(?<encryptedSymmetricKey>.+\|\|)(?<encryptedData>.+)\|\|(?<signature>.+)-----END LICENSE KEY-----$/
);

// step 6

let matchedEncryptedSymmetricKey = matched.groups.encryptedSymmetricKey,
  i = matched.groups.encryptedData,
  sss = matched.groups.signature,
  a,
  o;

// step 7

a = thisKey.decryptPublic(n, "utf8");
console.log(a);
