#!/bin/sh
set -e

echo "▶ ci_post_clone.sh started"
echo "CI_PRIMARY_REPOSITORY_PATH=$CI_PRIMARY_REPOSITORY_PATH"

echo "▶ Installing CocoaPods via gem..."
sudo gem install cocoapods --no-document
echo "▶ CocoaPods version: $(pod --version)"

echo "▶ Setting up Node..."
export NVM_DIR="$HOME/.nvm"
# Use system node if nvm not available
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi
echo "▶ Node version: $(node --version)"
echo "▶ npm version: $(npm --version)"

echo "▶ Installing npm dependencies..."
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile"
npm install --legacy-peer-deps

echo "▶ Running pod install..."
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile/ios"
pod install

echo "✅ ci_post_clone.sh completed successfully"
