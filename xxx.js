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
const encryptedSymmetricKey = rsaPublic.encrypt(symmetricKey, "base64");

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
  encryptedSymmetricKey +
  "||" +
  ivAndEncryptedData +
  "||" +
  signature +
  "-----END LICENSE KEY-----";

// console.log("License Key:");
// console.log(licenseKey);

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
// console.log("\nLicense Cert:");
// console.log(licenseCert);

// Print the public key for verification
// console.log("\nPublic Key:");
// console.log(publicKey);

// Save the private key to a file (keep this secure!)
fs.writeFileSync("private_key.pem", privateKey);
// console.log("\nPrivate key saved to private_key.pem");

/**
 * ! Step 1: Decrypt the keys
 * TODO: This is Perfect
 */

const correctLicenseCert =
  "eyJsaWNlbnNlS2V5IjoiLS0tLS1CRUdJTiBMSUNFTlNFIEtFWS0tLS0tXG5ubThzNzVDWUt4UlhORXpyaHd2WjdCcHNaT29DV09QNlNRU0I3MGZxS1VzcE4yZkFkalRBK1JyTGthUDZ2T1B4XG41VVlDZkxwbFVGRDBFM0YycjNTSjlGVXV4MlRuMU5SR3lPNUN4SHgrNmNsdVg5ZGxkNlIyOGZDYUdyV0tNblc0XG5MeTNQd0tjdkxFTmIyeU9jQnkxM1VFbjUrM0hPSlBaamFSTEFFZDBGcWlBSTQ0RGhKbkNKeS8yTUpza1hLL0Q3XG5Zck1wYysxMTkvSURZd0JFdWJ2am1QR0NSMGZFUHJIM1BiWjdHOFRJYzI4YUwzdGwyTXJKaG1PMUtlWEFJY1pzXG5HcUdQM2NwRGNNdGpCNFMydEs2ZmFZL0pIT0Z5djlpRkx0alRvcVQwTDhIWVVTZVg3ZG1HTU1IeWE3ek81eVJiXG5HME1xK3RKVVAwOElOR2JIdWZhc2VBPT18fFUyRnNkR1ZrWDE5UEVlRTNxb1NIK205VTlKWUFId1Y5MHdoT21EXG5iNFVaSEp6NEEzazZpYTJiWVB6YnlTbHlVV2RsU1h2Snp1QTN6UDJiNGZnWGlYTE5pZXUydlNaMExNYnF0bytxXG43M0J5RUNST1R6L2w0NFVlK21rR3pXOFFoaS9VSWlQTkVzc0pRZ0h4eTFmci9UU3FVV1ZDT1BxVU1hTmlQQzlOXG5oNkZOaGdUZkx1ZS8wSzJ5OXljNmN2N25oS1lOK3pXRjFBUnJIMUVHaDVDeEhiNDdEZ1RLdnhhcjFNY05ETVc2XG54T0VrVVQvUUt3b3QxSnZBc29WWU9UUDU5L3gzaW9YaDlYZ3g1eUkvbzc2WlZCYkdwcjRBVEFjK3FaS1M4bWZWXG5KVkQ1RmNXZ1hFY0E4clpsaURwallmSzl0YVJvV28ycUxUWE1QRXZ2MGg1Nkp6aHdzNGZZR2ZGN3Q3M0lpTW1IXG5GK3FiQmpudW5xUE9VZFZ4ZWpVRGRQc0MzR29yRlE1bmtRbDVJSEx1RmNOdTZEcnhvYllteGRIVmp0cE9rc20yXG5NSlNRT0RORGFJTUdzMnRRVHROZDdNVzNEb2VaaFNtUTBRWFc1UWVORkV2c1VwbnV4QnAvMDRxc2ROellNN0l1XG54SGMyT25laVd1ZTJST25kc3B5UWVzZ085aE8wWDZMN201YWtrYTgyenlpWXFPZytJNDF1aTRSQlMxN3phWTA1XG5nUS9xTWFMZnBtUGFKRTVpNFl4Mmh4VnYyUzhKREhTZjlLaGtuVkxEQ2ZPb21mR3NMbGV5Y1NmdE9nSHBHdkd5XG5PS3VyV20rZHBmYnFzaUxuS1liVjNSVzFtcHBzeUtybS92c3dpQTZadDQ0WUdEYXdKeUIzWGF3SDdyK2UxNkV6XG5ZKzJwWkN1eHFmR2djWitxTldmZHRSdmxQNmlOUXJoaXdueHpva0d0OEsvMUhEcldTV0ljVGNCblpST2tjR3AxXG5rbjRkeEJZeVUzVDRnM012eGhGTXQwb0RxaFppMmtYTjlTdk5pN0NsN3d5cjZpcHNFeWdxdlpEUjBnaW1KZ3lkXG50L0t0MVpJWFFrVGdBRGFkbjBLS1kwNmtFVmEwSFVRRUlIV3FuVi9rV1RiNnExMUdQZmF6dmRhemNHOEpOQmdQXG5saDZISGtBSU9sZzU1UHpUeHREUit6TFNMVUhSb0d4NkM3cDk4KzRqamNoMnpMemZqYzcwdVlHYlBzZ1pIWGFhXG5HdVV6QjIwYkU4N0tabmZ1cEsvMUViQ2ROZWtxZWxCM0wyQUc3VnhoS3NFc1VteWFzRHNQZHlzUExlaHNkdkp5XG5DVjdpWWF4ZUpBQmU5bHgyUExVMlc1SGRJTlp2UGtuWWtOUGFlQUhCTDlaamk5OU9xR0VHdnVObVprNitzMWtDXG5ZWXNzcjZQSkpxb1phNnB6ak5TR3cyODhHTHp1c3FhNTBzaGxGVW03S2JSa3dWYUNGUFhHZmtHajhrVTRYTThGXG54TDNkRnFGS3J2NzgrU3hpODZjZFVDOHhHcXRUZ2RBZzFMS2RzOGw2bmtpQWVBUE5HWHdFMkdmN0EzWTM5cm1IXG4yTUQyMlBGWkhlM2d1cEF0ejV3U1lwRDI1Y1k0b1RTUFVPK2J3SWVETmVlN2l1NzJRZXFkMUpPQm9CaGJzZzh1XG5IZHZXMXREYjRTUHg0MmdXQU42SVE5cHBWcU1PaUJHZnlPeHZ6eTNYWXp1MDZHb1ZMTW9hVEY5cHBGUDdzL3Q5XG40Vk5zNXlNVlloOTVWdzEvYktlbVdxVm5rUTFGWUlqWmZnd0hDaEJzaWlLc2psRThkNUtDQUNkdG1EbUtoblBhXG5rWGxyQklvcHZoendIc05FSVY0K3N4WTFhdWN0VkE0K00yOVFudCttUFk1UzlBbC9KR0s1UlhGR2JVMHdxcGJoXG5qUkM0Zzh5cmp0TkV4ZmFDOFN4Z1J3ZnZRYnMvT2wwL0NnQ1RIbytjS3JNNmo2SUY0VTRtZXJBZ0ZpMGphandPXG42WHo2MUlZek5TRXBmZmhJS1ZOZkJoTHNSZGlmbkNPQ0YwSUQxanQ2d2pwQXRiOE1USGVOTjk1WmpPUDhJVm5FXG5OcHYxcWgrSGZ1VUZyRlc2VzRPUU5sS0h0eFZVcE4zeWszc3VNejRJeEFsbFVIVHNZbnE0MURGVXNPMlhKR3A2XG5lZFVnRUFDZWxnbnBtZmZKMm5YR1ZIbTdjRWR2ZEJmNkJCRVJJYTIwbmhndndYNFF6NkNqekVQc1VqTjlOd0p4XG5hNGRJZ1JYdCtsY0s0NnRhQk8vQkxHa1M2TXM2ajdIemszUm1ZTzFMMVJ6OTJCNUdwQlhGZEc0a0ZJdVpLMm9QXG5EKzhqY0x0bEgwRGlGeUR0QnRVWXc4dHpweGhQV3Ixd0s3MzgwcnFIQTI2bEluUVdZekJ1ZXV2Si9HREIycGpyXG5JOVlzQ3JrQjRaWnRVcVo3WkVTOElGbWVrK0ljaXMwVzc5Unl2Q1VoenhVay82Vm9NV3R6ZzVsc1ZMVEdqQjZHXG51dklIdm9KQSt6NU12N002VmMzZWVSNk5nWkViMFRvcndYYWZRME9jaytGMGFHQkdGNm43cVZvV2g5UUE4TnJhXG5HTjZwdGZxcnVVeUN0c2xBWUxYeVFlU3czZHJlVmdoNk5zeXUyTFl6YXNKMC83NVNsZWNselU4VE91V0NOL0V5XG5JTzlvODROYWpqcC9RVThJUzcwNDlpUjAwQnVnSWFlRG1PMVVwa0ZXdFNzTnd0bGJDYTJMdEdwS2NGQ2lZeGFsXG5SSFhQUT18fE9nWkg5WGVIK3kyNTZCTjI1RG83NTVIRU1uSXU3Mm1nYVg0c3ZoUHZtdWJ0RENFT1hHL2daMUdiXG5nSnk0WWhUNzJleXRrMDBlcFlDOEgrUzR5MXIwQ21LMHI5eUNFemJObUdwemRwVmxLdERWRUlSeXFlUVBEU2lVXG5VU25yZjRKaFVkSGZicEpETmdhZnNhVVZsYlcwYW1SdUs2TUwxamdlS0Evc2NZbVhwVTFNbUorT29VZmxWbnFQXG5yb1loVFRqRm1KNnBUOTk1Ti9qSUFKRkR1d3NuRmZSeDFHU01Ga3NYaCsybEpxY1FQUnFjVkU2ZHpMaFpTYkRWXG5SZDhxUklUamxEYU5Nd1JEeWtYNkxNZlR4RWVyOHczQkJWcys3NzdwMWkrS0tXL05RRHRFcDFTS0xDeTU5YXFMXG5CcnJzem05Vm5KQXFjSlR3YTdWcmdjUjdCaDhzZkE9PVxuLS0tLS1FTkQgTElDRU5TRSBLRVktLS0tLSIsIng1MDkiOiItLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS1cbk1JSUVERENDQWZRQ0NRQ3FnMm9EVDgweHdqQU5CZ2txaGtpRzl3MEJBUVVGQURCSU1Rc3dDUVlEVlFRR0V3SkVcblJURVBNQTBHQTFVRUNBd0dRbVZ5YkdsdU1ROHdEUVlEVlFRSERBWkNaWEpzYVc0eEZ6QVZCZ05WQkFNTURteHBcblkyVnVjMlV1YmpodUxtbHZNQjRYRFRJeU1EWXlOREEwTVRBME1Gb1hEVEl6TURZeU5EQTBNVEEwTUZvd1NERUxcbk1Ba0dBMVVFQmhNQ1JFVXhEekFOQmdOVkJBZ01Ca0psY214cGJqRVBNQTBHQTFVRUJ3d0dRbVZ5YkdsdU1SY3dcbkZRWURWUVFEREE1c2FXTmxibk5sTG00NGJpNXBiekNDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NcbkFRb0NnZ0VCQU1CTTA1WEI0NGc1eGZtQ0x3ZHBVVHdBVDgrQ0JreUxLRnNlemtENUsvNldoYVgvWHJzZC9RZDBcbjIwSjd3bDVXZEhVNGNWQm1GUmpWd1Z6a2xDSzJ5WUppOG1qeDhzWHNHcTlRMWxiVWVNS2ZWOWRzZ2Z1aG5sQVNcbnRuUVpnbHVnT25GMkZnUmhYYi9qSzB0eFRvYW8rYk5FNnI0Z0lFenBrdEhMQlRZdnZpdUptcmVmN1diUFJ0NElcbm5kOUQ3bGh5YmVieWhWN2t1empRQS9wUEtIVEZzOE1USFo4aFlVeFJ5cnBtMytNWXpRRCtiakEyVTFGSWN0YVVcbndRWFlXYU43dDJ1VHdDdDl6QUtzbVkvV2VPYnZsM1RaTjVPTkxBenlXR0N1bG01Y3dLUjN4YmxCWnpYbkI2Z3Ncbk9uTjJPQWRTdGN6VFZDeWNtOHBjRlVyeXRLU0trR0VDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUVVGQUFPQ0FnRUFcbmxKMDF3Y24xdmpYWENIdW9pN1IwREoxbGx4MStkYWZxeUVxUEEyN0p1K0xYbVZWR1hRb3JTMWI4eGpVcVVrY1pcblRCd2JXRk81ejVkWm1Odm5ieWphem0rNm9PZzBQTWFZeGg2VEZ3c0kyUE9iYzdiRnYyZWF5d1B0LzFDcG5jNDBcbnFVTWhmdlJ4L0dDWlBDV3ozLzJSUEpXWDlqUURTSFhDWHE4QlcrSS8zY3VMRFp5WTNmRVlCQjBwM0R2Vm1hZDZcbjZXSFFhVXJpTjAvTHF5U09wL0xaZ2xsL3QwMjlnV1Z0MDVaaWJHb0srY1ZoWkVjc0xjVUlocmoydUZHRmQzSW1cbkpMZzFKS0o3aktTQlVRT2RJTUR2c0ZVRjdZZE12TXVyQ1lBMnNPTk44Q1orSTV4UVYxS1M5ZXZHSE01Zm13Z1Ncbk9QRnZQenREQ2kwLzF1Vzl0T2dIcG9ydW9kYWN0K0VaTmtBVFhDdlppdTJ3L3F0S1JKRjRVNElURW01YVcwa3dcbjZ6dUM4eHlJa3Q3dmhkczQ4VXVSU0dIOWpKckFlbWxFaXp0R0lMaEdEcXpRR1libGhVUUZHTWJCYjdqaGVMeUNcbkxKMVdPRzYyRjFzcHhDS0J6RVc1eDZwUjF6VDFtaEVnZDRNa0xhNnpQVHBhY3JkOTVBZ3hhR0tFTGExUldTRnBcbk12ZGhHazROdjdobmI4citCdU1SQzZpZWRQTUN6WHEvTTUwY044QWc4YncrSjFhRm8rMEVLMmhXSmE3a2lFK3NcbjlHdkZqU2R6Q0ZsVVBoS2trVVprU281YU90Y1FxN0p1NmtXQmhMb0ZZS2dwcmxwMVFWQjBzR1pBNm82RHRxamFcbkc3L1JrNnZiYVk4d3NOWUsyekJYVFQ4bmVoNVpvUlovUEpMVXRFRXRjN1k9XG4tLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tXG4ifQ==";

const { x509: t, licenseKey: licenseKeyNNNNNN } = JSON.parse(
  Buffer.from(correctLicenseCert, "base64").toString("ascii")
);

/**
 * ! Step 2, figure out subject, issuer, validity dates and other properties
 * TODO: This is Perfect
 */

let x509Cert = new crypto.X509Certificate(t);

/**
 * ! Step 3
 * TODO: This is Perfect
 */

let s = x509Cert.publicKey.export({
  format: "pem",
  type: "pkcs1",
});

/**
 * ! Step 4
 * TODO: This is Perfect
 */

let thisKey = new NodeRSA(s);

/**
 * ! Step 5
 * TODO: WIP
 */

let e = licenseKeyNNNNNN.replace(/(\r\n|\n|\r)/gm, "");
let matched = e.match(
  /^-----BEGIN LICENSE KEY-----(?<encryptedSymmetricKey>.+\|\|)(?<encryptedData>.+)\|\|(?<signature>.+)-----END LICENSE KEY-----$/
);

let n = matched.groups.encryptedSymmetricKey,
  i = matched.groups.encryptedData,
  sss = matched.groups.signature,
  a,
  o;

a = thisKey.decryptPublic(n, "utf8");
console.log(a);
console.log(n);

// console.log(a);

// // steps to reproducts
// import NodeRSA from "node-rsa";
// // encryption part
// const rsaPublic = new NodeRSA();
// rsaPublic.importKey(publicKey, "public");
// const encryptedSymmetricKey = rsaPublic.encrypt(symmetricKey, "base64");

// // decryption part

// const { x509: t, licenseKey: licenseKeyNNNNNN } = JSON.parse(
//   Buffer.from(licenseCert, "base64").toString("ascii")
// );

// let x509Cert = new crypto.X509Certificate(t);
// let s = x509Cert.publicKey.export({
//   format: "pem",
//   type: "pkcs1",
// });

// let thisKey = new NodeRSA(s);

// thisKey.decryptPublic(n, "utf8");
