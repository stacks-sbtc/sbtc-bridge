import { AddressVersion, createAddress } from "@stacks/transactions";

export function getStacksAddressInfo(address: string): {
  address: string;
  valid: boolean;
  type: "mainnet" | "testnet" | "unknown";
} {
  try {
    const addressData = createAddress(address);
    const isMainnet =
      addressData.version === AddressVersion.MainnetMultiSig ||
      addressData.version === AddressVersion.MainnetSingleSig;
    return {
      address,
      valid: true,
      type: isMainnet ? "mainnet" : "testnet",
    };
  } catch (e) {
    return {
      address,
      valid: false,
      type: "unknown",
    };
  }
}
