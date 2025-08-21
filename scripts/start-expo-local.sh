#!/bin/bash

echo "🚀 Paleidžiame Expo development serverį local network..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Expo Go local network (be permissions problemų)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Paleidžiame Expo development serverį local network
echo "📱 Paleidžiame Expo development serverį local network..."
echo "💡 Atsisiųskite Expo Go programėlę į iPhone iš App Store"
echo "💡 Įsitikinkite, kad iPhone ir Mac yra tame pačiame WiFi tinkle"
echo "💡 Nuskaitykite QR kodą su Expo Go programėle"
echo ""

# Naudojame local network, kad apeiti permissions problemas
echo "🌐 Paleidžiame local network start..."
echo "💡 Įsitikinkite, kad iPhone ir Mac yra tame pačiame WiFi tinkle"
echo "💡 Local network apeina ngrok permissions problemas!"

# Paleidžiame local network start
npx @expo/cli start --localhost --ios

echo ""
echo "✅ Expo development serveris paleistas local network!"
echo "📱 Programėlė veiks Expo Go programėlėje"
echo "💡 Local network apeina permissions problemas!"
echo ""
echo "💡 QR kodas dabar turėtų veikti!"
