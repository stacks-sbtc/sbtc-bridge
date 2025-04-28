import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const NavTabs = ({
  tabs,
}: {
  tabs: { label: string; link: string }[];
}) => {
  const pathname = usePathname();
  const params = useParams();
  return (
    <div className="fixed bottom-0 md:sticky bg-white dark:bg-reskin-dark-gray w-full z-10 md:z-0">
      <div className="flex h-20 flex-row justify-between items-center w-full md:mx-auto max-w-5xl relative z-10 md:z-0">
        {tabs.map((tab, index) => {
          let [, tabNameSpace] = tab.link.replace("/reskin", "").split("/");
          let [, pathNameSpace] = pathname.replace("/reskin", "").split("/");

          tabNameSpace = tabNameSpace || "";
          pathNameSpace = pathNameSpace || "";

          pathNameSpace =
            pathNameSpace.replace(params.slug as string, "") || "";

          const isActive = pathNameSpace === tabNameSpace;
          return (
            <Link
              className={`font-matter-mono h-full uppercase flex-1 flex justify-center items-center ${isActive ? "border-t-orange md:border-b-orange dark:border-t-dark-reskin-orange font-bold dark:md:border-b-dark-reskin-orange" : "border-t-transparent md:border-b-[#D9D9D9]"} border-t-4 md:border-b-4 md:border-t-0 md:bottom-auto`}
              key={index}
              href={tab.link}
              prefetch={true}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <hr className="hidden md:block w-full border-t-light-reskin-border-gray dark:border-t-dark-reskin-border-gray relative bottom-1" />
    </div>
  );
};
