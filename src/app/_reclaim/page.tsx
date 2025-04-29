"use server";

import ReclaimManager from "@/comps/ReclaimManager";
import OldLayout from "../old-layout";

export default async function Home() {
  return (
    <OldLayout>
      <ReclaimManager />
    </OldLayout>
  );
}
