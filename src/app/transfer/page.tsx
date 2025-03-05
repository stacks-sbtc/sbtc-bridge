"use server";

import TransferApp from "@/comps/TransferHome";
import OldLayout from "../old-layout";

export default async function Home() {
  return (
    <OldLayout>
      <TransferApp />
    </OldLayout>
  );
}
