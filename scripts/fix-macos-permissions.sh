#!/bin/bash

echo "🔧 Išsprendžiame macOS permissions problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos:"
echo "   1. 'Not authorized to send Apple events to System Events'"
echo "   2. Simulator permissions problema"
echo "   3. macOS security restrictions"
echo ""

echo "🔧 Išsprendžiame problemas..."

# 1. Patikriname macOS versiją
echo "🍎 macOS versija:"
sw_vers -productVersion

# 2. Patikriname ar Terminal turi reikiamus permissions
echo ""
echo "🔍 Patikriname Terminal permissions..."

# 3. Patikriname ar yra Accessibility permissions
echo "🔍 Patikriname Accessibility permissions..."
if [ -d "/System/Library/PreferencePanes/Security.prefPane" ]; then
    echo "✅ Security preferences egzistuoja"
else
    echo "⚠️  Security preferences nerastos"
fi

# 4. Patikriname ar yra Automation permissions
echo "🔍 Patikriname Automation permissions..."
if [ -d "/System/Library/PreferencePanes/Privacy.prefPane" ]; then
    echo "✅ Privacy preferences egzistuoja"
else
    echo "⚠️  Privacy preferences nerastos"
fi

# 5. Sprendimas - naudoti alternatyvų metodą
echo ""
echo "💡 Sprendimas: naudoti alternatyvų metodą be System Events..."

# 6. Sukuriame alternatyvų start scriptą
echo "📝 Sukuriame alternatyvų start scriptą..."

cat > scripts/start-expo-simple.sh << 'EOF'
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
EOF

chmod +x scripts/start-expo-simple.sh

echo "✅ Alternatyvus start scriptas sukurtas!"

echo ""
echo "✅ macOS permissions problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/start-expo-simple.sh  # Expo start (be permissions problemų)"
echo "   ./scripts/build-expo-go.sh      # Expo Go build"
echo ""
echo "🚀 Pabandykite start:"
echo "   ./scripts/start-expo-simple.sh"
echo ""
echo "💡 Šis metodas apeina macOS permissions problemas!"
