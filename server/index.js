import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3003;

app.use(express.json());

// Load certificates from file
const loadCertificates = async () => {
  const data = await fs.readFile(
    path.join(__dirname, "certificates.json"),
    "utf8"
  );
  return JSON.parse(data);
};

// Save certificates to file
const saveCertificates = async (certificates) => {
  await fs.writeFile(
    path.join(__dirname, "certificates.json"),
    JSON.stringify(certificates, null, 2)
  );
};

// Endpoint to get a certificate
app.get("/license/:id", async (req, res) => {
  const certificates = await loadCertificates();
  const certificate = certificates.find((cert) => cert.id === req.params.id);
  if (certificate) {
    res.json(certificate);
  } else {
    res.status(404).json({ error: "Certificate not found" });
  }
});

// Endpoint to activate a license
app.post("/license/activate/:id", async (req, res) => {
  const certificates = await loadCertificates();
  const certificate = certificates.find((cert) => cert.id === req.params.id);
  if (certificate && !certificate.activated) {
    certificate.activated = true;
    await saveCertificates(certificates);
    res.json(certificate);
  } else if (certificate && certificate.activated) {
    res.status(400).json({ error: "License already activated" });
  } else {
    res.status(404).json({ error: "Certificate not found" });
  }
});

// Endpoint to renew a license
app.post("/license/renew/:id", async (req, res) => {
  const certificates = await loadCertificates();
  const certificate = certificates.find((cert) => cert.id === req.params.id);
  if (certificate) {
    certificate.validUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(); // Extend by 30 days
    await saveCertificates(certificates);
    res.json(certificate);
  } else {
    res.status(404).json({ error: "Certificate not found" });
  }
});

app.listen(port, () => {
  console.log(`License server listening at http://localhost:${port}`);
});
