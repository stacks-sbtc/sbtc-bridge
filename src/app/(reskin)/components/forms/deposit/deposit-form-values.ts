export type DepositFormValues = {
  addressType: "stx" | "bns";
  amount: string;
  address: string;
  resolvedAddress: string;
  resolveStatus: "" | "resolving" | "error" | "resolved";
};
