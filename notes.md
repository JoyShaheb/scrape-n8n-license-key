```
import express from "express";
import { LicenseManager } from "@n8n_io/license-sdk";
import pino from "pino";
import cors from "cors";

const app = express();
const port = 3003;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Simulated license data store
let licenses = {
  "x-x-x-x-x": {
    features: {
      "a-special-feature": true,
      "another-feature": "some-value",
      "a-feature-that-exists": true,
    },
    quotas: {
      "quota:demoQuota": 1000,
    },
  },
};

// Express routes for license server
app.all("/activate", (req, res) => {
  const key = req.method === "GET" ? req.params.key : req.body.key;
  console.log(`Activation request received for key: ${key}`);
  if (licenses[key]) {
    console.log(`License found for key: ${key}`);
    res.json({ success: true, license: licenses[key] });
  } else {
    console.log(`License not found for key: ${key}`);
    res.status(404).json({ success: false, message: "License not found" });
  }
});

app.all("/renew", (req, res) => {
  const key = req.method === "GET" ? req.params.key : req.body.key;
  console.log(`Renewal request received for key: ${key}`);
  if (licenses[key]) {
    res.json({ success: true, message: "License renewed successfully" });
  } else {
    res.status(404).json({ success: false, message: "License not found" });
  }
});

const myLogger = pino({ level: "debug" });

let storedCert = null;

const license = new LicenseManager({
  server: `http://localhost:${port}`,
  tenantId: 1,
  productIdentifier: "Demo Product v1.2.3",
  autoRenewEnabled: true,
  renewOnInit: false,
  autoRenewOffset: 60 * 60 * 48, // 48 hours
  logger: myLogger,
  loadCertStr: async () => {
    console.log("Loading certificate");
    return storedCert;
  },
  saveCertStr: async (cert) => {
    console.log("Saving certificate");
    storedCert = cert;
  },
  deviceFingerprint: () => "a-unique-instance-id",
  onFeatureChange: () =>
    console.log("availability of some features has just changed"),
});

// API endpoint to trigger license activation
app.post("/trigger-activation", async (req, res) => {
  try {
    console.log("Initializing license...");
    await license?.initialize();
    console.log("License initialized");

    console.log("Activating license...");
    const activationResult = await license?.activate("x-x-x-x-x");
    console.log("Activation result:", activationResult);

    const isValid = license?.isValid();
    console.log(`Is valid: ${isValid}`);

    res.json({ success: true, isValid, activationResult });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ success: false, error: error.message, stack: error.stack });
  }
});

// API to check license validity
app.get("/check-license", (req, res) => {
  const isValid = license?.isValid();
  res.json({ isValid });
});

// API to get license features
app.get("/license-features", (req, res) => {
  const features = license?.getFeatures();
  res.json({ features });
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const server = app.listen(port, () => {
  console.log(`License server running at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(0);
  });
});

```
