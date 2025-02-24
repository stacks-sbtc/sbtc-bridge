import { LeatherProvider } from "@leather.io/rpc";
import { Wallet } from "sats-connect";

declare global {
  interface Window {
    LeatherProvider?: LeatherProvider;
    FordefiProviders: { UtxoProvider: any };
  }
}
