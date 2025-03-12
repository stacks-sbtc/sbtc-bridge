import validate, { getAddressInfo, Network } from "bitcoin-address-validation";
import type { DefaultNetworkConfigurations } from "@leather.io/models";

export const validateBitcoinAddress = (
  address: string,
  network: DefaultNetworkConfigurations,
): boolean => {
  const isMainnet = network === "mainnet";
  const addressInfo = getAddressInfo(address);
  let addressNetwork = isMainnet ? Network.mainnet : Network.regtest;
  // bech32 is different between all three networks
  // base58 is same between regtest and testnet
  // the validation lib defaults to testnet when using base58 addresses the same address is valid for regtest
  // so it would break if the passed address is regtest base58 and the network is regtest,
  // since to it the address is testnet by default, this is basically a workaround for regtest
  const isRegtestBase58 = !addressInfo.bech32 && !isMainnet;
  addressNetwork = isRegtestBase58 ? Network.testnet : addressNetwork;

  return validate(address, addressNetwork);
};
