# Agent Workflow Notes

- Use `npm run dev:testnet` when you don’t have disk space for the local sBTC DevNet. The script logs the remote endpoints (Stacks testnet API, mempool) and exports `WALLET_NETWORK=testnet` before starting `next dev`.
- The DevNet helper scripts (`npm run stacks-api:up|down|reset`) now detect a remote `STACKS_API_URL` and early-exit with a clear message, so you won’t accidentally try to boot the heavy Docker stack when you’re pointing at a hosted API.
- When you are ready to switch back to the full DevNet, unset `STACKS_API_URL` (or restore the default `http://localhost:3999`) and rerun `npm run stacks-api:reset` to recreate the containers.
