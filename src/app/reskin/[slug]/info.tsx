import { FormButton } from "../components/form-button";
import { AddressInput } from "../components/forms/deposit/address-input";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { AmountInput } from "../components/forms/deposit/amount-input";

import { depositStepper } from "../components/stepper/deposit/util";
import { useReskinDepositStatus } from "../hooks/use-reskin-deposit-status";
import { DepositStatus } from "@/hooks/use-deposit-status";
import Link from "next/link";
const { useStepper } = depositStepper;

export function DepositInfo() {
  const { slug: depositTxId } = useParams<{ slug: string }>();
  const stepper = useStepper();

  const { recipient, bitcoinTxInfo, status } =
    useReskinDepositStatus(depositTxId);
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

  return (
    <div className="flex flex-col justify-center items-center md:justify-normal gap-2 w-full px-6 lg:w-1/2 max-w-xl flex-1">
      <div
        className={`flex flex-col gap-2 flex-1 justify-center md:justify-normal w-full h-full`}
      >
        <AmountInput
          value={initialAmount && `${initialAmount} BTC`}
          isReadonly={true}
          isEditable={false}
        />

        <AddressInput value={recipient} isReadonly={true} isEditable={false} />
      </div>

      <div className="flex gap-5 w-full md:pl-14 self-end">
        {status === DepositStatus.Failed ? (
          <Link href={`/reskin/${depositTxId}/reclaim`} className="flex-1 flex">
            <FormButton type="button" className="flex-1">
              Reclaim
            </FormButton>
          </Link>
        ) : (
          <Link href="/reskin/history" className="flex-1">
            <FormButton type="button" className="w-full">
              view history
            </FormButton>
          </Link>
        )}
      </div>
    </div>
  );
}
