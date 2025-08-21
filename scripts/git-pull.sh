#!/bin/bash

echo "📱 Pradedamas Git pull Barupasas projektui..."
echo "🔄 Atnaujiname kodą iš serverio..."

# Pulliname pakeitimus
echo "⬇️  Pulliname pakeitimus..."
git pull origin master

# Patikriname ar yra naujų dependencies
if [ -f "package.json" ]; then
    echo "📦 Patikriname ar reikia įdiegti naujus dependencies..."
    npm install
fi

# Patikriname ar yra iOS build failų
if [ -d "ios" ]; then
    echo "🍎 Patikriname iOS build failus..."
    cd ios && pod install && cd ..
fi

echo "✅ Git pull baigtas!"
echo "📱 Kodas atnaujintas!"
echo "🚀 Dabar galite paleisti build:"
echo "   ./scripts/build-mac.sh    # EAS Mac build"
echo "   ./scripts/build-xcode.sh  # Xcode build"
