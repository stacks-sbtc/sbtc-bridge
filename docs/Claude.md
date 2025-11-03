# Cloud Environment Notes

- Hosted environments should default to the public Stacks testnet API (`https://api.testnet.hiro.so`). The `npm run dev:testnet` script sets the necessary environment variables and is safe to use anywhere the full DevNet stack is unavailable.
- CI or cloud agents that call `npm run stacks-api:reset` will now see a log message and exit immediately whenever `STACKS_API_URL` is already remote. This prevents unnecessary Docker churn while still documenting the fallback behaviour for future troubleshooting.
