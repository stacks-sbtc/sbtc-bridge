"use server";

import HomeApp from "@/comps/HomeApp";
import OldLayout from "./old-layout";

export default async function Home() {
  return (
    <OldLayout>
      <HomeApp />
    </OldLayout>
  );
}
