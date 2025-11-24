import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/* eslint-disable no-console -- TODO: remove console logging in follow-up */

const expBackoff = (attempt: number) => Math.min(2 ** attempt, 30) * 1000;
export const useEmilyDeposit = () => {
  const { mutateAsync, failureCount, isPending } = useMutation({
    mutationFn: async (params: {
      bitcoinTxid: string;
      bitcoinTxOutputIndex: number;
      reclaimScript: string;
      depositScript: string;
    }) => {
      console.log({ emilyReqPayloadClient: JSON.stringify(params) });
      const res = await fetch("/api/emilyDeposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        if (failureCount > 2) {
          toast.error("Error creating deposit. Retrying...");
        }
        throw res;
      }
      return res;
    },
    retryDelay: expBackoff,
    retry: true,
  });
  return { notifyEmily: mutateAsync, isPending };
};
