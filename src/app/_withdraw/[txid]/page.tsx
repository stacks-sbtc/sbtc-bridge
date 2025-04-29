"use server";
import OldLayout from "../../old-layout";
import TrackWithdrawalStatus from "./components/withdrawal-status";

export default async function WithdrawalStatusPage({
  params,
}: {
  params: Promise<{ txid: string }>;
}) {
  const { txid } = await params;

  return (
    <OldLayout>
      <TrackWithdrawalStatus txid={txid} />
    </OldLayout>
  );
}
