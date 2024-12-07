// generateCertificate.js

import crypto from "crypto";

export function generateMockCertificate(tenantId, productIdentifier) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  const terminatesAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

  const cert = {
    version: 1,
    tenantId: tenantId,
    consumerId: crypto.randomUUID(),
    productIdentifier: productIdentifier,
    createdAt: now.toISOString(),
    issuedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    terminatesAt: terminatesAt.toISOString(),
    isEphemeral: false,
    entitlements: [
      {
        id: crypto.randomUUID(),
        productId: "demo-product",
        validFrom: now.toISOString(),
        validTo: expiresAt.toISOString(),
        features: {
          "a-special-feature": true,
          "another-feature": "value",
          foo: "bar",
          "quota:demoQuota": 1000,
        },
        featureOverrides: {},
      },
    ],
    renewalToken: crypto.randomBytes(32).toString("hex"),
    managementJwt: "mock.jwt.token",
  };

  const licenseKey = `-----BEGIN LICENSE KEY-----\n${Buffer.from(
    JSON.stringify(cert)
  ).toString("base64")}\n-----END LICENSE KEY-----`;

  return Buffer.from(
    JSON.stringify({ licenseKey, x509: "MOCK_X509_CERT" })
  ).toString("base64");
}
