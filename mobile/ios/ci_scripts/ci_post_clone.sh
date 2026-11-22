#!/bin/sh
set -e

echo "🔧 Installing Homebrew dependencies..."
brew install node cocoapods

echo "📦 Installing Node.js dependencies..."
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile"

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

npm install --legacy-peer-deps

echo "🔄 Regenerating iOS project with Expo prebuild..."
npx expo prebuild --platform ios

echo "🍫 Installing CocoaPods dependencies..."
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile/ios"

pod install --repo-update

echo "✅ ci_post_clone.sh completed successfully"
