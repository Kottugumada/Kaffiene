#!/bin/sh
set -e

echo "▶ ci_post_clone.sh started"
echo "CI_PRIMARY_REPOSITORY_PATH=$CI_PRIMARY_REPOSITORY_PATH"

echo "▶ Installing CocoaPods via Homebrew..."
brew install cocoapods
echo "▶ CocoaPods version: $(pod --version)"

echo "▶ Installing Node.js via Homebrew..."
brew install node
echo "▶ Node version: $(node --version)"
echo "▶ npm version: $(npm --version)"

echo "▶ Installing npm dependencies..."
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile"
npm install --legacy-peer-deps

echo "▶ Running pod install..."
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile/ios"
pod install

echo "✅ ci_post_clone.sh completed successfully"
