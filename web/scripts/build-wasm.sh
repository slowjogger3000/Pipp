#!/bin/sh
# Builds core/ and web/wasm/bridge.cpp into web/public/tipp.wasm: a
# standalone module with no JavaScript glue, loaded by the AudioWorklet and
# by the main thread. Run from anywhere.
set -e
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
mkdir -p web/public
em++ -std=c++17 -O2 -Wall -Wextra -Wshadow -Wconversion -Wsign-conversion -Wno-unused-parameter \
  -fno-exceptions -fno-rtti -ffp-contract=off -Icore \
  core/Engine.cpp core/BirdData.cpp core/Json.cpp core/Surroundings.cpp core/Compare.cpp \
  core/Drawn.cpp core/Quiz.cpp core/Chorus.cpp web/wasm/bridge.cpp \
  -o web/public/tipp.wasm --no-entry -sSTANDALONE_WASM -sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=16MB
echo "web/public/tipp.wasm $(wc -c < web/public/tipp.wasm | tr -d ' ') bytes"
