const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
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
  const { signature, sender, recipient, amount } = req.body;

  const stringifiedTransaction = JSON.stringify({
    sender,
    amount: parseInt(amount),
    recipient
  });
  const hashedTransaction = keccak256(utf8ToBytes(stringifiedTransaction));

  const publicKey = secp.recoverPublicKey(hashedTransaction, signature.signature, signature.recoveryBit);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const isVerified = secp.verify(signature.signature, hashedTransaction, publicKey);

  if (!isVerified) {
    res.status(400).send({ message: "Invalid signature!" });
  }
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  }
  if (sender === recipient) {
    res.status(400).send({ message: "Cannot send to yourself!" });
  }
  if (!balances[recipient]) {
    res.status(404).send({ message: "Recipient does not exist!" });
  }

  balances[sender] -= amount;
  balances[recipient] += amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
