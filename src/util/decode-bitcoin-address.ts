import { AddressType, getAddressInfo } from "bitcoin-address-validation";
import * as bitcoin from "bitcoinjs-lib";
import { hexToBytes, hexToInt } from "@stacks/common";

const typeMapping = {
  [AddressType.p2pkh]: "0x00",
  [AddressType.p2sh]: "0x01",
  [AddressType.p2wpkh]: "0x04",
  [AddressType.p2wsh]: "0x05",
  [AddressType.p2tr]: "0x06",
};

export function decodeBitcoinAddress(address: string) {
  const addressInfo = getAddressInfo(address);

  const { bech32 } = addressInfo;
  let hash: Uint8Array;
  if (bech32) {
    hash = bitcoin.address.fromBech32(address).data;
  } else {
    hash = bitcoin.address.fromBase58Check(address).hash;
  }

  const type = typeMapping[addressInfo.type];
  if (!type) {
    throw new Error(`Unsupported address type: ${addressInfo.type}`);
  }

  return {
    type,
    hash,
  };
}

export function encodeBitcoinAddress(
  hashHex: string,
  versionHex: string,
  network: bitcoin.Network,
) {
  const hash = hexToBytes(hashHex);
  const version = hexToInt(versionHex);

  // p2pkh
  if (version === 0) {
    return bitcoin.address.toBase58Check(hash, network.pubKeyHash);
  }
  // p2sh with all its versions
  if (version < 4) {
    return bitcoin.address.toBase58Check(hash, network.scriptHash);
  }
  // p2tr has version 1
  if (version === 6) {
    return bitcoin.address.toBech32(hash, 1, network.bech32);
  }
  // p2wpkh and p2wsh are handled the same way p2wsh is just longer
  return bitcoin.address.toBech32(hash, 0, network.bech32);
}
