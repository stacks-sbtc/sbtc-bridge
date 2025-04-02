import type { AnyObject, TestContext } from "yup";
import { getStacksNetwork } from "../get-stacks-network";
import { getStacksAddressInfo } from "../get-stacks-address-info";
import { DefaultNetworkConfigurations } from "@leather.io/models";
// reference:
// https://github.com/stacks-network/stacks-core/blob/master/clarity/src/vm/representations.rs#L36
const contractNameRegex = /^([a-zA-Z](([a-zA-Z0-9]|[-_])){1,40})$/;

export function testStxAddress(
  this: TestContext<AnyObject>,
  value: string | undefined,
  network: DefaultNetworkConfigurations,
) {
  const { path, createError } = this;

  if (!value) return true;

  const [address, contractName] = value.split(".") as [
    string,
    string | undefined,
  ];
  if (contractName !== undefined) {
    const isContractNameValid = contractNameRegex.test(contractName);
    // this is deterministic since the existence of at least one dot is guaranteed
    if (value.match(/\./g)!.length > 1) {
      return createError({
        path,
        message: `Invalid contract address`,
      });
    }
    if (!isContractNameValid) {
      return createError({
        path,
        message: `Invalid contract name`,
      });
    }
  }
  const stacksNetwork = getStacksNetwork(network);
  const isMainnet = stacksNetwork === "mainnet";
  const addressNetwork = isMainnet ? "mainnet" : "testnet";
  const addressInfo = getStacksAddressInfo(address);
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
