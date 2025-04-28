import { getWithdrawalInfo } from "@/actions/get-withdrawal-data";
import { WithdrawalStatus } from "@/app/withdraw/[txid]/components/util";
import { useQuery } from "@tanstack/react-query";

export function useWithdrawalInfo({ txid }: { txid: string }) {
  return useQuery({
    queryKey: ["withdrawal", txid],
    queryFn: async () => {
      const data = await getWithdrawalInfo(txid);
      return data;
    },
    initialData: {
      status: WithdrawalStatus.pending,
      address: "",
      amount: 0,
      stacksTx: "",
      bitcoinTx: "",
      requestId: null,
    },
    refetchInterval: ({ state }) => {
      const status = state.data?.status;
      if (
        status === WithdrawalStatus.failed ||
        status === WithdrawalStatus.confirmed
      ) {
        return false;
      }
      return 5000;
    },
    enabled: !!txid,
  });
}
