#!/bin/bash

echo "🔧 Išsprendžiame Git merge konfliktus Mac įrenginyje..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos:"
echo "   'The following untracked working tree files would be overwritten by merge'"
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

# 4. Sprendimas - išsaugome lokalus pakeitimus ir pulliname
echo ""
echo "💡 Sprendimas: išsaugome lokalus pakeitimus ir pulliname..."

# 5. Stash lokalus pakeitimus
echo "💾 Stash lokalus pakeitimus..."
git stash push -m "Lokalus pakeitimai prieš pull"

# 6. Pulliname pakeitimus iš remote
echo "⬇️  Pulliname pakeitimus iš remote..."
git pull origin main

# 7. Patikriname ar pavyko
if [ $? -eq 0 ]; then
    echo "✅ Pakeitimai sėkmingai pullinti!"
    
    # 8. Atstatome lokalus pakeitimus
    echo "🔄 Atstatome lokalus pakeitimus..."
    if git stash list | grep -q "Lokalus pakeitimai prieš pull"; then
        git stash pop
        echo "✅ Lokalus pakeitimai atstatyti!"
    else
        echo "ℹ️  Nėra lokalių pakeitimų atstatyti"
    fi
    
    # 9. Patikriname statusą
    echo ""
    echo "📋 Git statusas:"
    git status --short
    
    echo ""
    echo "✅ Git merge konfliktai išspręsti!"
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
