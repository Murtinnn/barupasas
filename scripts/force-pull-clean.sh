#!/bin/bash

echo "🚀 Force pull su clean Mac įrenginyje..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "⚠️  DĖMESIO: Šis scriptas ištrins VISUS lokalus pakeitimus!"
echo "💡 Naudokite tik jei nenorite išsaugoti lokalių pakeitimų"
echo ""

read -p "Ar tikrai norite tęsti? (y/N): " CONFIRM

if [[ $CONFIRM != [yY] ]]; then
    echo "❌ Atšaukta"
    exit 0
fi

echo ""
echo "🔧 Pradedame force pull..."

# 1. Patikriname ar yra .git aplankas
if [ ! -d ".git" ]; then
    echo "❌ Nerastas .git aplankas. Inicializuojame Git..."
    git init
fi

# 2. Patikriname remote
echo "🌐 Dabartiniai remote:"
git remote -v

# 3. Išvalome VISKĄ
echo ""
echo "🗑️  Išvalome VISUS lokalus pakeitimus..."
git clean -fdx

# 4. Resetiname working directory
echo "🔄 Resetiname working directory..."
git reset --hard HEAD

# 5. Pulliname iš remote
echo "⬇️  Pulliname iš remote..."
git pull origin main

# 6. Patikriname ar pavyko
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Force pull sėkmingas!"
    
    # 7. Patikriname statusą
    echo ""
    echo "📋 Git statusas:"
    git status --short
    
    # 8. Patikriname ar nauji scriptai egzistuoja
    echo ""
    echo "🔍 Patikriname ar nauji scriptai egzistuoja..."
    ls -la scripts/start-expo-*.sh
    
    echo ""
    echo "🎯 Dabar galite naudoti:"
    echo "   ./scripts/start-expo-tunnel.sh   # Tunnel start (rekomenduojama)"
    echo "   ./scripts/start-expo-local.sh    # Local network start"
    echo "   ./scripts/start-expo-manual.sh   # Manual start"
    echo ""
    echo "🚀 Pabandykite start:"
    echo "   ./scripts/start-expo-tunnel.sh"
    
else
    echo ""
    echo "❌ Force pull nepavyko"
    echo "💡 Patikrinkite remote konfigūraciją"
    echo "💡 Naudokite: ./scripts/auto-fix-git.sh"
    exit 1
fi
