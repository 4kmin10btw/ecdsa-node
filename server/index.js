const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { keccak256 } = require("ethereum-cryptography/keccak.js");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "03ec95e0866a4b7d32664c66ba4a066b210bc046734aa24e8dab59c25377548f9e": 100,
  "03860315b13b21f74cef7788f7cc9f21c57b9e6a11ad7815b6167c949dfaacc264": 50,
  "037b0f3d6a403f927414084c72b85a46cfd7611e1c6a98e9a6d7d687a08017ff0c": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, hexSign } = req.body;

  // сервер сам пересчитывает хэш из полей, которые собирается исполнить
  const message = JSON.stringify({ sender, amount, recipient });
  const hash = keccak256(utf8ToBytes(message));

  let isSigned = false;
  try {
    isSigned = secp256k1.verify(hexSign, hash, sender);
  } catch (e) {
    isSigned = false;
  }
  console.log("Is signed: ", isSigned);

  if (!isSigned) {
    return res.status(400).send({ message: "Not signed!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
