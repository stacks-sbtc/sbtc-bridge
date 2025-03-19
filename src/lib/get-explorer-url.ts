export const getExplorerUrl = (
  txId: string,
  network: "devnet" | "mainnet" | "testnet",
): string => {
  const apiUrl = network === "devnet" ? "&api=http://localhost:3999" : "";
  return `https://explorer.hiro.so/txid/${txId}?chain=${network}${apiUrl}`;
};
