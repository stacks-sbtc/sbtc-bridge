import { defineStepper } from "@stepperize/react";
import { AmountDescription } from "./amount";
import { StatusDescription } from "./status";

function AddressDescription({}) {
  return (
    <span className="md:opacity-60 px-4 md:px-0">
      sBTC will be sent to a STX address. Connecting a wallet will auto-fill
      this in, but feel free to submit another address.
    </span>
  );
}

export const depositStepper = defineStepper(
  {
    id: "amount",
    title: "Select Deposit Amount",
    description: AmountDescription,
  },
  {
    id: "address",
    title: "Provide a Deposit Address",
    description: AddressDescription,
  },
  {
    id: "confirm",
    title: "Confirm Deposit",
    description: () => (
      <span className="md:opacity-60 px-4 md:px-0">
        Confirm your deposit details and proceed.
      </span>
    ),
  },
  {
    id: "status",
    title: "Operation Status:",
    description: () => {
      const stepper = depositStepper.useStepper();
      return <StatusDescription stepper={stepper as any} />;
    },
  },
);
