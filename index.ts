import { LicenseManager } from "@n8n_io/license-sdk";
import pino from "pino";
import forge from "node-forge";

// bring your own logger, e.g. Pino, Winston etc.
const myLogger = pino();

// Generate a self-signed certificate
function generateSelfSignedCert() {
  const keys = forge.pki.rsa.generateKeyPair(2048);
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  const attrs = [
    {
      name: "commonName",
      value: "license.n8n.io",
    },
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
      name: "organizationName",
      value: "n8n",
    },
    {
      shortName: "OU",
      value: "n8n",
    },
  ];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(keys.privateKey);

  const pem = forge.pki.certificateToPem(cert);
  const fingerprint = forge.md.sha1
    .create()
    .update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes())
    .digest()
    .toHex();

  return { cert: pem, fingerprint: fingerprint };
}

const pems = generateSelfSignedCert();
console.log(pems);

console.log("sdhjc xxx");

const license = new LicenseManager({
  tenantId: 1,
  productIdentifier: "Demo Product v1.2.3", // must regex-match cert.productIdentifierPattern
  autoRenewEnabled: true,
  renewOnInit: false,
  autoRenewOffset: 60 * 60 * 48, // = 48 hours
  logger: myLogger,
  loadCertStr: async () => {
    // code that returns a stored cert string from DB
    return pems.cert;
  },
  saveCertStr: async (cert: string) => {
    // code that persists a cert string into the DB
    // ...
  },
  deviceFingerprint: () => pems.fingerprint,
  onFeatureChange: () =>
    console.log("availability of some features has just changed"), //optional
});

// important! Attempts to load and initialize the cert:
license.initialize();
