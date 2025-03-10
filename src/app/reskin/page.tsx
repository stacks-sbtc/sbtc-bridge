import DepositTimeline from "./components/stepper/deposit-timeline";
import { DepositForm } from "./components/forms/deposit/deposit-form";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <DepositForm />
      <DepositTimeline />
    </div>
  );
}
