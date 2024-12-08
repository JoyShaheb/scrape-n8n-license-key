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

  return pki.certificateToPem(cert);
}

// Generate license key
function generateLicenseKey(licenseData) {
  const dataString = JSON.stringify(licenseData);
  const hash = crypto.createHash("sha256").update(dataString).digest("hex");
  return hash.substr(0, 20).toUpperCase();
}

// Create license certificate and key
const x509 = createX509Certificate(licenseData);
const licenseKey = generateLicenseKey(licenseData);

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

const { x509: t, licenseKey: n } = JSON.parse(
  Buffer.from(licenseCert, "base64").toString("ascii")
);

console.log(t, n);
