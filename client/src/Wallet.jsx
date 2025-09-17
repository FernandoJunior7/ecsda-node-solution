import server from "./server";

import * as secp from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = "0x" + toHex(secp.getPublicKey(hexToBytes(privateKey))).slice(1).slice(-20);

    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Paste your private key to sign the transaction" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="address">Address: {address}</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
