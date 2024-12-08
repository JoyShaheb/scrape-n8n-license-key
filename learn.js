import NodeRSA from "node-rsa";
const key = new NodeRSA({ b: 512 });
const publicKey = key.exportKey("public");
const privateKey = key.exportKey("private");

const text = "Hello RSA!";
const encrypted = key.encrypt(text, "base64");
console.log("encrypted: ", encrypted);
const decrypted = key.decrypt(encrypted, "utf8");
console.log("decrypted: ", decrypted);
