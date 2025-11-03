#!/usr/bin/env bash
set -euo pipefail

echo "[dev-testnet] Using public Stacks testnet endpoints for sBTC bridge development."

export STACKS_API_URL="${STACKS_API_URL:-https://api.testnet.hiro.so}"
export WALLET_NETWORK="${WALLET_NETWORK:-testnet}"
export MEMPOOL_API_URL="${MEMPOOL_API_URL:-https://mempool.space/testnet/api}"
export PUBLIC_MEMPOOL_URL="${PUBLIC_MEMPOOL_URL:-https://mempool.space/testnet}"

echo "[dev-testnet] STACKS_API_URL=${STACKS_API_URL}"
echo "[dev-testnet] WALLET_NETWORK=${WALLET_NETWORK}"
echo "[dev-testnet] MEMPOOL_API_URL=${MEMPOOL_API_URL}"
echo "[dev-testnet] PUBLIC_MEMPOOL_URL=${PUBLIC_MEMPOOL_URL}"

exec npx next dev
