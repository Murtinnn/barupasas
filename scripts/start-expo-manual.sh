#!/bin/bash

echo "🚀 Paleidžiame Expo development serverį manual..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Expo Go manual (be permissions problemų)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Paleidžiame Expo development serverį manual
echo "📱 Paleidžiame Expo development serverį manual..."
echo "💡 Atsisiųskite Expo Go programėlę į iPhone iš App Store"
echo "💡 Įveskite URL rankiniu būdu Expo Go programėlėje"
echo "💡 URL bus rodomas terminale"
echo ""

# Naudojame manual, kad apeiti permissions problemas
npx @expo/cli start --offline --ios

echo ""
echo "✅ Expo development serveris paleistas manual!"
echo "📱 Programėlė veiks Expo Go programėlėje"
echo "💡 Manual apeina permissions problemas!"
echo ""
echo "💡 URL dabar turėtų būti rodomas terminale!"
