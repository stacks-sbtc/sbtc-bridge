import { DepositClient } from "./components/deposit-client";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center flex-1 py-10">
      <DepositClient />
    </div>
  );
}
