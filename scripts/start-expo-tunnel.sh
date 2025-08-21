#!/bin/bash

echo "🚀 Paleidžiame Expo development serverį su tunnel..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Expo Go su tunnel (be permissions problemų)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Paleidžiame Expo development serverį su tunnel
echo "📱 Paleidžiame Expo development serverį su tunnel..."
echo "💡 Atsisiųskite Expo Go programėlę į iPhone iš App Store"
echo "💡 Nuskaitykite QR kodą su Expo Go programėle"
echo "💡 Tunnel apeina permissions problemas!"
echo ""

# Naudojame tunnel, kad apeiti permissions problemas
npx @expo/cli start --tunnel --ios

echo ""
echo "✅ Expo development serveris paleistas su tunnel!"
echo "📱 Programėlė veiks Expo Go programėlėje"
echo "💡 Tunnel apeina visas permissions problemas!"
echo ""
echo "💡 QR kodas dabar turėtų veikti!"
