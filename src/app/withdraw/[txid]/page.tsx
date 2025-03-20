"use server";
import OldLayout from "../../old-layout";
import TrackWithdrawalStatus from "./components/withdrawal-status";
import { getWithdrawalInfo } from "@/actions/get-withdrawal-data";

export default async function WithdrawalStatusPage({
  params,
}: {
  params: Promise<{ txid: string }>;
}) {
  const { txid } = await params;

  const result = await getWithdrawalInfo(txid);

  return (
    <OldLayout>
      <TrackWithdrawalStatus
        status={result.status}
        txid={txid}
        stacksTx={result.stacksTx}
        bitcoinTx={result.bitcoinTx}
        btcAmount={result.amount}
        recipient={result.address}
      />
    </OldLayout>
  );
}
