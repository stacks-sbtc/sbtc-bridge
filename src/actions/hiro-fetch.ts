import { env } from "@/env";

async function hiroFetch(url: string, options: RequestInit = {}) {
  const apiHeaders: { "x-api-key"?: string } = {};
  if (env.HIRO_API_KEY) {
    apiHeaders["x-api-key"] = env.HIRO_API_KEY;
  }
  return fetch(url, {
    ...options,
    headers: { ...options.headers, ...apiHeaders },
  });
}

export const hiroClient = {
  baseUrl: env.STACKS_API_URL,
  fetch: hiroFetch,
};
