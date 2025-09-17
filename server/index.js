const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// private key 1: b7f3690695c6b73b5f8736fd3aa5941e950a8516ba4014c1ee825acf9227c280
// private key 2: dfebc8b77bb37ba9c79a7b23ac930e971cdd2ea8acfbfacec6ea288d195d5c35
// private key 3: cbf818605e5f7a25661aa58d9a2790c1645eb3eca6b91ec43ed3285c5fe6a959

const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex, hexToBytes} = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const balances = {
  "0xeac73b077ddc5b7a6ff9": 100,
  "0x52b1dc41c9537b06a9f3": 50,
  "0x9f2546c63237f8c84f2d": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recipient, amount } = req.body;

  const stringifiedTransaction = JSON.stringify({
    amount: parseInt(amount),
    recipient
  });
  const hashedTransaction = keccak256(utf8ToBytes(stringifiedTransaction));

  const publicKey = secp.recoverPublicKey(hashedTransaction, signature.signature, signature.recoveryBit);
  const senderAddress = "0x" + toHex(publicKey).slice(1).slice(-20);

  setInitialBalance(senderAddress);
  setInitialBalance(recipient);

  const isVerified = secp.verify(signature.signature, hashedTransaction, publicKey);

  if (!isVerified) {
    res.status(400).send({ message: "Invalid signature!" });
  }
  if (balances[senderAddress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderAddress] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderAddress] });
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
