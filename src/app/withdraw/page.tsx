"use server";

import OldLayout from "../old-layout";
import { WithdrawClient } from "./components/withdraw-client";

export default async function Home() {
  return (
    <OldLayout>
      <WithdrawClient />
    </OldLayout>
  );
}
