import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "Deposit",
    link: "/reskin",
  },
  {
    label: "Withdraw",
    link: "/reskin/withdraw",
  },
  {
    label: "History",
    link: "/reskin/history",
  },
];
export const NavTabs = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 sm:sticky dark:bg-reskin-dark-gray w-full">
      <div className="flex h-20 flex-row justify-between items-center w-full sm:mx-auto max-w-5xl relative z-10">
        {tabs.map((tab, index) => (
          <Link
            className={`h-full uppercase flex-1 flex justify-center items-center ${pathname === tab.link ? "border-t-orange sm:border-b-orange dark:border-t-dark-reskin-orange font-bold dark:sm:border-b-dark-reskin-orange" : "border-t-transparent sm:border-b-transparent"} border-t-4 sm:border-b-4 sm:border-t-0 sm:bottom-auto`}
            key={index}
            href={tab.link}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <hr className="hidden sm:block w-full border-t-light-reskin-border-gray dark:border-t-dark-reskin-border-gray relative bottom-1" />
    </div>
  );
};
