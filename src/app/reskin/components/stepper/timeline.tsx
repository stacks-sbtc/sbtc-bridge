"use client";
import * as React from "react";
import { defineStepper } from "@stepperize/react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LoadingIndicator } from "../../assets/loading-indicator";

const { useStepper, steps, utils } = defineStepper(
  {
    id: "amount",
    title: "Select Withdrawal Amount",
    description:
      "How much BTC are you transferring over to sBTC? Enter an amount that’s above the dust requirement (546 sats)",
  },
  {
    id: "address",
    title: "Provide a Deposit Address",
    description:
      "sBTC will be sent to a STX address. Connecting a wallet will auto-fill this in, but feel free to submit another address.",
  },
  {
    id: "status",
    title: "Operation Status:",
    description: (
      <>
        We will confirm the transaction status once the transaction is
        confirmed.
        <div className="flex flex-col items-center justify-center mt-4">
          <LoadingIndicator />
          {/* tracking-[-0.02em] */}
          <div className="h-8 flex items-center text-xl leading-normal text-center text-reskin-dark-gray dark:text-midGray uppercase mt-2">
            Processing
          </div>
          <div className="">
            ( Estimation{" "}
            <a
              href="#"
              className="text-orange dark:text-dark-reskin-orange hover:underline"
            >
              5min
            </a>{" "}
            )
          </div>
        </div>
      </>
    ),
  },
);

function StepTitle({
  step,
  currentIndex,
  index,
  stepper,
}: {
  step: (typeof steps)[number];
  currentIndex: number;
  index: number;
  stepper: ReturnType<typeof useStepper>;
}) {
  return (
    <li className="flex items-center gap-4 flex-shrink-0">
      <span
        onClick={() => stepper.goTo(step.id)}
        className={`flex text-xs size-6 items-center justify-center rounded-full ${
          index <= currentIndex
            ? "bg-orange dark:bg-dark-reskin-orange text-timeline-active-step-text"
            : "bg-timeline-inactive-gray text-timeline-inactive-step-text"
        }`}
      >
        {index + 1}
      </span>
      <span className="text-sm font-medium leading-tight">{step.title}</span>
    </li>
  );
}

function StepContent({
  step,
  currentIndex,
  index,
}: {
  step: (typeof steps)[number];
  currentIndex: number;
  index: number;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="flex justify-center"
        style={{
          paddingInlineStart: "0.75rem",
        }}
      >
        <Separator
          orientation="vertical"
          className={`w-[1px] h-[calc(100%+.65rem)] relative bottom-1 ${
            index <= currentIndex
              ? "bg-orange dark:bg-dark-reskin-orange"
              : "bg-timeline-inactive-gray"
          }`}
        />
      </div>
      <div className="flex-1 text-xs leading-tight text-black dark:text-white text-opacity-60 ml-3 max-w-52">
        {step.description}
      </div>
    </div>
  );
}

function DepositTimeline() {
  const stepper = useStepper();

  const currentIndex = utils.getIndex(stepper.current.id);
  React.useEffect(() => {
    stepper.goTo("address");
  }, []);
  return (
    <div className="pt-6 pb-10 px-8 border rounded-2xl border-black border-opacity-20 dark:border-white dark:border-opacity-20 w-96">
      <h2 className="uppercase text-xl leading-normal text-timeline-active-step-text dark:text-white">
        Timeline
      </h2>
      <ol className="mt-4 flex flex-col gap-3">
        {stepper.all.map((step, index) => (
          <div className="flex flex-col gap-1" key={step.id}>
            <StepTitle
              step={step}
              index={index}
              stepper={stepper}
              currentIndex={currentIndex}
            />
            <StepContent
              step={step}
              index={index}
              currentIndex={currentIndex}
            />
          </div>
        ))}
      </ol>
    </div>
  );
}

export default DepositTimeline;
