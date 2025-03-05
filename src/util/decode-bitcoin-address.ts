import { AddressType, getAddressInfo } from "bitcoin-address-validation";
import * as bitcoin from "bitcoinjs-lib";

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

  return {
    type: typeMapping[addressInfo.type],
    hash,
  };
}
