import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

export const Footer = () => {
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
