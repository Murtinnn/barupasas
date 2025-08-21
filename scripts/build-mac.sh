#!/bin/bash

echo "🚀 Pradedamas Mac build Barupasas programėlei..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Lokalus Mac build (daug greičiau)"

# Patikriname ar EAS CLI yra įdiegtas
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI nerastas. Įdiegiame..."
    npm install -g @expo/cli
    npm install -g eas-cli
fi

# Prisijungiame prie Expo
echo "🔐 Prisijungiame prie Expo..."
eas login

# Mac build su iOS platforma
echo "🔨 Pradedamas Mac build..."
eas build --platform ios --profile mac --local

echo "✅ Mac build baigtas!"
echo "📱 .ipa failas yra build/ios/ aplanke"
echo "💡 Dabar galite įdiegti programėlę į iPhone per Xcode arba TestFlight"
