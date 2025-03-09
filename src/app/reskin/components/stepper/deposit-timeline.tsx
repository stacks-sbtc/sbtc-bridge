"use client";
import { StepContent, StepTitle } from "./timeline";
import { defineStepper } from "@stepperize/react";

import { AmountDescription } from "./deposit/amount";
import { StatusDescription } from "./deposit/status";
import { useMediaQuery } from "@/hooks/use-media-query";

function AddressDescription({}) {
  return (
    <span className="opacity-60">
      sBTC will be sent to a STX address. Connecting a wallet will auto-fill
      this in, but feel free to submit another address.
    </span>
  );
}

const { useStepper, utils } = defineStepper(
  {
    id: "amount",
    title: "Select Deposit Amount",
    description: AmountDescription,
  },
  {
    id: "address",
    title: "Provide a Deposit Address",
    description: AddressDescription,
  },
  {
    id: "status",
    title: "Operation Status:",
    description: StatusDescription,
  },
);

function DepositTimeline() {
  const stepper = useStepper();

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    isDesktop && (
      <div className="pt-6 pb-10 px-8 border rounded-2xl border-black border-opacity-20 dark:border-white w-96">
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
    )
  );
}

export default DepositTimeline;
