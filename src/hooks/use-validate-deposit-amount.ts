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
  btcBalance,
  maxDepositAmount,
  minDepositAmount,
}: {
  btcBalance: number;
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
          Math.min(btcBalance, maxDepositAmount),
          btcBalance < maxDepositAmount
            ? `The deposit amount exceeds your current balance of ${btcBalance} BTC`
            : `Current deposit cap is ${maxDepositAmount} BTC`,
        )
        .required(),

    [btcBalance, maxDepositAmount, minDepositAmount],
  );
}
