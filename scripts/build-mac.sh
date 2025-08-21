#!/bin/bash

echo "🚀 Pradedamas Mac build Barupasas programėlei..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Lokalus Mac build (daug greičiau)"

# Patikriname ar EAS CLI yra pasiekiamas per npx
if ! npx eas-cli --version &> /dev/null; then
    echo "📦 EAS CLI bus atsisiųstas automatiškai per npx..."
fi

# Prisijungiame prie Expo
echo "🔐 Prisijungiame prie Expo..."
npx eas-cli login

# Mac build su iOS platforma
echo "🔨 Pradedamas Mac build..."
echo "💡 Naudojame 'mac-build' profilį greičiam buildui..."

npx eas-cli build --platform ios --profile mac-build --local

echo "✅ Mac build baigtas!"
echo "📱 .ipa failas yra build/ios/ aplanke"
echo "💡 Dabar galite įdiegti programėlę į iPhone per Xcode arba TestFlight"
