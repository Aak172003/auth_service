import crypto from "crypto";
import fs from "fs";

const cryptoKeys = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
});

const { privateKey, publicKey } = cryptoKeys;

console.log("public key ------------------------- ", publicKey);
console.log("private key ------------------------- ", privateKey);

fs.writeFileSync("certs/private.pem", privateKey);
fs.writeFileSync("certs/public.pem", publicKey);
