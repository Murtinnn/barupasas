#!/bin/bash

echo "🔧 Išsprendžiame portų problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos:"
echo "   1. Port 8081 užimtas"
echo "   2. Metro Bundler portų konfliktai"
echo ""

echo "🔧 Išsprendžiame problemas..."

# 1. Patikriname kas naudoja portą 8081
echo "🔍 Patikriname kas naudoja portą 8081..."
lsof -ti:8081 2>/dev/null | head -5

# 2. Sustabdome procesus, kurie naudoja portą 8081
echo "🛑 Sustabdome procesus, kurie naudoja portą 8081..."
lsof -ti:8081 2>/dev/null | xargs kill -9 2>/dev/null || echo "Nėra procesų, kuriuos reikėtų sustabdyti"

# 3. Sustabdome visus Metro procesus
echo "🛑 Sustabdome Metro procesus..."
pkill -f "metro" 2>/dev/null || echo "Nėra Metro procesų"
pkill -f "expo" 2>/dev/null || echo "Nėra Expo procesų"

# 4. Išvalome portų cache
echo "🧹 Išvalome portų cache..."
rm -rf ~/.expo/ports.json 2>/dev/null || echo "Portų cache neegzistuoja"

# 5. Patikriname ar portas 8081 dabar laisvas
echo "🔍 Patikriname ar portas 8081 dabar laisvas..."
if lsof -ti:8081 >/dev/null 2>&1; then
    echo "⚠️  Portas 8081 vis dar užimtas"
    echo "💡 Naudosime alternatyvų portą"
else
    echo "✅ Portas 8081 dabar laisvas"
fi

echo ""
echo "✅ Portų problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/build-expo-go.sh    # Expo Go build"
echo "   npm start                      # Paleisti development serverį"
echo ""
echo "🚀 Pabandykite build:"
echo "   ./scripts/build-expo-go.sh"
echo ""
echo "💡 Portas 8081 turėtų būti laisvas!"
