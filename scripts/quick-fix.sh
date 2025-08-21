#!/bin/bash

echo "⚡ Greitas sprendimas Mac permissions problemoms..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problema: npm globalūs paketai negali būti įdiegti"
echo "💡 Sprendimas: Naudosime npx (npx automatiškai atsisiunčia paketus)"
echo ""

# Patikriname ar yra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nerastas!"
    echo "💡 Atsisiųskite iš: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js rastas: $(node --version)"

echo ""
echo "🔧 Atnaujinsime build scriptus..."

# Atnaujinsime build-mac.sh
if [ -f "scripts/build-mac.sh" ]; then
    echo "📝 Atnaujinsime build-mac.sh..."
    cp scripts/build-mac.sh scripts/build-mac.sh.backup
    
    # Sukuriame naują versiją su npx
    cat > scripts/build-mac.sh << 'EOF'
#!/bin/bash

echo "🚀 Pradedamas Mac build Barupasas programėlei..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Lokalus Mac build (daug greičiau)"

# Patikriname ar EAS CLI yra pasiekiamas per npx
if ! npx eas-cli --version &> /dev/null; then
    echo "📦 EAS CLI bus atsisiųstas automatiškai per npx..."
fi

# Prisijungiame prie Expo
echo "🔐 Prisijungiame prie Expo..."
npx eas-cli login

# Mac build su iOS platforma
echo "🔨 Pradedamas Mac build..."
npx eas-cli build --platform ios --profile mac --local

echo "✅ Mac build baigtas!"
echo "📱 .ipa failas yra build/ios/ aplanke"
echo "💡 Dabar galite įdiegti programėlę į iPhone per Xcode arba TestFlight"
EOF

    echo "✅ build-mac.sh atnaujintas!"
fi

# Atnaujinsime build-xcode.sh
if [ -f "scripts/build-xcode.sh" ]; then
    echo "📝 Atnaujinsime build-xcode.sh..."
    cp scripts/build-xcode.sh scripts/build-xcode.sh.backup
    
    # Sukuriame naują versiją su npx
    cat > scripts/build-xcode.sh << 'EOF'
#!/bin/bash

echo "🚀 Pradedamas Xcode build Barupasas programėlei..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Xcode build (greičiausias)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Generuojame iOS projektą
echo "📱 Generuojame iOS projektą..."
npx @expo/cli run:ios --device

echo "✅ Xcode build baigtas!"
echo "📱 Programėlė automatiškai įdiegta į iPhone"
echo "💡 Dabar galite testuoti programėlę tiesiogiai telefone"
EOF

    echo "✅ build-xcode.sh atnaujintas!"
fi

echo ""
echo "✅ Greitas sprendimas baigtas!"
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
echo ""
echo "💡 npx automatiškai atsisiunčia paketus be permissions problemų!"
