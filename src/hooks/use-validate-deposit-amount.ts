import { useMemo } from "react";
import * as yup from "yup";
yup.setLocale({
  mixed: {
    notType: ({ path, type, value }) => {
      return type !== "mixed"
        ? `${path} must be a ${type} `
        : `${path} must match the configured type. ` +
            `The validated value was: \`${value}\``;
    },
  },
});
export function useValidateDepositAmount({
  maxDepositAmount,
  minDepositAmount,
}: {
  maxDepositAmount: number;
  minDepositAmount: number;
}) {
  return useMemo(
    () =>
      yup
        .number()
        .positive()
        .test("maxDigits", "BTC can have up to 8 decimal places", (number) => {
          if (!number) return true;
          const numberString = String(number);
          const [, decimalPart] = numberString.split(".");
          return decimalPart?.length <= 8 || decimalPart === undefined;
        })
        .min(
          minDepositAmount,
          `Minimum deposit amount is ${minDepositAmount} BTC`,
        )
        .max(
          maxDepositAmount,
          `Current deposit cap is ${maxDepositAmount} BTC`,
        )
        .required(),

    [maxDepositAmount, minDepositAmount],
  );
}
