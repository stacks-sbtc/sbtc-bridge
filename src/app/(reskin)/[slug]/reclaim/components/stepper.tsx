import {
  TxCompleteStatus,
  TxFailedStatus,
  TxPendingStatus,
} from "@/app/(reskin)/components/stepper/deposit/status";
import { ReclaimStatus, useReclaimStatus } from "@/hooks/use-reclaim-status";
import { defineStepper, Stepper } from "@stepperize/react";
import { useSearchParams } from "next/navigation";
import { RECLAIM_TX_ID_SEARCH_KEY } from "../hooks/useSubmitReclaim";

function SubmitReclaim({}) {
  return (
    <span className="md:opacity-60 px-4 md:px-0">
      Please note that deposit will not be available for reclaiming until after
      enough blocks have passed from its locktime
    </span>
  );
}

function StatusDescription({ stepper }: { stepper: Stepper }) {
  const searchParams = useSearchParams();
  const reclaimTxId = searchParams.get(RECLAIM_TX_ID_SEARCH_KEY);

  const status = useReclaimStatus(reclaimTxId);
  const isCurrentStep = stepper.current.id === "status";

  return !isCurrentStep ? (
    <span className="opacity-60">
      We will confirm the transaction status once the transaction is confirmed.
    </span>
  ) : (
    <>
      {status === ReclaimStatus.Completed && (
        <TxCompleteStatus bitcoinTxId={reclaimTxId!} />
      )}
      {status === ReclaimStatus.Failed && (
        <TxFailedStatus bitcoinTxId={reclaimTxId!} />
      )}
      {status === ReclaimStatus.Pending && (
        <TxPendingStatus bitcoinTxId={reclaimTxId!} />
      )}
    </>
  );
}

export const reclaimStepper = defineStepper(
  {
    id: "submit",
    title: "Submit Reclaim",
    description: SubmitReclaim,
  },
  {
    id: "status",
    title: "Reclaim status",
    description: () => {
      const stepper = reclaimStepper.useStepper();
      return <StatusDescription stepper={stepper as any} />;
    },
  },
);
