"use client";

import { DepositForm } from "./forms/deposit/deposit-form";
import { DepositTimeline } from "./stepper/deposit-timeline";
import { depositStepper } from "./stepper/deposit/util";
const { Scoped } = depositStepper;
export function DepositClient() {
  return (
    <Scoped>
      <div className="flex w-full justify-center min-h-[calc(100%-12rem)]">
        <DepositForm />
        <DepositTimeline />
      </div>
    </Scoped>
  );
}
