#!/bin/bash

echo "🚀 Pradedamas Xcode build Barupasas programėlei..."
echo "📱 Platforma: iOS"
echo "🍎 Build tipas: Xcode (greičiausias)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Patikriname ar yra iOS aplankas
if [ ! -d "ios" ]; then
    echo "📱 Generuojame iOS projektą..."
    npx @expo/cli prebuild --platform ios
else
    echo "✅ iOS aplankas jau egzistuoja"
fi

# Įdiegiame CocoaPods dependencies
echo "📦 Įdiegiame CocoaPods dependencies..."
cd ios && pod install && cd ..

# Patikriname ar CocoaPods įdiegti
if [ ! -f "ios/Barupasas.xcworkspace" ]; then
    echo "❌ CocoaPods nepavyko įdiegti"
    echo "💡 Pabandykite iš naujo:"
    echo "   cd ios && pod install && cd .."
    exit 1
fi

# Atidarome Xcode
echo "🍎 Atidarome Xcode..."
open ios/Barupasas.xcworkspace

echo ""
echo "✅ Xcode atidarytas!"
echo "📱 Dabar Xcode:"
echo "   1. Pasirinkite iPhone arba Simulator viršuje"
echo "   2. Paspauskite ⌘+R (Run)"
echo "   3. Programėlė automatiškai įdiegta!"
echo ""
echo "💡 Xcode build yra greičiausias būdas testuoti programėlę!"
echo "💡 Apeina visas ngrok ir permissions problemas!"
