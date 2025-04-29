import Link from "next/link";

export const EmptyDeposits = () => {
  return (
    <div className="flex flex-col w-48 items-center">
      <h2 className="text-center text-2xl dark:text-alabastar mb-4">
        No activity yet
      </h2>
      <p className="text-center text-lg opacity-40 dark:opacity-20 mb-10">
        Start depositing to see your transactions
      </p>
      <Link
        href="/"
        className="flex items-center justify-center bg-orange text-black dark:text-reskin-dark-gray dark:bg-dark-reskin-orange uppercase h-10 w-40 font-matter-mono rounded-lg tracking-tight"
      >
        deposit
      </Link>
    </div>
  );
};
