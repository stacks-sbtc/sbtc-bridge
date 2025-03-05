"use client";

import { Provider } from "jotai";
import { BridgeConfig, store } from "@/util/atoms";

import RenderNotifications from "@/comps/RenderNotifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/query/client";
import { useEffect } from "react";
import { bridgeConfigAtom } from "@/util/atoms";
import { AsignaSignActionModals } from "@asigna/btc-connect";

export default function LayoutClient({
  children,
  config,
}: Readonly<{
  children: React.ReactNode;
  config: BridgeConfig;
}>) {
  useEffect(() => {
    store.set(bridgeConfigAtom, config);
    // this is a setup step no need to run it twice
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RenderNotifications />
        {children}
        <AsignaSignActionModals />
      </QueryClientProvider>
    </Provider>
  );
}
