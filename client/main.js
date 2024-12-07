import { LicenseManager } from "@n8n_io/license-sdk";
import { v4 as uuidv4 } from "uuid";

// Configuration for the LicenseManager
const config = {
  tenantId: 1,
  productIdentifier: "your-product-identifier",
  // server: "http://localhost:3003", // Use the actual license server URL
  saveCertStr: async (certStr) => {
    // In a real scenario, you'd save this securely
    console.log("Saving cert:", certStr);
  },
  loadCertStr: async () => {
    // In a real scenario, you'd load the saved cert
    return null; // Simulating no saved cert for this example
  },
};

// Create a LicenseManager instance
const licenseManager = new LicenseManager(config);

// Function to simulate license activation
async function activateLicense(activationKey) {
  try {
    await licenseManager.activate(activationKey);
    console.log("License activated successfully");
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
  // Initialize the LicenseManager
  await licenseManager.initialize();
  console.log("LicenseManager initialized");

  // Simulate an activation key (in a real scenario, this would come from your license server)
  const simulatedActivationKey = uuidv4();
  console.log("Simulated activation key:", simulatedActivationKey);

  // Activate the license
  await activateLicense(simulatedActivationKey);

  // Get and display features
  getAllFeatures();

  // Check if the license is valid
  console.log("Is license valid?", licenseManager.isValid());
}

// Run the demonstration
main().catch(console.error);
