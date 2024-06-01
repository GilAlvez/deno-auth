#!/bin/bash
./scripts/wait-for-it.sh mongodb:27017 --timeout=30 --strict -- echo "MongoDB is running..."

deno serve --port 3001 --watch --allow-net --allow-env --allow-sys --allow-read src/main.ts
