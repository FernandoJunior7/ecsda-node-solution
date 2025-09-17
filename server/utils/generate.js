const secp = require('ethereum-cryptography/secp256k1');

const { toHex } = require('ethereum-cryptography/utils');

const randomPrivateKey = secp.utils.randomPrivateKey();
console.log(toHex(randomPrivateKey));
const publicKeyFromRandomPrivateKey = secp.getPublicKey(randomPrivateKey);
const ethereumAddressFromRandomPrivateKey = toHex(publicKeyFromRandomPrivateKey).slice(1).slice(-20);
console.log(ethereumAddressFromRandomPrivateKey);

console.log('Public Key:', toHex(secp.getPublicKey('b7f3690695c6b73b5f8736fd3aa5941e950a8516ba4014c1ee825acf9227c280')).slice(1).slice(-20));