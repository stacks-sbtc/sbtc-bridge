"use client";
import { Step, Stepper } from "@stepperize/react";
import { Separator } from "@/components/ui/separator";

export function StepTitle<T extends Step[]>({
  step,
  currentIndex,
  index,
  stepper,
}: {
  step: T[number];
  currentIndex: number;
  index: number;
  stepper: Stepper<T>;
}) {
  return (
    <li className="flex items-center gap-4 flex-shrink-0">
      <span
        onClick={() => stepper.goTo(step.id)}
        className={`flex text-xs size-6 items-center justify-center rounded-full ${
          index <= currentIndex
            ? "bg-orange dark:bg-dark-reskin-orange text-timeline-active-step-text"
            : "bg-timeline-inactive-gray text-timeline-inactive-step-text dark:bg-dark-reskin-dark-gray dark:text-dark-timeline-inactive-step-text"
        }`}
      >
        {index + 1}
      </span>
      <span className="text-sm font-medium leading-tight">{step.title}</span>
    </li>
  );
}

export function StepContent({
  step,
  currentIndex,
  index,
}: {
  step: {
    id: string;
    title: string;
    description: ({}: {}) => React.ReactNode;
  };
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
      <div className="flex-1 text-xs leading-tight ml-3 max-w-52">
        <step.description />
      </div>
    </div>
  );
}
