#!/bin/bash

echo "🚀 Paleidžiame Expo development serverį..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Expo Go (be System Events)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Paleidžiame Expo development serverį su custom portu
echo "📱 Paleidžiame Expo development serverį..."
echo "💡 Atsisiųskite Expo Go programėlę į iPhone iš App Store"
echo "💡 Nuskaitykite QR kodą su Expo Go programėle"
echo ""

# Naudojame custom portą, kad išvengtume konfliktų
npx @expo/cli start --ios --port 8083

echo ""
echo "✅ Expo development serveris paleistas!"
echo "📱 Programėlė veiks Expo Go programėlėje"
echo "💡 Tai yra greičiausias būdas testuoti programėlę!"
echo ""
echo "💡 Šis metodas apeina macOS permissions problemas!"
