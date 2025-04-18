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
import type { Deposit } from "@/actions/get-deposits-history";
import type { Withdrawal } from "@/actions/get-withdrawals-history";
import { useAtomValue } from "jotai";
import { walletInfoAtom } from "@/util/atoms";
import { formatBTC } from "@/app/withdraw/components/util/validate-withdraw-amount";
import { LoadingRow } from "./loading-state";

import { ArrowUpRight } from "lucide-react";

enum HistoryType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdraw",
}
type HistoryItem =
  | { type: HistoryType.DEPOSIT; data: Deposit }
  | { type: HistoryType.WITHDRAWAL; data: Withdrawal };

function HistoryEntry({ data, type }: HistoryItem) {
  const amountPostFix =
    type === HistoryType.DEPOSIT ? "BTC -> sBTC" : "sBTC -> BTC";
  const amount = formatBTC(data.amount / 1e8);
  const isConfirmed = data.status === "confirmed";
  return (
    <TableRow className="font-matter-mono h-16 border-y border-light-reskin-border-gray dark:border-dark-reskin-border-gray">
      <TableCell className="dark:text-midGray w-44 p-0 pl-4">
        {amount} {amountPostFix}
      </TableCell>
      <TableCell className="dark:text-midGray uppercase">{type}</TableCell>
      <TableCell className="dark:text-midGray">
        <div
          className={`flex items-center font-medium ${isConfirmed ? "text-chateau-green" : "text-confetti"}`}
        >
          {isConfirmed ? "Complete" : "Pending"}
          <ArrowUpRight className="h-6 w-6 ml-1" />
        </div>
      </TableCell>
      <TableCell className="dark:text-midGray hidden md:table-cell">
        Open
      </TableCell>
    </TableRow>
  );
}

export function HistoryTable() {
  const { addresses } = useAtomValue(walletInfoAtom);
  const stxAddress = addresses.stacks?.address;

  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let reclaimPubkeys = [addresses.payment!.publicKey.slice(2)];
      if (addresses.musig?.users) {
        reclaimPubkeys = addresses.musig.users.map((a) => a.publicKey.slice(2));
      }
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
    },
    enabled: () => {
      return Boolean(stxAddress && addresses.payment?.address);
    },
  });

  const loadingRows = Array.from({ length: 4 }, (item, index) => (
    <LoadingRow key={index} />
  ));

  return (
    <div className="max-w-5xl w-full">
      <HistoryNav />
      <Table>
        <TableHeader className="uppercase font-matter-mono">
          <TableRow>
            <TableHead className="text-sm">transaction</TableHead>
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
            data.map((item) => (
              <HistoryEntry key={item.data.lastUpdateHeight} {...item} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
