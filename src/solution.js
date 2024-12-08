import NodeRSA from "node-rsa";
import cryptoJS from "crypto-js";
import crypto from "crypto";
import forge from "node-forge";

const N8N_ENCRYPTION_KEY = "some-secret-n8n-encryption-key";
const generateInstanceId = crypto
  .createHash("sha256")
  .update(N8N_ENCRYPTION_KEY.slice(Math.round(N8N_ENCRYPTION_KEY.length / 2)))
  .digest("hex");

// License data
const licenseData = {
  consumerId: "x-x-x-x-x",
  version: 2,
  tenantId: 1,
  renewalToken: "renewal-token",
  deviceLock: true,
  deviceFingerprint: generateInstanceId,
  createdAt: "2024-11-13T12:27:28.848Z",
  issuedAt: "2024-12-07T09:05:01.863Z",
  expiresAt: "2099-12-17T09:05:01.820Z",
  terminatesAt: "2099-11-07T12:27:28.848Z",
  entitlements: [
    {
      id: "x-x-x-x-x",
      productId: "x-x-x-x-x",
      productMetadata: {},
      features: {
        planName: "Enterprise",
        "quota:maxTeamProjects": -1,

        "feat:sharing": true,
        "feat:ldap": true,
        "feat:saml": true,
        "feat:logStreaming": true,
        "feat:advancedExecutionFilters": true,
        "feat:variables": true,

        "feat:externalSecrets": true,
        "feat:showNonProdBanner": false,
        "feat:workflowHistory": true,
        "feat:debugInEditor": true,
        "feat:binaryDataS3": true,
        "feat:multipleMainInstances": true,

        "feat:workerView": true,
        "feat:advancedPermissions": true,
        "feat:projectRole:admin": true,
        "feat:projectRole:editor": true,
        "feat:projectRole:viewer": true,
        "feat:aiAssistant": true,
        "feat:askAi": true,
        "feat:communityNodes:customRegistry": true,
      },
      featureOverrides: {},
      validFrom: "2024-11-13T12:27:28.848Z",
      validTo: "2099-11-10T12:27:28.848Z",
      isFloatable: false,
    },
  ],
  managementJwt: "management-id-x-x-x-x-x",
  isEphemeral: false,
};

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
  const encryptedSymmetricKey = rsaPublicKey.encryptPrivate(
    symmetricKey,
    "base64"
  );

  // Sign the encrypted data
  const signer = crypto.createSign("SHA256");
  signer.update(JSON.stringify(licenseData));
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
  signt = matched.groups.signature,
  a,
  o;

// step 7

a = thisKey.decryptPublic(matchedEncryptedSymmetricKey, "utf8");
o = cryptoJS.AES.decrypt(i, a).toString(cryptoJS.enc.Utf8);
// this is the point where the License data is decrypted
// console.log("yyyyyy: ", o);

/**
 * Everything above this line is working fine
 */

// Step 8
// this.key.verify(Buffer.from(o), s, "utf8", "base64")
const ccccc = thisKey.verify(Buffer.from(o), signt, "utf8", "base64");
// console.log("ccccc: ", ccccc);

// step 9
// const dddddd = JSON.parse(o);

// console.log("ddddd: ", dddddd);

console.log(licenseCert);
console.log("xxxxx  ", generateInstanceId);
