import { LicenseManager } from "@n8n_io/license-sdk";
import pino from "pino";
import crypto from "crypto";

const logger = pino();

const LICENSE_SERVER = "http://localhost:3003";
const TENANT_ID = 1;
const PRODUCT_IDENTIFIER = "Demo Product v1.0";
const ACTIVATION_KEY = "demo-activation-key";

// Function to generate a mock certificate
function generateMockCertificate() {
  const now = Math.floor(Date.now() / 1000);
  const oneYearFromNow = now + 365 * 24 * 60 * 60;

  const cert = {
    iss: LICENSE_SERVER,
    sub: TENANT_ID.toString(),
    aud: PRODUCT_IDENTIFIER,
    exp: oneYearFromNow,
    iat: now,
    jti: crypto.randomBytes(16).toString("hex"),
    features: {
      "feature-a": true,
      "feature-b": false,
      "max-users": 10,
    },
  };

  return Buffer.from(JSON.stringify(cert)).toString("base64");
}

const license = new LicenseManager({
  server: LICENSE_SERVER,
  tenantId: TENANT_ID,
  productIdentifier: PRODUCT_IDENTIFIER,
  autoRenewEnabled: true,
  renewOnInit: false,
  autoRenewOffset: 60 * 60 * 24, // 24 hours
  logger,
  loadCertStr: async () => {
    // In a real scenario, you'd load the saved certificate from a database or file
    // For this example, we'll generate a mock certificate
    logger.info("Loading certificate...");
    const cert = generateMockCertificate();
    logger.info("Certificate loaded:", cert);
    return cert;
  },
  saveCertStr: async (cert) => {
    // In a real scenario, you'd save the certificate to a database or file
    logger.info("Saving certificate:", cert);
  },
});

async function main() {
  try {
    logger.info("Initializing license...");
    await license.initialize();

    console.log("License is valid:", license.isValid());
    console.log("All features:", license.getFeatures());

    // Check for specific features
    const featureA = "feature-a";
    const featureB = "feature-b";
    logger.info(`Has ${featureA}:`, license.hasFeatureEnabled(featureA));
    logger.info(`Has ${featureB}:`, license.hasFeatureEnabled(featureB));

    // Get feature value
    const quotaFeature = "max-users";
    const quotaValue = license.getFeatureValue(quotaFeature);
    logger.info(`${quotaFeature} value:`, quotaValue);

    // Check quota
    const currentUsers = 5;
    if (license.hasQuotaLeft(quotaFeature, currentUsers)) {
      logger.info(`Has quota left for ${quotaFeature}`);
    } else {
      logger.info(`No quota left for ${quotaFeature}`);
    }
  } catch (error) {
    logger.error("Error in main:", error);
  }
}

main().catch((error) => logger.error("Unhandled error:", error));
