#!/bin/bash

echo "🚀 Pradedamas tiesioginis Xcode build Barupasas programėlei..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Xcode build (greičiausias, apeina EAS problemas)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Patikriname ar yra iOS aplankas
if [ ! -d "ios" ]; then
    echo "📱 iOS aplankas nerastas. Generuojame..."
    npx @expo/cli prebuild --platform ios
fi

# Patikriname ar yra Podfile
if [ ! -f "ios/Podfile" ]; then
    echo "📦 Podfile nerastas. Generuojame iOS projektą..."
    npx @expo/cli prebuild --platform ios --clean
fi

# Įdiegiame CocoaPods dependencies
echo "📦 Įdiegiame CocoaPods dependencies..."
cd ios && pod install && cd ..

# Generuojame iOS projektą
echo "📱 Generuojame iOS projektą..."
npx @expo/cli run:ios --device

echo "✅ Tiesioginis Xcode build baigtas!"
echo "📱 Programėlė automatiškai įdiegta į iPhone"
echo "💡 Dabar galite testuoti programėlę tiesiogiai telefone"
echo ""
echo "💡 Šis metodas apeina EAS problemas ir yra greičiausias!"
