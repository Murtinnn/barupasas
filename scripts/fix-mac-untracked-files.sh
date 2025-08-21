#!/bin/bash

echo "🔧 Išsprendžiame untracked failų problemas Mac įrenginyje..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos:"
echo "   Untracked working tree files would be overwritten by merge"
echo "   Nauji scriptai serveryje, bet seni failai Mac įrenginyje"
echo ""

echo "🔧 Išsprendžiame problemas..."

# 1. Patikriname ar yra .git aplankas
if [ ! -d ".git" ]; then
    echo "❌ Nerastas .git aplankas. Inicializuojame Git..."
    git init
fi

# 2. Patikriname branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Dabartinis branch: $CURRENT_BRANCH"

# 3. Patikriname remote
echo ""
echo "🌐 Dabartiniai remote:"
git remote -v

# 4. Sprendimas - išvalome untracked failus ir pulliname
echo ""
echo "💡 Sprendimas: išvalome untracked failus ir pulliname..."

# 5. Patikriname untracked failus
echo "🔍 Patikriname untracked failus..."
git status --short

# 6. Išvalome untracked failus
echo "🗑️  Išvalome untracked failus..."
git clean -fd

# 7. Resetiname working directory
echo "🔄 Resetiname working directory..."
git reset --hard HEAD

# 8. Pulliname pakeitimus iš remote
echo "⬇️  Pulliname pakeitimus iš remote..."
git pull origin main

# 9. Patikriname ar pavyko
if [ $? -eq 0 ]; then
    echo "✅ Pakeitimai sėkmingai pullinti!"
    
    # 10. Patikriname statusą
    echo ""
    echo "📋 Git statusas:"
    git status --short
    
    # 11. Patikriname ar nauji scriptai egzistuoja
    echo ""
    echo "🔍 Patikriname ar nauji scriptai egzistuoja..."
    if [ -f "scripts/start-expo-tunnel.sh" ]; then
        echo "✅ start-expo-tunnel.sh egzistuoja"
    else
        echo "❌ start-expo-tunnel.sh nerastas"
    fi
    
    if [ -f "scripts/start-expo-local.sh" ]; then
        echo "✅ start-expo-local.sh egzistuoja"
    else
        echo "❌ start-expo-local.sh nerastas"
    fi
    
    if [ -f "scripts/start-expo-manual.sh" ]; then
        echo "✅ start-expo-manual.sh egzistuoja"
    else
        echo "❌ start-expo-manual.sh nerastas"
    fi
    
    echo ""
    echo "✅ Untracked failų problemos išspręstos!"
    echo ""
    echo "💡 Dabar galite naudoti:"
    echo "   ./scripts/start-expo-tunnel.sh   # Tunnel start (rekomenduojama)"
    echo "   ./scripts/start-expo-local.sh    # Local network start"
    echo "   ./scripts/start-expo-manual.sh   # Manual start"
    echo ""
    echo "🚀 Pabandykite start:"
    echo "   ./scripts/start-expo-tunnel.sh"
    
else
    echo "❌ Pull nepavyko. Patikrinkite remote konfigūraciją."
    echo "💡 Naudokite: ./scripts/auto-fix-git.sh"
    exit 1
fi
