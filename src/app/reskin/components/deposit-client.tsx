"use client";

import { DepositForm } from "./forms/deposit/deposit-form";
import { DepositTimeline } from "./stepper/deposit-timeline";
import { depositStepper } from "./stepper/deposit/util";
const { Scoped } = depositStepper;
export function DepositClient() {
  return (
    <Scoped>
      <div className="flex flex-col-reverse md:flex-row w-full justify-center items-center h-full">
        <DepositForm />
        <DepositTimeline />
      </div>
    </Scoped>
  );
}
