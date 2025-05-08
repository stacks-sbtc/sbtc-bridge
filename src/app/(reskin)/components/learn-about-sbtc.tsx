import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

export const LearnAboutSBTC = () => {
  return (
    <div className="flex w-full">
      <div className="w-full pt-6 pb-4 pl-3">
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
          <p className="text-darkGray font-light">
            Enter into the world of sBTC with these resources
          </p>
        </a>
      </div>
    </div>
  );
};
