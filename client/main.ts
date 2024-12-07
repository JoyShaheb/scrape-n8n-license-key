import fetch from "node-fetch";
import { LicenseManager } from "@n8n_io/license-sdk";
import pino from "pino";

const logger = pino();

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3003";
const LICENSE_ID = process.env.LICENSE_ID || "demo-cert-001";

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// const license = new LicenseManager({
//   server: SERVER_URL,
//   tenantId: 1,
//   productIdentifier: "Demo Product v1.2.3",
//   autoRenewEnabled: true,
//   renewOnInit: false,
//   autoRenewOffset: 60 * 60 * 48,
//   logger,
//   loadCertStr: async () => {
//     try {
//       logger.info(`Fetching license from ${SERVER_URL}/license/${LICENSE_ID}`);
//       const response = await fetch(`${SERVER_URL}/license/${LICENSE_ID}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const rawText = await response.text();
//       logger.debug("Raw response:", rawText);

//       if (!isValidJSON(rawText)) {
//         throw new Error("Invalid JSON received from server");
//       }

//       const parsedJSON = JSON.parse(rawText);
//       logger.debug("Parsed JSON:", parsedJSON);

//       const jsonString = JSON.stringify(parsedJSON);
//       const base64Encoded = Buffer.from(jsonString).toString("base64");
//       logger.debug("Base64 encoded license:", base64Encoded);

//       return base64Encoded;
//     } catch (error) {
//       logger.error("Error in loadCertStr:", error);
//       throw error;
//     }
//   },
//   saveCertStr: async (cert) => {
//     logger.info("Saving certificate:", cert);
//   },
//   onFeatureChange: () =>
//     logger.info("Availability of some features has just changed"),
// });

// async function main() {
//   try {
//     logger.info("Initializing license...");
//     await license.initialize();
//     logger.info("Is license valid?", license.isValid());
//     logger.info(
//       "Has 'a-special-feature'?",
//       license.hasFeatureEnabled("a-special-feature")
//     );
//     logger.info(
//       "Value of 'another-feature':",
//       license.getFeatureValue("another-feature")
//     );
//     logger.info("All features:", license.getFeatures());
//   } catch (error) {
//     logger.error("Error in main:", error);
//   }
// }

// main().catch((error) => logger.error("Unhandled error:", error));

const license = new LicenseManager({
  server: "http://localhost:3003",
  tenantId: 1,
  autoRenewEnabled: true,
  autoRenewOffset: 60 * 60 * 48,
  logger,
  loadCertStr: async () => {
    return JSON.stringify({})
  },
  productIdentifier: "Demo Product v1.2.3",
  saveCertStr: async (cert) => {
    logger.info("Saving certificate:", cert);
  },

});

console.log("license", license)