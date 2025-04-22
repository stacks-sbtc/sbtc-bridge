"use server";

import StatusApp from "@/comps/StatusApp";
import OldLayout from "../old-layout";

export default async function Home() {
  return (
    <OldLayout>
      <StatusApp />
    </OldLayout>
  );
}
