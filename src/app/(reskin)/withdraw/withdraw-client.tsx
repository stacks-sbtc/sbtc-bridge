"use client";

import { withdrawStepper } from "./components/stepper";
import { WithdrawForm } from "./components/form/withdraw-form";

const { Scoped } = withdrawStepper;
export function WithdrawClient() {
  return (
    <Scoped>
      <div className="flex flex-col-reverse md:flex-row w-full justify-center items-center md:items-stretch md:h-auto flex-1">
        <WithdrawForm />
      </div>
    </Scoped>
  );
}
