import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavTabs = ({
  tabs,
}: {
  tabs: { label: string; link: string }[];
}) => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 sm:sticky dark:bg-reskin-dark-gray w-full bg-white">
      <div className="flex h-20 flex-row justify-between items-center w-full sm:mx-auto max-w-5xl relative z-10">
        {tabs.map((tab, index) => {
          const [, tabNameSpace] = tab.link.replace("/reskin", "").split("/");
          const [, pathNameSpace] = pathname.replace("/reskin", "").split("/");

          const isActive = pathNameSpace === tabNameSpace;
          return (
            <Link
              className={`h-full uppercase flex-1 flex justify-center items-center ${isActive ? "border-t-orange sm:border-b-orange dark:border-t-dark-reskin-orange font-bold dark:sm:border-b-dark-reskin-orange" : "border-t-transparent sm:border-b-[#D9D9D9]"} border-t-4 sm:border-b-4 sm:border-t-0 sm:bottom-auto`}
              key={index}
              href={tab.link}
              prefetch={true}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <hr className="hidden sm:block w-full border-t-light-reskin-border-gray dark:border-t-dark-reskin-border-gray relative bottom-1" />
    </div>
  );
};
