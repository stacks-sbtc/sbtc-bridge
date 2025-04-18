import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const Nav = () => {
  const [value, setValue] = useState("all");

  return (
    <Select onValueChange={setValue} value={value}>
      <SelectTrigger className="w-auto min-w-20 h-11 dark:bg-ship-gray rounded-3xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="deposits">Deposit</SelectItem>
        <SelectItem value="withdraw">Withdraw</SelectItem>
      </SelectContent>
    </Select>
  );
};

export const HistoryNav = () => {
  return (
    <div className="flex h-20 items-center justify-between px-4">
      <h1 className="capitalize text-2xl dark:text-alabastar">
        your transactions
      </h1>
      <Nav />
    </div>
  );
};
