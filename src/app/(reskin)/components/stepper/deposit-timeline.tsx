"use client";
import { StepContent, StepTitle } from "./timeline";
import { depositStepper } from "./deposit/util";
import { useIsMobile } from "@/hooks/use-is-mobile";

const { useStepper, utils } = depositStepper;

const MobileStepper = () => {
  const stepper = useStepper();
  const currentStep = stepper.current;
  const index = utils.getIndex(currentStep.id);
  return (
    <div className={`px-6 w-full flex flex-col gap-3 max-w-xl`}>
      <h1 className="dark:bg-dark-reskin-border-gray py-2 px-3 rounded-lg">
        <span className="font-matter-mono">{index + 1}.</span>{" "}
        {currentStep.title}
      </h1>
      <currentStep.description />
    </div>
  );
};

export function DepositTimeline() {
  const stepper = useStepper();

  const isDesktop = !useIsMobile();
  let currentIndex = utils.getIndex(stepper.current.id);

  if (currentIndex > utils.getIndex("address")) {
    currentIndex -= 1;
  }

  return isDesktop ? (
    <div className="pt-6 pb-10 px-8 border rounded-2xl border-black border-opacity-20 dark:border-white dark:border-opacity-20 lg:w-96">
      <h2 className="uppercase text-xl leading-normal text-timeline-active-step-text dark:text-white font-matter-mono">
        Timeline
      </h2>
      <ol className="mt-4 flex flex-col gap-3">
        {stepper.all
          .filter((step) => step.id !== "confirm")
          .map((step, index) => (
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
  ) : (
    <MobileStepper />
  );
}
