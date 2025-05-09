import { useIsMobile } from "@/hooks/use-is-mobile";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

const DesktopFooter = () => {
  return (
    <div className="hidden md:flex shadow-[0_-4px_28px_0_rgba(0,0,0,0.13)] justify-center dark:bg-dark-reskin-border-gray">
      <div className="w-full max-w-7xl pt-11 pb-14 pl-14">
        <a
          href="https://docs.stacks.co/concepts/sbtc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-4"
        >
          <h2 className="text-4xl leading-10 tracking-tight flex gap-4">
            Learn more about sBTC
            <ArrowUpRightIcon className="w-6 text-orange dark:text-dark-reskin-orange" />
          </h2>
          <p className="text-darkGray dark:text-white font-light">
            Enter into the world of sBTC with these resources
          </p>
        </a>
      </div>
    </div>
  );
};

const MobileFooter = () => {
  return (
    <div className="px-6 py-6 w-full max-w-xl">
      <a
        href="https://docs.stacks.co/concepts/sbtc"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col"
      >
        <h2 className="text-lg flex gap-2">
          Learn more about sBTC
          <ArrowUpRightIcon className="w-4 text-orange dark:text-dark-reskin-orange" />
        </h2>
        <p className="text-darkGray dark:text-midGray font-light">
          Enter into the world of sBTC with these resources
        </p>
      </a>
    </div>
  );
};

export const Footer = () => {
  const isMobile: boolean = useIsMobile();
  return <>{isMobile ? <MobileFooter /> : <DesktopFooter />}</>;
};
