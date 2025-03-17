"use client";
import { StepContent, StepTitle } from "./timeline";
import { depositStepper } from "./deposit/util";
import { useIsMobile } from "@/hooks/use-is-mobile";

const { useStepper, utils } = depositStepper;

export function DepositTimeline() {
  const stepper = useStepper();

  const isDesktop = !useIsMobile();
  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    isDesktop && (
      <div className="pt-6 pb-10 px-8 border rounded-2xl border-black border-opacity-20 dark:border-white w-96">
        <h2 className="uppercase text-xl leading-normal text-timeline-active-step-text dark:text-white font-matter-mono">
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
