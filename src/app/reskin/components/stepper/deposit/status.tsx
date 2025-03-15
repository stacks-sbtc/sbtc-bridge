import { LoadingIndicator } from "../../../assets/loading-indicator";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Stepper } from "@stepperize/react";

function HyperLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="text-orange dark:text-dark-reskin-orange hover:underline"
    >
      {children}
    </a>
  );
}

function TxPendingStatus() {
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <LoadingIndicator />
      <div className="h-8 flex items-center text-xl leading-normal tracking-[-0.02em] text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2">
        Processing
      </div>
      <div>
        ( Estimation{" "}
        <HyperLink href="https://mempool.space/tx/4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b">
          5min
        </HyperLink>{" "}
        )
      </div>
    </div>
  );
}

function TxCompleteStatus() {
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <CheckCircleIcon className="h-8 w-8 text-green-500 dark:text-green-700" />
      <div className="h-8 flex items-center text-xl leading-normal tracking-[-0.02em] text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2">
        Completed
      </div>
      <div>
        <HyperLink href="https://mempool.space/tx/4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b">
          mempool tx
        </HyperLink>
      </div>
    </div>
  );
}

export function StatusDescription({ stepper }: { stepper: Stepper }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const isCurrentStep = stepper.current.id === "status";
  useEffect(() => {
    if (isCurrentStep) {
      const interval = setInterval(() => {
        // this is just for demo
        setIsCompleted((prev) => !prev);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isCurrentStep]);
  return !isCurrentStep ? (
    <span className="opacity-60">
      We will confirm the transaction status once the transaction is confirmed.
    </span>
  ) : isCompleted ? (
    <TxCompleteStatus />
  ) : (
    <TxPendingStatus />
  );
}
