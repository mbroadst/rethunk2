#!/bin/bash

SCRIPTS=`find . -type f \( -name "*.js" -and ! -name "common.js" \)`

FAILED=0
FAILED_RX="Failed ([0-9]+) tests"
for SCRIPT in $SCRIPTS; do
  OUTPUT=$( $SCRIPT )
  if [[ $OUTPUT =~ ^Passed ]]; then
    echo "$(basename $SCRIPT): passed"
  else
    if [[ $OUTPUT =~ $FAILED_RX ]]; then
      FAILED=$((FAILED + BASH_REMATCH[1]))
    fi

    echo "$(basename $SCRIPT):"
    echo "${OUTPUT}"
  fi
done

echo "$FAILED tests failed"
