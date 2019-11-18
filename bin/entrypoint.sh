#!/usr/bin/env bash

set -euo pipefail

exit_func() {
        echo "SIGTERM detected"            
        exit 1
}
trap exit_func SIGTERM SIGINT

echo
echo "Starting with CMD '$@'"
echo

exec "$@"