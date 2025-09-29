import type { AnyObject, TestContext } from "yup";
import { isValidBNSName } from "../bns";

export function testBNSName(
  this: TestContext<AnyObject>,
  value: string | undefined,
) {
  const { path, createError } = this;

  if (!value) return false;

  if (!isValidBNSName(value)) {
    return createError({
      path,
      message: `Invalid BNS name`,
    });
  }
  return true;
}
