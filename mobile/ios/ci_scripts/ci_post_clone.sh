#!/bin/sh

# Navigate to mobile directory and install npm dependencies
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile"
npm install

# Navigate to ios directory and install CocoaPods
cd "$CI_PRIMARY_REPOSITORY_PATH/mobile/ios"
pod install
