#!/bin/sh
set -e

echo "📦 Installing Node.js dependencies..."
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile"

# Install Node.js if not available (Xcode Cloud has it, but just in case)
export NODE_BINARY=$(which node)
echo "Node path: $NODE_BINARY"
echo "Node version: $(node --version)"

npm install --legacy-peer-deps

echo "🍫 Installing CocoaPods dependencies..."
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile/ios"

# Install CocoaPods if needed
if ! command -v pod &> /dev/null; then
    echo "Installing CocoaPods..."
    gem install cocoapods
fi

pod install --repo-update

echo "✅ ci_post_clone.sh completed successfully"
