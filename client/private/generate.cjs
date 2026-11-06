const fs = require("fs");
const path = require("path");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

let output = "";
for (let i = 1; i <= 3; i++) {
  const privateKey = secp.secp256k1.utils.randomPrivateKey();
  const publicKey = secp.secp256k1.getPublicKey(privateKey);

  console.log(`--- pair ${i} ---`);
  console.log("private key: ", toHex(privateKey));
  console.log("public key: ", toHex(publicKey));

  output += `pair ${i}\nprivate: ${toHex(privateKey)}\npublic: ${toHex(publicKey)}\n\n`;
}

fs.writeFileSync(path.join(__dirname, "keys.txt"), output);
console.log("Сохранен в private/keys.txt");
