import { env } from "@/env";

import { bitcoindUtxoFetch, mempoolFetch } from "@/actions/mempool-api";

const { MEMPOOL_API_URL } = env;
// Import your Bitcoin RPC logic

export async function POST(req: Request) {
  try {
    if (env.WALLET_NETWORK === "mainnet") {
      return Response.json({ error: "Mainnet not supported" }, { status: 400 });
    }

    const path = new URL(req.url).pathname.replace("/api/proxy/", "");
    return mempoolFetch(`${MEMPOOL_API_URL}/${path}`, {
      method: req.method,
      body: await req.text(),
    });
  } catch (error) {
    // good for debugging
    // eslint-disable-next-line no-console
    console.error("Error in POST handler:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    if (env.WALLET_NETWORK === "mainnet") {
      return Response.json({ error: "Mainnet not supported" }, { status: 400 });
    }
    const url = new URL(req.url);
    const path = url.pathname.replace("/api/proxy/", ""); // Get the dynamic part of the route
    // if path ends with "/utxo" then we are looking for the utxo of an address

    if (path.endsWith("/utxo")) {
      // Special route for `/transaction/utxo`

      // get the second to last part of the url

      // get the second to last part of the url
      const address = path.split("/")[1];
      if (!address) {
        return Response.json({ error: "Invalid address" }, { status: 400 });
      }

      return bitcoindUtxoFetch(address);
    }

    // Proxy all other routes to the base proxy URL
    const proxyUrl = `${MEMPOOL_API_URL}/${path}`;
    const response = await mempoolFetch(proxyUrl, {
      ...req,
    });

    const headers = response.headers;
    headers.delete("content-encoding");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    // good for debugging
    // eslint-disable-next-line no-console
    console.error("Error in GET handler:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
