#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "error: docker is not installed or not on PATH" >&2
  exit 1
fi

if [[ -n "${STACKS_API_URL:-}" ]]; then
  if [[ "${STACKS_API_URL}" =~ ^https?:// && ! "${STACKS_API_URL}" =~ ^http://(localhost|127\.0\.0\.1)(:[0-9]+)?/?$ ]]; then
    echo "[stacks-api-up] Detected STACKS_API_URL='${STACKS_API_URL}'. Assuming remote API; skipping local stack startup."
    exit 0
  fi
fi

if ! command -v nc >/dev/null 2>&1; then
  echo "error: nc (netcat) is required for readiness probing" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "error: curl is required to probe the Stacks API" >&2
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

STACKS_API_STATUS_URL="${STACKS_API_STATUS_URL:-http://127.0.0.1:3999/extended/v1/status}"
WAIT_ATTEMPTS="${STACKS_API_WAIT_ATTEMPTS:-150}"
WAIT_INTERVAL="${STACKS_API_WAIT_INTERVAL:-2}"
PROFILES=(--profile default --profile sbtc-signer --profile bitcoin-mempool)
COMPOSE_FILES=(-f "${COMPOSE_FILE}")
if [ -f "${COMPOSE_OVERRIDE}" ]; then
  COMPOSE_FILES+=(-f "${COMPOSE_OVERRIDE}")
fi
SERVICES=(
  bitcoin
  bitcoin-miner
  postgres-stacks-api
  postgres-1
  postgres-2
  postgres-3
  stacks-node
  stacker
  tx-broadcaster
  stacks-signer-1
  stacks-signer-2
  stacks-signer-3
  sbtc-signer-1
  sbtc-signer-2
  sbtc-signer-3
  stacks-api
)

echo "Starting Stacks API stack (${SERVICES[*]}) with compose file ${COMPOSE_FILE}..."
docker compose "${COMPOSE_FILES[@]}" "${PROFILES[@]}" up -d "${SERVICES[@]}"

echo "Waiting for Stacks API readiness at ${STACKS_API_STATUS_URL}..."
for ((attempt=1; attempt<=WAIT_ATTEMPTS; attempt++)); do
  if nc -z localhost 3999 >/dev/null 2>&1; then
    if curl --fail --silent --show-error --location --max-time 2 "${STACKS_API_STATUS_URL}" >/dev/null; then
      echo "Stacks API is ready (attempt ${attempt}/${WAIT_ATTEMPTS})."
      exit 0
    fi
  fi
  if ! docker compose "${COMPOSE_FILES[@]}" "${PROFILES[@]}" ps stacks-api | grep -q 'Up'; then
    echo "Stacks API container is not running; showing last logs..." >&2
    docker compose "${COMPOSE_FILES[@]}" "${PROFILES[@]}" logs --tail 100 stacks-api >&2 || true
    exit 1
  fi
  sleep "${WAIT_INTERVAL}"
done

echo "Stacks API did not report ready after ${WAIT_ATTEMPTS} attempts." >&2
echo "Recent Stacks API logs:" >&2
docker compose "${COMPOSE_FILES[@]}" "${PROFILES[@]}" logs --tail 100 stacks-api >&2 || true
echo "" >&2
echo "Troubleshooting tips:" >&2
echo "  • ensure port 3999 is open (run: docker exec stacks-api netstat -tulpn | grep 3999)" >&2
echo "  • verify postgres and bitcoin services are healthy (docker compose ... ps)" >&2
exit 1
