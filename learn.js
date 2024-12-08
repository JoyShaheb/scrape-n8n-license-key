import NodeRSA from "node-rsa";
import cryptoJS from "crypto-js";
import crypto from "crypto";
// import nodeMachineId from "node-machine-id";
// import nodeRSA from "node-rsa";
// import undici from "undici";

// License data
const licenseData = {
  user: "John Doe",
  expirationDate: "2028-12-31",
  features: ["feature1", "feature2"],
};
// Generate keys
const key = new NodeRSA({ b: 2048 });

// Create license certificate
function createLicenseCertificate(data) {
  const stringData = JSON.stringify(data);
  const signature = key.sign(stringData, "base64");

  // Create an object with x509 and licenseKey
  const certificate = {
    x509: key.exportKey("pkcs8-public-pem"), // Export public key as x509
    licenseKey: Buffer.from(
      JSON.stringify({
        data: stringData,
        signature: signature,
      })
    ).toString("base64"), // Encode the license data and signature
  };

  // Convert the entire certificate to a base64 string
  return Buffer.from(JSON.stringify(certificate)).toString("base64");
}

// Verify license certificate
function verifyLicenseCertificate(certificateString) {
  const certificate = JSON.parse(
    Buffer.from(certificateString, "base64").toString("ascii")
  );
  const { data, signature } = JSON.parse(
    Buffer.from(certificate.licenseKey, "base64").toString("ascii")
  );
  return key.verify(data, signature, "utf8", "base64");
}

// Usage
const certificate = createLicenseCertificate(licenseData);
console.log("Certificate:", certificate);

const isValid = verifyLicenseCertificate(certificate);
console.log("Is valid:", isValid);

// Parsing the certificate
const { x509, licenseKey } = JSON.parse(
  Buffer.from(certificate, "base64").toString("ascii")
);

let x509Cert = new crypto.X509Certificate(x509);
console.log("x509Cert:", x509Cert);
