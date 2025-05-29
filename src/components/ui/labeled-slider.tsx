"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface LabeledSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  minLabel?: string;
  maxLabel?: string;
}

const LabeledSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  LabeledSliderProps
>(({ className, minLabel, maxLabel, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {/* Min/Max Labels */}
      <div className="flex justify-between text-darkGray dark:text-midGray font-light mb-2">
        <span>{minLabel ?? props.min}</span>
        <span>{maxLabel ?? props.max}</span>
      </div>

      {/* Slider Container */}
      <div className="relative">
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className,
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
      </div>
    </div>
  );
});

LabeledSlider.displayName = "LabeledSlider";

export { LabeledSlider };
