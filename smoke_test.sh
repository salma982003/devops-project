#!/bin/bash
set -e

URL=${1:-http://localhost:3000}
MAX_TRIES=15
SLEEP=2

echo "🧪 Smoke test starting for: $URL"

for i in $(seq 1 $MAX_TRIES); do
    if curl -fs "$URL" > /dev/null; then
        echo "✅ SMOKE_TEST_PASSED: $URL is accessible"
        exit 0
    fi
    echo "⏳ Attempt $i/$MAX_TRIES - Waiting $SLEEP seconds..."
    sleep $SLEEP
done

echo "❌ SMOKE_TEST_FAILED: $URL not accessible after $MAX_TRIES attempts"
exit 1
