"use client";
import { withdrawStepper } from "../components/stepper";
import { WithdrawTimeline } from "../components/withdraw-stepper";
import { WithdrawInfo } from "./info";
const { Scoped } = withdrawStepper;
export function StatusClient() {
  return (
    <Scoped>
      <div className="flex flex-col-reverse md:flex-row w-full justify-center items-center md:items-stretch md:h-auto flex-1">
        <WithdrawInfo />
        <WithdrawTimeline />
      </div>
    </Scoped>
  );
}
