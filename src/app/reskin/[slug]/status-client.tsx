"use client";
import { DepositTimeline } from "../components/stepper/deposit-timeline";

import { depositStepper } from "../components/stepper/deposit/util";
import { DepositInfo } from "./info";
const { Scoped } = depositStepper;
export function StatusClient() {
  return (
    <Scoped>
      <div className="flex flex-col-reverse md:flex-row w-full justify-center items-center md:items-stretch md:h-auto h-full">
        <DepositInfo />
        <DepositTimeline />
      </div>
    </Scoped>
  );
}
