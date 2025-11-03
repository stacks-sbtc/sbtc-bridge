#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "error: docker is not installed or not on PATH" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SBTC_DIR="${SBTC_DEVENV_PATH:-${REPO_ROOT}/sbtc}"
COMPOSE_FILE="${SBTC_DIR}/docker/docker-compose.yml"
COMPOSE_OVERRIDE="${REPO_ROOT}/scripts/stacks-api-compose.override.yml"

if [ ! -f "${COMPOSE_FILE}" ]; then
  echo "error: could not find devenv compose file at ${COMPOSE_FILE}" >&2
  echo "       set SBTC_DEVENV_PATH to the sbtc repository checkout that provides docker/docker-compose.yml" >&2
  exit 1
fi

PROFILES=(--profile default --profile sbtc-signer --profile bitcoin-mempool)
COMPOSE_FILES=(-f "${COMPOSE_FILE}")
if [ -f "${COMPOSE_OVERRIDE}" ]; then
  COMPOSE_FILES+=(-f "${COMPOSE_OVERRIDE}")
fi

echo "Stopping Stacks API and dependent services..."
if [ "${STACKS_API_PRUNE_VOLUMES:-0}" = "1" ]; then
  docker compose "${COMPOSE_FILES[@]}" "${PROFILES[@]}" down --remove-orphans -v
else
  docker compose "${COMPOSE_FILES[@]}" "${PROFILES[@]}" down --remove-orphans
fi
