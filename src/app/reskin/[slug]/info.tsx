import { elide } from "@/util";
import { FormButton } from "../components/form-button";
import { AddressInput } from "../components/forms/deposit/address-input";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useAtomValue } from "jotai";
import { walletInfoAtom } from "@/util/atoms";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { AmountInput } from "../components/forms/deposit/amount-input";

import { depositStepper } from "../components/stepper/deposit/util";
import { useReskinDepositStatus } from "../hooks/use-reskin-deposit-status";
const { useStepper } = depositStepper;

export function DepositInfo() {
  const pathname = usePathname();
  const stepper = useStepper();
  const [, , depositTxId] = pathname.split("/");

  const { recipient, bitcoinTxInfo } = useReskinDepositStatus(depositTxId);
  const { addresses } = useAtomValue(walletInfoAtom);
  useEffect(() => {
    stepper.goTo("status");
  }, [stepper]);

  const initialAmount = useMemo(() => {
    const value = bitcoinTxInfo?.vout[0].value;
    if (value) {
      return (value / 1e8).toLocaleString(undefined, {
        maximumFractionDigits: 8,
      });
    }
    return "";
  }, [bitcoinTxInfo?.vout]);

  const initialAddress = useMemo(() => {
    return recipient || addresses.stacks?.address || "";
  }, [addresses.stacks?.address, recipient]);

  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col justify-center items-center md:justify-normal gap-2 w-full px-6 lg:w-1/2 max-w-xl flex-1">
      <div
        className={`flex flex-col gap-2 flex-1 justify-center md:justify-normal w-full h-full`}
      >
        {(!isMobile ||
          stepper.current.id === "amount" ||
          stepper.current.id === "confirm" ||
          stepper.current.id === "status") && (
          <AmountInput
            value={`${initialAmount} BTC`}
            isReadonly={true}
            isEditable={false}
          />
        )}

        <AddressInput
          value={elide(initialAddress, isMobile ? 20 : 8)}
          isReadonly={true}
          isEditable={false}
        />
      </div>

      <div className="flex gap-5 w-full md:pl-14 self-end">
        <FormButton type="button" className="flex-1">
          view history{" "}
        </FormButton>
      </div>
    </div>
  );
}
