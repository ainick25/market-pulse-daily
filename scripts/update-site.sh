#!/bin/bash
set -e
cd "$(dirname "$0")/.."
echo "📦 メタデータ再構築中..."
node scripts/build-metadata.js
echo "✅ 完了"
