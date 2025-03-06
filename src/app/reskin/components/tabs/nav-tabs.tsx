import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "Deposit",
    link: "/reskin/deposit",
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
    <div className="flex flex-row justify-between items-center w-full fixed bottom-0 h-20 sm:sticky bg-reskin-dark-gray">
      {tabs.map((tab, index) => (
        <Link
          className={`h-full uppercase flex-1 flex justify-center items-center ${pathname === tab.link ? "border-t-dark-reskin-orange font-bold sm:border-b-dark-reskin-orange" : "border-t-transparent sm:border-b-transparent"} border-t-4 sm:border-b-4 sm:border-t-0 sm:bottom-auto`}
          key={index}
          href={tab.link}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};
