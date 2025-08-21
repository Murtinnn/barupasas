#!/bin/bash

echo "🔧 Išsprendžiame Mac Git konfliktų problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problema: Lokalūs pakeitimai konfliktuoja su serverio pakeitimais"
echo "💡 Sprendimas: Stash lokalius pakeitimus ir pull naujų"
echo ""

# Patikriname Git statusą
echo "📋 Git statusas:"
git status --short

echo ""
echo "🔧 Išsprendžiame problemas..."

# 1. Stash lokalius pakeitimus
echo "💾 Stash lokalius pakeitimus..."
git stash push -m "Lokalių pakeitimų backup prieš pull"

# 2. Pull naujų pakeitimų
echo "⬇️  Pull naujų pakeitimų..."
git pull origin main

# 3. Patikriname ar pull pavyko
if [ $? -eq 0 ]; then
    echo "✅ Nauji pakeitimai sėkmingai pullinti!"
    
    # 4. Patikriname ar reikia pop stash
    if git stash list | grep -q "Lokalių pakeitimų backup"; then
        echo ""
        echo "💡 Lokalūs pakeitimai buvo išsaugoti stash'e"
        echo "🔍 Patikrinkite ar norite juos atkurti:"
        echo "   git stash show -p"
        echo ""
        echo "🔄 Jei norite atkurti:"
        echo "   git stash pop"
        echo ""
        echo "🗑️  Jei norite ištrinti:"
        echo "   git stash drop"
    fi
else
    echo "❌ Pull nepavyko. Patikrinkite Git statusą:"
    git status
    exit 1
fi

echo ""
echo "✅ Git konfliktų problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/build-mac.sh        # EAS Mac build"
echo "   ./scripts/build-xcode.sh      # Xcode build"
echo "   ./scripts/build-xcode-direct.sh # Tiesioginis Xcode build"
echo ""
echo "🚀 Pabandykite build:"
echo "   ./scripts/build-xcode-direct.sh"
echo ""
echo "💡 Šis metodas apeina EAS problemas ir yra greičiausias!"
