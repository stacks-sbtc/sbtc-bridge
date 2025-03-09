import DepositTimeline from "./components/stepper/timeline";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h1 className="text-4xl font-bold mb-4">Deposit</h1>
      <DepositTimeline />
    </div>
  );
}
