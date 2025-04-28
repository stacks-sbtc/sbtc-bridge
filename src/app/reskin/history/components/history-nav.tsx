import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const NavButton = ({
  type,
  currentTab,
  onClick,
}: {
  type: string;
  currentTab: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-24 h-16 rounded-lg font-matter-mono uppercase transition-colors ${currentTab === type ? "bg-orange dark:bg-dark-reskin-orange bg-opacity-20 dark:bg-opacity-20 text-orange dark:text-dark-reskin-orange" : "dark:text-midGray"}`}
    >
      {type}
    </button>
  );
};

const tabs = ["all", "deposit", "withdraw"];

const Nav = () => {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "all";
  const changeActiveTab = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", value);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };
  return isMobile ? (
    <Select onValueChange={changeActiveTab} value={currentTab}>
      <SelectTrigger className="w-auto min-w-20 h-11 dark:bg-ship-gray capitalize rounded-3xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {tabs.map((tab) => (
          <SelectItem key={tab} value={tab} className="capitalize">
            {tab}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <div className="flex gap-3">
      {tabs.map((tab) => (
        <NavButton
          key={tab}
          type={tab}
          currentTab={currentTab}
          onClick={() => changeActiveTab(tab)}
        />
      ))}
    </div>
  );
};

export const HistoryNav = () => {
  return (
    <div className="flex px-4 h-20 md:h-auto md:px-0 items-center justify-between md:mb-5">
      <h1 className="capitalize text-2xl dark:text-alabastar">
        your transactions
      </h1>
      <Nav />
    </div>
  );
};
