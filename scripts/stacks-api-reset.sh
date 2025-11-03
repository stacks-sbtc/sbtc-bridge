#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$(command -v docker >/dev/null 2>&1)" || true

if [[ -n "${STACKS_API_URL:-}" ]]; then
  if [[ "${STACKS_API_URL}" =~ ^https?:// && ! "${STACKS_API_URL}" =~ ^http://(localhost|127\.0\.0\.1)(:[0-9]+)?/?$ ]]; then
    echo "[stacks-api-reset] Detected STACKS_API_URL='${STACKS_API_URL}'. Remote API in use; skipping local DevNet reset."
    echo "[stacks-api-reset] Use 'npm run dev:testnet' to continue against the hosted testnet stack."
    exit 0
  fi
fi

"${SCRIPT_DIR}/stacks-api-down.sh"
"${SCRIPT_DIR}/stacks-api-up.sh"
