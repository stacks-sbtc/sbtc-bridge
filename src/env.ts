// MUST NOT BE USED BY CLIENT
import "server-only";
import { DefaultNetworkConfigurations } from "@leather.io/models";

type featureFlag = "withdrawals" | "reskin";

export const env = {
  BITCOIND_URL: process.env.BITCOIND_URL || "http://localhost:18443",
  EMILY_URL: process.env.EMILY_URL,
  MEMPOOL_API_URL: (
    process.env.MEMPOOL_API_URL || "http://localhost:8083/api"
  ).replace(/\/$/, ""),
  PUBLIC_MEMPOOL_URL: (
    process.env.PUBLIC_MEMPOOL_URL || "http://localhost:8083"
  ).replace(/\/$/, ""),

  BITCOIN_RPC_USER_NAME: process.env.BITCOIN_RPC_USER_NAME || "devnet",
  BITCOIN_RPC_PASSWORD: process.env.BITCOIN_RPC_PASSWORD || "devnet",
  WALLET_NETWORK: (process.env.WALLET_NETWORK ||
    "sbtcDevenv") as DefaultNetworkConfigurations,
  SBTC_CONTRACT_DEPLOYER: process.env.SBTC_CONTRACT_DEPLOYER,
  BANNER_CONTENT: process.env.BANNER_CONTENT,
  RECLAIM_LOCK_TIME: process.env.RECLAIM_LOCK_TIME,
  SUPPORT_LINK: process.env.SUPPORT_LINK,
  POLLING_INTERVAL: Number(process.env.POLLING_INTERVAL || 5000),
  BRIDGE_APP_URL: process.env.BRIDGE_APP_URL || "http://localhost:3000",
  STACKS_API_URL: process.env.STACKS_API_URL || "http://localhost:3999",
  FEATURE_FLAGS: (process.env.FEATURE_FLAGS?.split(",") || []) as featureFlag[],
  WITHDRAWAL_FEE_MULTIPLIER: Number(process.env.WITHDRAWAL_FEE_MULTIPLIER || 4),
  HIRO_API_KEY: process.env.HIRO_API_KEY,
  GIT_COMMIT: process.env.GIT_COMMIT || "unknown",
};
