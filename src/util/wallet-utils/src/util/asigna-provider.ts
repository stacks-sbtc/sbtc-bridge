/*
Source: https://github.com/hirosystems/connect/blob/main/packages/connect/src/asigna.ts
we cannot rely on the exported initializeAsignaProvider because of document.referrer can be an empty string or undefined.
That's why we can't rely on AsignaProvider being defined in the asigna app iframe
*/

const source = "asigna-stx";

const generateCall = (payload: string, key: string) => {
  return new Promise((res) => {
    function listener(message: MessageEvent<any>) {
      if (message.data.source === source && message.data[key]) {
        res(message.data[key]);
        window.removeEventListener("message", listener);
      }
    }
    window.addEventListener("message", listener);
    window.top!.postMessage(generateAsignaMessage(payload, key), "*");
  });
};

export const AsignaIframeProvider = {
  authenticationRequest: async (payload: string) => {
    return generateCall(payload, "authenticationRequest");
  },
  transactionRequest: async (payload: string) => {
    return generateCall(payload, "transactionRequest");
  },
};
const generateAsignaMessage = (payload: string, key: string) => {
  return { source, [key]: payload };
};
