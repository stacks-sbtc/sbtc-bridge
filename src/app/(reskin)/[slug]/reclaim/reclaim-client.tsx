"use client";

import { ReclaimTimeline } from "./components/reclaim-stepper";
import { reclaimStepper } from "./components/stepper";
import { ReclaimForm } from "./reclaim-form";

const { Scoped } = reclaimStepper;
export function ReclaimClient() {
  return (
    <Scoped>
      <div className="flex flex-col-reverse md:flex-row w-full justify-center items-center md:items-stretch md:h-auto flex-1">
        <ReclaimForm />
        <ReclaimTimeline />
      </div>
    </Scoped>
  );
}
