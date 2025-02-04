import { getRawTransaction } from "@/actions/bitcoinClient";
import { bridgeConfigAtom } from "@/util/atoms";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export enum ReclaimStatus {
  PendingConfirmation = "pending",
  PendingMint = "accepted",
  Completed = "confirmed",
  Failed = "Failed",
}

export const useReclaimStatus = (txId?: string) => {
  const { POLLING_INTERVAL } = useAtomValue(bridgeConfigAtom);
  // we'll need to fetch this from the bitcoin rpc to get the current status of the tx
  const [reclaimStatus, setReclaimStatus] = useState<ReclaimStatus>(
    ReclaimStatus.PendingConfirmation,
  );

  useEffect(() => {
    if (txId && reclaimStatus !== ReclaimStatus.Completed) {
      // fetch the status of the reclaim tx from the bitcoin rpc
      // and update the reclaimStatus
      const check = async () => {
        let status = ReclaimStatus.PendingMint;

        const reclaimTx = (await getRawTransaction(txId))!;

        if (reclaimTx.status.confirmed) {
          status = ReclaimStatus.Completed;
          clearInterval(interval);
        }

        setReclaimStatus(status);
      };
      check();
      const interval = setInterval(check, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [POLLING_INTERVAL, reclaimStatus, txId]);

  return reclaimStatus;
};
