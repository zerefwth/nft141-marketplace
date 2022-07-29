export {};

declare global {
  interface Window {
    walletConnection: any;
    accountId: any;
    factoryContract: any;
    nftContract: any;
    nearInitPromise: any;
  }
}