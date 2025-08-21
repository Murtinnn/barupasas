#!/bin/bash

echo "⚡ Force pull naujų pakeitimų Mac įrenginyje..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problema: Lokalūs pakeitimai konfliktuoja su serverio pakeitimais"
echo "💡 Sprendimas: Force pull (perrašys lokalių pakeitimų)"
echo "⚠️  DĖMESIO: Lokalūs pakeitimai bus prarasti!"
echo ""

# Patikriname Git statusą
echo "📋 Dabartinis Git statusas:"
git status --short

echo ""
echo "🔧 Išsprendžiame problemas..."

# 1. Reset lokalius pakeitimus
echo "🔄 Reset lokalius pakeitimus..."
git reset --hard HEAD

# 2. Clean untracked failus
echo "🧹 Clean untracked failus..."
git clean -fd

# 3. Force pull naujų pakeitimų
echo "⬇️  Force pull naujų pakeitimų..."
git fetch origin
git reset --hard origin/main

# 4. Patikriname ar pavyko
if [ $? -eq 0 ]; then
    echo "✅ Nauji pakeitimai sėkmingai pullinti!"
    
    # 5. Patikriname naują statusą
    echo ""
    echo "📋 Naujas Git statusas:"
    git status --short
    
    # 6. Patikriname naujų failų sąrašą
    echo ""
    echo "📁 Nauji failai:"
    ls -la scripts/ | grep -E "(fix|build|git)"
    
else
    echo "❌ Force pull nepavyko. Patikrinkite Git statusą:"
    git status
    exit 1
fi

echo ""
echo "✅ Force pull sėkmingas!"
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
