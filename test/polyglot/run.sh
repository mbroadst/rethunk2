#!/bin/bash

SCRIPTS=`find . -type f \( -name "*.js" -and ! -name "common.js" \)`
for SCRIPT in $SCRIPTS; do $SCRIPT; done

