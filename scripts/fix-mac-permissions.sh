#!/bin/bash

echo "🔧 Išsprendžiame Mac permissions problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problema: npm globalūs paketai negali būti įdiegti dėl permissions"
echo "💡 Sprendimas: Naudosime npx vietoj globalių paketų"
echo ""

# Patikriname ar yra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nerastas. Įdiegiame..."
    echo "💡 Atsisiųskite iš: https://nodejs.org/"
    exit 1
fi

# Patikriname ar yra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm nerastas. Įdiegiame..."
    echo "💡 Atsisiųskite iš: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js ir npm rasti!"
echo "📦 Node.js versija: $(node --version)"
echo "📦 npm versija: $(npm --version)"

echo ""
echo "🔧 Atnaujinsime build scriptus, kad naudotų npx..."
echo ""

# Atnaujinsime build-mac.sh
if [ -f "scripts/build-mac.sh" ]; then
    echo "📝 Atnaujinsime build-mac.sh..."
    sed -i '' 's/npm install -g @expo\/cli/# npm install -g @expo\/cli (permissions problemos)/' scripts/build-mac.sh
    sed -i '' 's/npm install -g eas-cli/# npm install -g eas-cli (permissions problemos)/' scripts/build-mac.sh
    sed -i '' 's/eas login/npx eas-cli login/' scripts/build-mac.sh
    sed -i '' 's/eas build/npx eas-cli build/' scripts/build-mac.sh
    echo "✅ build-mac.sh atnaujintas!"
fi

# Atnaujinsime build-xcode.sh
if [ -f "scripts/build-xcode.sh" ]; then
    echo "📝 Atnaujinsime build-xcode.sh..."
    sed -i '' 's/npm install -g @expo\/cli/# npm install -g @expo\/cli (permissions problemos)/' scripts/build-xcode.sh
    echo "✅ build-xcode.sh atnaujintas!"
fi

# Atnaujinsime setup-git.sh
if [ -f "scripts/setup-git.sh" ]; then
    echo "📝 Atnaujinsime setup-git.sh..."
    sed -i '' 's/npm install -g @expo\/cli/# npm install -g @expo\/cli (permissions problemos)/' scripts/setup-git.sh
    sed -i '' 's/npm install -g eas-cli/# npm install -g eas-cli (permissions problemos)/' scripts/setup-git.sh
    echo "✅ setup-git.sh atnaujintas!"
fi

echo ""
echo "✅ Permissions problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   npx @expo/cli --version    # Patikrinti Expo CLI"
echo "   npx eas-cli --version      # Patikrinti EAS CLI"
echo ""
echo "🚀 Build scriptai automatiškai naudos npx!"
echo ""
echo "📱 Dabar galite paleisti:"
echo "   ./scripts/build-mac.sh     # EAS Mac build"
echo "   ./scripts/build-xcode.sh   # Xcode build"
