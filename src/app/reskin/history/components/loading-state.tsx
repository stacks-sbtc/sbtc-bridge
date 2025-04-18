import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

function LoadingCell({ className }: { className?: string }) {
  return (
    <TableCell className={`dark:text-midGray ${className}`}>
      <Skeleton className="w-20 h-4 bg-darkGray" />
    </TableCell>
  );
}

export function LoadingRow() {
  return (
    <TableRow className="h-16 border-y border-light-reskin-border-gray dark:border-dark-reskin-border-gray">
      <LoadingCell className="w-44" />
      <LoadingCell />
      <LoadingCell />
      <LoadingCell className="hidden md:table-cell" />
    </TableRow>
  );
}
