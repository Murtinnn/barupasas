#!/bin/bash

echo "🍺 Įdiegiame reikalingus įrankius Mac įrenginyje..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🔧 Sprendimas 1: Homebrew (rekomenduojama)"
echo ""

# Patikriname ar yra Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew nerastas. Įdiegiame..."
    echo "💡 Paleiskite šią komandą:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "🔄 Po Homebrew įdiegimo paleiskite šį scriptą iš naujo"
    exit 1
fi

echo "✅ Homebrew rastas!"
echo "🍺 Homebrew versija: $(brew --version | head -n1)"

echo ""
echo "📦 Įdiegiame reikalingus įrankius..."

# Įdiegiame Node.js per Homebrew
echo "📦 Įdiegiame Node.js..."
brew install node

# Įdiegiame Expo CLI per Homebrew
echo "📦 Įdiegiame Expo CLI..."
brew install expo-cli

# Įdiegiame EAS CLI per Homebrew
echo "📦 Įdiegiame EAS CLI..."
brew install eas-cli

echo ""
echo "✅ Visi įrankiai įdiegti!"
echo ""

# Patikriname versijas
echo "📋 Įdiegtų įrankių versijos:"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo "   Expo CLI: $(expo --version)"
echo "   EAS CLI: $(eas --version)"

echo ""
echo "🚀 Dabar galite naudoti build scriptus be problemų!"
echo ""
echo "📱 Paleiskite:"
echo "   ./scripts/build-mac.sh     # EAS Mac build"
echo "   ./scripts/build-xcode.sh   # Xcode build"
echo ""
echo "💡 Homebrew automatiškai išsprendžia permissions problemas!"
