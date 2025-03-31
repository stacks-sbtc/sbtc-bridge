import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { getEmilyDepositInfo } from "@/util/tx-utils";
import { bridgeConfigAtom } from "@/util/atoms";
import {
  getCurrentBlockHeight,
  getRawTransaction,
  getTxRbf,
} from "@/actions/bitcoinClient";
import { Cl, PrincipalCV } from "@stacks/transactions";
import { useEmilyDeposit } from "@/util/use-emily-deposit";
import { queryClient } from "@/query/client";
import { useQuery } from "@tanstack/react-query";
import { DepositStatus } from "@/hooks/use-deposit-status";

// Better logic for better ui
// you might ask: why not use the same logic as useDepositStatus?
// cuz we can do better! and we shouldn't modify the original logic
// since it might break
export function useReskinDepositStatus(txId?: string) {
  const { notifyEmily } = useEmilyDeposit();
  const { RECLAIM_LOCK_TIME, POLLING_INTERVAL } =
    useAtomValue(bridgeConfigAtom);

  const [transferTxStatus, setStatus] = useState(
    DepositStatus.PendingConfirmation,
  );

  const { data: currentBlockHeight } = useQuery({
    queryKey: ["current-block-height"],
    queryFn: async () => {
      return getCurrentBlockHeight();
    },
    refetchInterval: () => {
      const isPending =
        transferTxStatus !== DepositStatus.Completed &&
        transferTxStatus !== DepositStatus.Failed;
      // keep polling until the deposit is completed or failed
      if (isPending) {
        return POLLING_INTERVAL;
      }
      return false;
    },
    enabled: !!txId,
  });

  const { data: emilyDepositInfo } = useQuery({
    queryKey: ["emily-deposit-info", txId],

    queryFn: async () => {
      if (!txId) {
        throw new Error("txId is required");
      }

      const depositInfo = await getEmilyDepositInfo({
        txId,
      });

      if (depositInfo.status === DepositStatus.Completed) {
        queryClient.invalidateQueries({ queryKey: ["sbtc-balance"] });
      }
      return depositInfo;
    },
    refetchInterval: (query) => {
      const isPending =
        query.state.data?.status !== DepositStatus.Completed &&
        transferTxStatus !== DepositStatus.Failed;
      if (isPending) {
        return POLLING_INTERVAL;
      }
      return false;
    },
    enabled: !!txId,
  });

  const { data: bitcoinTxInfo } = useQuery({
    queryKey: ["bitcoin-tx-info", txId],
    queryFn: async () => {
      if (!txId || !emilyDepositInfo) {
        throw new Error("txId and emilyDepositInfo required");
      }
      const info = await getRawTransaction(txId);

      // rbf handling
      if (!info) {
        const rbf = await getTxRbf(txId);
        const rbfTxId = (rbf as any).replacements.tx.txid;

        const emilyReqPayload = {
          bitcoinTxid: rbfTxId as string,
          bitcoinTxOutputIndex: 0,
          reclaimScript: emilyDepositInfo.reclaimScript,
          depositScript: emilyDepositInfo.depositScript,
        };
        await notifyEmily(emilyReqPayload);
      }

      return info;
    },
    refetchInterval: (query) => {
      const isConfirmed = query.state.data?.status.confirmed;
      // stop polling if tx is confirmed
      if (isConfirmed) {
        return false;
      }
      return POLLING_INTERVAL;
    },
    enabled: !!txId && !!emilyDepositInfo,
  });

  const recipient = useMemo(() => {
    return emilyDepositInfo?.recipient || "";
  }, [emilyDepositInfo]);

  const stacksTxId = useMemo(() => {
    return (
      (emilyDepositInfo?.status === DepositStatus.Completed &&
        emilyDepositInfo.fulfillment.StacksTxid) ||
      ""
    );
  }, [emilyDepositInfo]);

  useEffect(() => {
    if (!bitcoinTxInfo || !emilyDepositInfo || !currentBlockHeight) {
      return;
    }
    // emily only returns pending, accepted, completed
    // if is pending then check if it's past lock time
    // if it isn't then status will remain pending
    if (emilyDepositInfo.status !== DepositStatus.PendingConfirmation) {
      return setStatus(emilyDepositInfo.status as DepositStatus);
    }
    if (bitcoinTxInfo.status.confirmed) {
      const unlockBlock =
        Number(RECLAIM_LOCK_TIME || 144) +
        bitcoinTxInfo.status.block_height -
        1;

      const isPastLockTime = currentBlockHeight >= unlockBlock;
      if (isPastLockTime) {
        setStatus(DepositStatus.Failed);
      }
    }
  }, [RECLAIM_LOCK_TIME, bitcoinTxInfo, currentBlockHeight, emilyDepositInfo]);

  return {
    status: transferTxStatus,
    recipient: recipient && (Cl.deserialize(recipient) as PrincipalCV).value,
    stacksTxId,
    bitcoinTxInfo,
  };
}
