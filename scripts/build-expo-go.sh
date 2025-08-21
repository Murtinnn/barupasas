#!/bin/bash

echo "🚀 Pradedamas Expo Go build Barupasas programėlei..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Expo Go (nereikalauja custom build)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Patikriname ar yra .env failas
if [ ! -f ".env" ]; then
    echo "⚠️  .env failas nerastas. Sukuriame default..."
    cat > .env << 'EOF'
EXPO_PUBLIC_API_URL=http://194.135.95.218:8001/api/v1
EXPO_PUBLIC_WEB_URL=http://194.135.95.218:8001
EXPO_PUBLIC_BACKEND_URL=http://194.135.95.218:8001
EXPO_PUBLIC_APP_NAME=Barupasas
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=false
EOF
    echo "✅ .env failas sukurtas!"
fi

# Paleidžiame Expo development serverį
echo "📱 Paleidžiame Expo development serverį..."
echo "💡 Atsisiųskite Expo Go programėlę į iPhone iš App Store"
echo "💡 Nuskaitykite QR kodą su Expo Go programėle"
echo ""

npx @expo/cli start --ios

echo ""
echo "✅ Expo Go build baigtas!"
echo "📱 Programėlė veiks Expo Go programėlėje"
echo "💡 Tai yra greičiausias būdas testuoti programėlę!"
echo ""
echo "💡 Expo Go apeina visas build problemas!"
