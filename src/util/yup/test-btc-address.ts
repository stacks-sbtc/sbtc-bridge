import type { AnyObject, TestContext } from "yup";
import { DefaultNetworkConfigurations } from "@leather.io/models";
import { validateBitcoinAddress } from "../validate-bitcoin-address";

export function testBTCAddress(
  this: TestContext<AnyObject>,
  value: string | undefined,
  network: DefaultNetworkConfigurations,
) {
  const { path, createError } = this;
  if (!value) return true;
  const isValid = validateBitcoinAddress(value, network);

  if (!isValid) {
    return createError({
      path,
      message: `Invalid BTC address`,
    });
  }

  return true;
}
