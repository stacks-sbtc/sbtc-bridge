import type { AnyObject, TestContext } from "yup";
import { getStacksNetwork } from "../get-stacks-network";
import { getStacksAddressInfo } from "../get-stacks-address-info";
import { DefaultNetworkConfigurations } from "@leather.io/models";

export function testStxAddress(
  this: TestContext<AnyObject>,
  value: string | undefined,
  network: DefaultNetworkConfigurations,
) {
  const { path, createError } = this;

  if (!value) return true;
  const stacksNetwork = getStacksNetwork(network);
  const isMainnet = stacksNetwork === "mainnet";
  const addressNetwork = isMainnet ? "mainnet" : "testnet";
  const addressInfo = getStacksAddressInfo(value);
  if (!addressInfo.valid) {
    return createError({
      path,
      message: `Invalid Stacks address`,
    });
  }
  if (addressInfo.type !== addressNetwork) {
    return createError({
      path,
      message: `Please use a valid Stacks ${addressNetwork} address`,
    });
  }
  return true;
}
