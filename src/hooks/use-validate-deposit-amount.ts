import { useMemo } from "react";
import * as yup from "yup";

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
      yup.object({
        amount: yup
          .number()
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
      }),
    [btcBalance, maxDepositAmount, minDepositAmount],
  );
}
