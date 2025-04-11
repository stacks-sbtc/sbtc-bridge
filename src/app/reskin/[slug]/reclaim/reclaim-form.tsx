import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { reclaimStepper } from "./components/stepper";
import { useReskinDepositStatus } from "../../hooks/use-reskin-deposit-status";
import { FormButton } from "../../components/form-button";
import { useSubmitReclaim } from "./hooks/useSubmitReclaim";
import { InputContainer } from "../../components/forms/form-elements/input-container";
import { useAtomValue } from "jotai";
import { walletInfoAtom } from "@/util/atoms";
import { elide } from "@/util";

const { useStepper } = reclaimStepper;

export function ReclaimForm() {
  const { slug: depositTxId } = useParams<{ slug: string }>();
  const stepper = useStepper();

  const { bitcoinTxInfo } = useReskinDepositStatus(depositTxId);
  const {
    addresses: { payment },
  } = useAtomValue(walletInfoAtom);

  const searchParams = useSearchParams();
  const reclaimTxId = searchParams.get("reclaim_tx_id");

  useEffect(() => {
    if (reclaimTxId) {
      stepper.goTo("status");
    }
  }, [reclaimTxId, searchParams, stepper]);

  const { mutate } = useSubmitReclaim(depositTxId);

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
        <InputContainer
          isReadonly={true}
          isEditable={false}
          title="Amount to reclaim"
          readonlyValue={initialAmount && `${initialAmount} BTC`}
        />

        <InputContainer
          isReadonly={true}
          isEditable={false}
          title="Address to reclaim to"
          readonlyValue={elide(payment?.address || "", 10)}
        />
      </div>

      <div className="flex gap-5 w-full md:pl-14 self-end">
        {stepper.current.id === "submit" && (
          <FormButton type="button" onClick={mutate} className="flex-1">
            submit reclaim
          </FormButton>
        )}

        {stepper.current.id === "status" && (
          <FormButton type="button" className="flex-1">
            view history
          </FormButton>
        )}
      </div>
    </div>
  );
}
