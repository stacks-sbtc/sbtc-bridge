import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HistoryNav } from "./history-nav";
import { useQuery } from "@tanstack/react-query";
import { getAllHistory } from "@/actions/get-all-history";
import {
  getDepositsHistory,
  type Deposit,
} from "@/actions/get-deposits-history";
import {
  getWithdrawalsHistory,
  type Withdrawal,
} from "@/actions/get-withdrawals-history";
import { useAtomValue } from "jotai";
import { walletInfoAtom } from "@/util/atoms";
import { formatBTC } from "@/app/_withdraw/components/util/validate-withdraw-amount";
import { LoadingRow } from "./loading-state";

import { ArrowUpRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { getStacksTxTime } from "@/actions/get-stacks-tx-time";
import { Skeleton } from "@/components/ui/skeleton";
import { getRawTransaction } from "@/actions/bitcoinClient";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

function getStatusDescription(status: string): string {
  if (!status || status === "pending") return "pending";

  if (status == "confirmed") return "complete";

  return status; // return "accepted", "failed" as is
}

function MobileStatus({ status }: { status: string }) {
  const statusDescription = getStatusDescription(status);
  let statusColor = "text-confetti";
  if (statusDescription == "complete") statusColor = "text-chateau-green";
  else if (statusDescription == "failed") statusColor = "text-red-500";

  return (
    <TableCell className="dark:text-midGray">
      <div
        className={`flex items-center font-medium capitalize ${statusColor}`}
      >
        {statusDescription}
        <ArrowUpRight className="h-6 w-6 ml-1" />
      </div>
    </TableCell>
  );
}

function DesktopStatus({ type, data }: HistoryItem) {
  const isConfirmed = data.status === "confirmed";
  const statusDescription = getStatusDescription(data.status);
  const { data: timestamp } = useQuery({
    queryKey: [
      "blocktime",
      type,
      type === HistoryType.DEPOSIT ? data.bitcoinTxid : data.txid,
    ],
    queryFn: async () => {
      if (type === HistoryType.DEPOSIT) {
        const tx = await getRawTransaction(data.bitcoinTxid);
        const timestamp = tx?.status.block_time || null;
        return timestamp
          ? formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true })
          : null;
      }
      const timestamp = await getStacksTxTime(data.txid);
      return formatDistanceToNow(new Date(timestamp * 1000), {
        addSuffix: true,
      });
    },
  });

  return (
    <TableCell className="dark:text-midGray hidden md:table-cell uppercase ">
      {isConfirmed ? (
        timestamp ? (
          timestamp
        ) : (
          <Skeleton className="w-4 h-2" />
        )
      ) : (
        statusDescription
      )}
    </TableCell>
  );
}

enum HistoryType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdraw",
}
type HistoryItem =
  | { type: HistoryType.DEPOSIT; data: Deposit }
  | { type: HistoryType.WITHDRAWAL; data: Withdrawal };

function HistoryEntry(props: HistoryItem) {
  const { type, data } = props;
  const amountPostFix =
    type === HistoryType.DEPOSIT ? "BTC -> sBTC" : "sBTC -> BTC";
  const amount = formatBTC(data.amount / 1e8);

  let link =
    type === HistoryType.DEPOSIT
      ? `/${data.bitcoinTxid}`
      : `/withdraw/${data.txid}`;
  const isMobile = useIsMobile();
  return (
    <Link href={link} className="contents">
      <TableRow className="font-matter-mono h-16 border-y border-light-reskin-border-gray dark:border-dark-reskin-border-gray cursor-pointer">
        <TableCell className="dark:text-midGray w-1/2 md:w-44 p-0 pl-4">
          {amount} {amountPostFix}
        </TableCell>
        <TableCell className="dark:text-midGray uppercase md:w-44">
          {type}
        </TableCell>
        {isMobile ? (
          <MobileStatus status={data.status} />
        ) : (
          <DesktopStatus {...props} />
        )}
        <TableCell className="dark:text-midGray hidden md:table-cell uppercase underline">
          Open {"->"}
        </TableCell>
      </TableRow>
    </Link>
  );
}

export function HistoryTable() {
  const { addresses } = useAtomValue(walletInfoAtom);
  const stxAddress = addresses.stacks?.address;
  const btcAddress = addresses.payment?.address;
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "all";

  const { data, isLoading } = useQuery({
    queryKey: ["history", currentTab, stxAddress, btcAddress],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let reclaimPubkeys: string[] = [];
      if (addresses.payment?.publicKey) {
        reclaimPubkeys.push(addresses.payment.publicKey.slice(2));
      }
      if (addresses.musig?.users) {
        reclaimPubkeys = addresses.musig.users.map((a) => a.publicKey.slice(2));
      }

      if (currentTab === "all") {
        const data = await getAllHistory({
          reclaimPubkeys,
          senderStxAddress: stxAddress!,
        });
        return [
          ...data.depositHistory.map((item) => ({
            data: item,
            type: HistoryType.DEPOSIT,
          })),
          ...data.withdrawalHistory.map((item) => ({
            data: item,
            type: HistoryType.WITHDRAWAL,
          })),
        ].sort(
          (a, b) => b.data.lastUpdateHeight - a.data.lastUpdateHeight,
        ) as HistoryItem[];
      }
      if (currentTab === "deposit") {
        const data = await getDepositsHistory(reclaimPubkeys);
        return [
          ...data.map((item) => ({
            data: item,
            type: HistoryType.DEPOSIT,
          })),
        ].sort(
          (a, b) => b.data.lastUpdateHeight - a.data.lastUpdateHeight,
        ) as HistoryItem[];
      }
      if (currentTab === "withdraw") {
        const data = await getWithdrawalsHistory(stxAddress);
        return [
          ...data.map((item) => ({
            data: item,
            type: HistoryType.WITHDRAWAL,
          })),
        ].sort(
          (a, b) => b.data.lastUpdateHeight - a.data.lastUpdateHeight,
        ) as HistoryItem[];
      }
    },
    enabled: () => {
      // Asigna and fordefi force this condition since
      // fordefi might have one or the other or both
      // and asigna can only have one or the other
      return Boolean(stxAddress || btcAddress);
    },
  });

  const loadingRows = Array.from({ length: 4 }, (item, index) => (
    <LoadingRow key={index} />
  ));

  return (
    <div className="max-w-5xl w-full md:border-[3px] border-midGray dark:border-opacity-20 dark:border-white rounded-2xl md:px-10 md:pt-9">
      <HistoryNav />
      <ScrollArea className="md:h-[450px]">
        <Table>
          <TableHeader className="uppercase font-matter-mono">
            <TableRow className="pointer-events-none">
              <TableHead className="text-sm md:p-0">transaction</TableHead>
              <TableHead className="text-sm">type</TableHead>
              <TableHead className="text-sm">status</TableHead>
              <TableHead className="text-sm hidden md:table-cell">
                action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && loadingRows}
            {data &&
              data.map((item, index) => (
                <HistoryEntry
                  key={`${item.type}-${item.data.lastUpdateHeight}${index}`}
                  {...item}
                />
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
