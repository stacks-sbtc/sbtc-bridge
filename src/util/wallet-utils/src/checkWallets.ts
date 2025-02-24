const checkXverseProvider = () => {
  return Boolean(
    window.XverseProviders?.BitcoinProvider || window.BitcoinProvider,
  );
};
export enum WalletType {
  xverse = "xverse",
  leather = "leather",
  asigna = "asigna",
}
export const checkAvailableWallets: () => {
  [key in WalletType]: boolean;
} = () => {
  const isLeather = !!window.LeatherProvider;
  const isXverse = checkXverseProvider();

  return {
    leather: isLeather,
    xverse: isXverse,
    asigna: window.top !== window.self,
  };
};
