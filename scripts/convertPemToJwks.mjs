import fs from "fs";
import rsaPemToJwk from "rsa-pem-to-jwk";

// we are trying to host the public key , because we use HS256 Algoithm to create Assymetric key ( public and private)
// which means token will decrypt only by the public key , when  we generate private key , so public key will automatically change aacording to private key
// so token only decrypt by those public key , which generate with public key

// here we sign the jwt token form private key and and verify the token via public key
const privateKey = fs.readFileSync("./certs/private.pem");

// this jwk is only use to verify the token
const jwk = rsaPemToJwk(privateKey, { use: "sig" }, "public");

console.log("this is jwk -------------- ", jwk);

console.log("change format ", JSON.stringify(jwk));
