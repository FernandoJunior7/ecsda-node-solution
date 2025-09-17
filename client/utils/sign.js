import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes} from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function signTransaction(transaction, privateKey) {
    const stringifiedTransaction = JSON.stringify(transaction);
    const hashedTransaction = keccak256(utf8ToBytes(stringifiedTransaction));

    return secp.sign(hashedTransaction, privateKey, { recovered: true });
}

export default signTransaction;