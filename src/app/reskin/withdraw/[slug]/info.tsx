import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useWithdrawalInfo } from "../hooks/use-withdrawal-info";
import { AmountInput } from "../components/form/amount-input";
import { AddressInput } from "../components/form/address-input";
import { FormButton } from "../../components/form-button";
import { withdrawStepper } from "../components/stepper";
import Link from "next/link";
const { useStepper } = withdrawStepper;

export function WithdrawInfo() {
  const { slug: withdrawTxId } = useParams<{ slug: string }>();
  const stepper = useStepper();

  const {
    data: { address, amount },
  } = useWithdrawalInfo({ txid: withdrawTxId });
  useEffect(() => {
    stepper.goTo("status");
  }, [stepper]);

  const initialAmount = useMemo(() => {
    if (amount) {
      return (amount / 1e8).toLocaleString(undefined, {
        maximumFractionDigits: 8,
      });
    }
    return "";
  }, [amount]);

  return (
    <div className="flex flex-col justify-center items-center md:justify-normal gap-2 w-full px-6 lg:w-1/2 max-w-xl flex-1">
      <div
        className={`flex flex-col gap-2 flex-1 justify-center md:justify-normal w-full h-full`}
      >
        <AmountInput
          value={initialAmount && `${initialAmount} sBTC`}
          isReadonly={true}
          isEditable={false}
        />

        <AddressInput value={address} isReadonly={true} isEditable={false} />
      </div>

      <div className="flex gap-5 w-full md:pl-14 self-end">
        <Link href="/reskin/history" className="flex-1">
          <FormButton type="button" className="w-full">
            view history
          </FormButton>
        </Link>
      </div>
    </div>
  );
}
