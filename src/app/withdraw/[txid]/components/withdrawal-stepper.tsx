"use client";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import { defineStepper } from "@stepperize/react";
import { WithdrawalStatus } from "./util";

export const withdrawalStepper = defineStepper(
  {
    id: "stx-tx",
  },
  {
    id: "signers-deliberation",
  },
  {
    id: "completed",
  },
);

const { useStepper, utils, steps } = withdrawalStepper;

export function Step({
  name,
  id,
  stepper,
}: {
  name: string;
  id: (typeof steps)[number]["id"];
  stepper: ReturnType<typeof useStepper>;
}) {
  const myIndex = utils.getIndex(id);

  const isCurrentStep = stepper.current.id === id;
  const currentIndex = utils.getIndex(stepper.current.id);
  const isCompleted =
    myIndex < currentIndex || stepper.current.id === utils.getLast().id;
  const isPending = myIndex > currentIndex;
  let statusClassName = "";
  let nameClassName = "";
  if (isCompleted) {
    statusClassName = "bg-orange border-orange text-white";
    nameClassName = "text-orange";
  } else if (isCurrentStep) {
    statusClassName = "bg-lightOrange border-orange text-orange";
    nameClassName = "text-orange";
  } else if (isPending) {
    statusClassName = "bg-white border-darkGray text-black";
    nameClassName = "text-black";
  }

  let wrapperClassName = `after:content-[''] after:w-full after:h-0.5 ${isCompleted ? "after:bg-orange" : "after:bg-midGray"} after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-6`;
  if (utils.getLast().id === id) {
    wrapperClassName = "";
  }

  return (
    <li
      className={`font-Matter flex w-full relative text-orange ${wrapperClassName}`}
    >
      <div className="block whitespace-nowrap z-10">
        <span
          className={`w-6 h-6 border-2 rounded-full flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10 ${statusClassName}`}
        >
          {myIndex + 1}
        </span>
        <span className={nameClassName}>{name}</span>
      </div>
    </li>
  );
}
export function WithdrawalStepper({
  status,
}: {
  status: WithdrawalStatus;
  txId: string;
}) {
  const stepper = useStepper();
  return (
    <div className="flex flex-col gap-4 w-full ">
      {(status === WithdrawalStatus.pending ||
        status === WithdrawalStatus.accepted) && (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></div>
      )}
      {status === WithdrawalStatus.confirmed && (
        <CheckCircleIcon className="text-green-600 w-12" />
      )}
      {status === WithdrawalStatus.failed && (
        <XCircleIcon className="text-red-500 w-12" />
      )}
      {status !== WithdrawalStatus.failed && (
        <ol className="flex items-center w-full text-xs text-gray-900 font-medium sm:text-base text-black">
          <Step stepper={stepper} name="Pending" id="stx-tx" />
          <Step stepper={stepper} name="Confirming" id="signers-deliberation" />
          <Step stepper={stepper} name="Completed" id="completed" />
        </ol>
      )}
    </div>
  );
}
