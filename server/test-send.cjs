const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak.js");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

const [, , privateKey, recipient] = process.argv;
const sender = toHex(secp256k1.getPublicKey(privateKey));

function sign(tx, key) {
  const message = JSON.stringify({ sender: tx.sender, amount: tx.amount, recipient: tx.recipient });
  const hash = keccak256(utf8ToBytes(message));
  return secp256k1.sign(hash, key).toCompactHex();
}

async function send(label, tx) {
  const res = await fetch("http://localhost:3042/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx),
  });
  console.log(label, "->", res.status, await res.json());
}

(async () => {
  const tx = { sender, amount: 1, recipient };
  const hexSign = sign(tx, privateKey);

  await send("1. valid transaction     ", { ...tx, hexSign });
  await send("2. amount changed        ", { ...tx, amount: 50, hexSign });
  await send("3. recipient changed     ", { ...tx, recipient: "02" + "ab".repeat(32), hexSign });

  const strangerKey = toHex(secp256k1.utils.randomPrivateKey());
  await send("4. signed by stranger key", { ...tx, hexSign: sign(tx, strangerKey) });
})();