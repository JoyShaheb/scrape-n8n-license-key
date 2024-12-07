import { LicenseManager } from "@n8n_io/license-sdk";
import NodeRSA from "node-rsa";
import { v4 as uuidv4 } from "uuid";

// Generate RSA key pair
const key = new NodeRSA({ b: 2048 });
const publicKey = key.exportKey("public");
const privateKey = key.exportKey("private");

const reservationId = "f9e725f6-aef6-445e-97fb-d6e7aabd65e7";

// Create a simulated license
function createSimulatedLicense() {
  const licenseData = {
    id: uuidv4(),
    tenantId: 1, // Changed to string as some systems expect string IDs
    productIdentifier: "demo-product",
    consumerId: uuidv4(),
    createdAt: new Date().toISOString(),
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    terminatesAt: new Date(
      Date.now() + 2 * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
    entitlements: [
      {
        id: uuidv4(),
        productId: "demo-product",
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        features: {
          feature1: true,
          feature2: 100,
          feature3: "premium",
        },
      },
    ],
  };

  const licenseString = JSON.stringify(licenseData);
  const encryptedData = key.encrypt(licenseString, "base64");
  const signature = key.sign(licenseString, "base64");

  return `-----BEGIN LICENSE KEY-----${encryptedData}||${signature}-----END LICENSE KEY-----`;
}

const simulatedLicenseKey = createSimulatedLicense();

// Configuration for the LicenseManager
const config = {
  tenantId: 1,
  productIdentifier: "demo-product",
  deviceFingerprint: async () => "simulated-device-fingerprint",
  saveCertStr: async (certStr) => {
    // console.log("Saving cert:", certStr);
  },
  loadCertStr: async () => {
    const certStr = Buffer.from(
      JSON.stringify({
        licenseKey: simulatedLicenseKey,
        x509: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
      })
    ).toString("base64");
    // console.log("Loading cert:", certStr);
    return certStr;
  },
  offlineMode: false,
};

// Create a LicenseManager instance
const licenseManager = new LicenseManager(config);

// Function to simulate license activation
async function activateLicense() {
  try {
    await licenseManager.initialize();
    console.log("LicenseManager initialized");

    // Simulate activation with a dummy reservation ID
    await licenseManager.activate("simulated-reservation-id");
    console.log("License activated successfully (simulated)");
  } catch (error) {
    console.error("License activation failed:", error.message);
  }
}

// Function to get and display all features
function getAllFeatures() {
  const features = licenseManager.getFeatures();
  console.log("All features:", features);
  return features;
}

// Main function to demonstrate the license management process
async function main() {
  // Initialize and "activate" the license
  await activateLicense();

  // Get and display features
  getAllFeatures();

  // Check if the license is valid
  console.log("Is license valid?", licenseManager.isValid());

  // Display additional license information
  console.log("License expiry date:", licenseManager.getExpiryDate());
  console.log("License termination date:", licenseManager.getTerminationDate());
}

// Run the demonstration
main().catch(console.error);
