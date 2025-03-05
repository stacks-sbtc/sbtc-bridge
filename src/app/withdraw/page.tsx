"use server";
import TempWithdraw from "@/comps/temp-withdraw";
import OldLayout from "../old-layout";

export default async function Home() {
  return (
    <OldLayout>
      <TempWithdraw />
    </OldLayout>
  );
}
