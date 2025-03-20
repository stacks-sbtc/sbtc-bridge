"use client";
import LandingAnimation from "@/comps/core/LandingAnimation";
import { FlowContainer } from "@/comps/core/FlowContainer";
import { Heading, SubText } from "@/comps/core/Heading";
import { PrimaryButton } from "@/comps/core/FlowButtons";
import OldLayoutClient from "@/app/old-layout-client";
import getSbtcBridgeConfig from "@/actions/get-sbtc-bridge-config";

import { useEffect, useState } from "react";
import { BridgeConfig } from "@/util/atoms";

export default function WithdrawalStatusPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [config, setConfig] = useState<BridgeConfig | null>(null);

  useEffect(() => {
    getSbtcBridgeConfig().then(setConfig);
  }, []);

  return (
    config && (
      <OldLayoutClient config={config}>
        <LandingAnimation>
          <div className="w-screen flex"></div>
          <FlowContainer>
            <div className="w-full flex flex-row items-center justify-between">
              <Heading>Error fetching transaction status</Heading>
            </div>

            <div className="flex flex-1 items-end">
              <SubText>Click the button below to try again.</SubText>
            </div>

            <div className="flex flex-1 items-end">
              <PrimaryButton onClick={reset}>Try Again</PrimaryButton>
            </div>
          </FlowContainer>
          <div
            style={{
              margin: "16px 0",
            }}
          />
        </LandingAnimation>
      </OldLayoutClient>
    )
  );
}
