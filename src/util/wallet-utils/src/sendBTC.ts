import { request } from "@stacks/connect";

type Payload = {
  recipient: string;
  amountInSats: number;
  network?: string;
};

export async function sendBTC({ amountInSats, recipient, network }: Payload) {
  const result = await request("sendTransfer", {
    recipients: [
      {
        address: recipient,
        amount: amountInSats,
      },
    ],
    network,
  } as any);

  return result.txid.replace(/"|'/g, "");
}
