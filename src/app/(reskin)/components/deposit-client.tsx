"use client";

import { DepositForm } from "./forms/deposit/deposit-form";
import { depositStepper } from "./stepper/deposit/util";
const { Scoped } = depositStepper;
export function DepositClient() {
  return (
    <Scoped>
      <div className="flex flex-col-reverse md:flex-row w-full justify-center items-center md:items-stretch md:h-auto h-full flex-1">
        <DepositForm />
      </div>
    </Scoped>
  );
}
