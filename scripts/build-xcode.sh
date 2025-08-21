#!/bin/bash

echo "🚀 Pradedamas Xcode build Barupasas programėlei..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Xcode build (greičiausias)"

# Patikriname ar Expo CLI yra įdiegtas
if ! command -v expo &> /dev/null; then
    echo "❌ Expo CLI nerastas. Įdiegiame..."
    npm install -g @expo/cli
fi

# Generuojame iOS projektą
echo "📱 Generuojame iOS projektą..."
npx expo run:ios --device

echo "✅ Xcode build baigtas!"
echo "📱 Programėlė automatiškai įdiegta į iPhone"
echo "💡 Dabar galite testuoti programėlę tiesiogiai telefone"
