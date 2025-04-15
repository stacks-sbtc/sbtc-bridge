import { getWithdrawalMaxFee } from "@/actions/get-withdrawal-max-fee";
import { validateWithdrawal } from "@/app/withdraw/components/util/validate-withdraw-amount";
import { useEmilyLimits } from "@/hooks/use-mint-caps";
import { useSBTCBalance } from "@/hooks/use-sbtc-balance";
import { bridgeConfigAtom, walletInfoAtom } from "@/util/atoms";
import { testBTCAddress } from "@/util/yup/test-btc-address";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import * as yup from "yup";

export function useWithdrawalValidation() {
  const { addresses } = useAtomValue(walletInfoAtom);

  const { data: satsBalance } = useSBTCBalance({
    address: addresses.stacks?.address,
  });
  const { data: maxFee } = useQuery({
    queryKey: ["maxFee"],
    queryFn: async () => {
      return getWithdrawalMaxFee();
    },
  });

  const { data: emilyLimits } = useEmilyLimits();
  const config = useAtomValue(bridgeConfigAtom);
  const min = config.WITHDRAW_MIN_AMOUNT_SATS / 1e8;
  const amountValidationSchema = useMemo(() => {
    const btcBalance = Number(satsBalance) / 1e8;
    const fee = maxFee! / 1e8;
    return yup
      .number()
      .min(
        min,
        `Minimum withdrawal amount is ${min.toLocaleString(undefined, {
          maximumFractionDigits: 8,
        })} BTC`,
      )
      .test("capsAndBalanceValidation", function (value) {
        return validateWithdrawal.call(
          this,
          value,
          emilyLimits,
          btcBalance,
          fee,
        );
      })
      .required();
  }, [satsBalance, maxFee, min, emilyLimits]);
  const { WALLET_NETWORK: stacksNetwork } = useAtomValue(bridgeConfigAtom);
  const addressValidationSchema = useMemo(
    () =>
      yup
        .string()
        .test("btc", "Invalid BTC address", function (value) {
          return testBTCAddress.call(this, value, stacksNetwork!);
        })
        .required(),

    [stacksNetwork],
  );

  return {
    amountValidationSchema,
    addressValidationSchema,
  };
}
