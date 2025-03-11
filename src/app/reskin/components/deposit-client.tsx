"use client";

import { DepositForm } from "./forms/deposit/deposit-form";
import { depositStepper, DepositTimeline } from "./stepper/deposit-timeline";
const { Scoped } = depositStepper;
export function DepositClient() {
  return (
    <Scoped>
      <DepositForm />
      <DepositTimeline />
    </Scoped>
  );
}
