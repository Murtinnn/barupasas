#!/bin/bash

echo "🔧 Išsprendžiame Git problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos:"
echo "   1. Git branch pavadinimas yra 'main', ne 'master'"
echo "   2. Nėra nustatytas remote origin"
echo ""

# Patikriname branch
echo "📋 Dabartinis branch:"
git branch --show-current

echo ""
echo "🌐 Dabartiniai remote:"
git remote -v

echo ""
echo "🔧 Išsprendžiame problemas..."

# 1. Nustatome remote origin
if ! git remote get-url origin &> /dev/null; then
    echo "🌐 Nustatome remote origin..."
    echo "💡 Įveskite savo GitHub repozitorijos URL:"
    echo "   Pvz.: https://github.com/Murtinnn/barupasas.git"
    echo ""
    
    read -p "GitHub URL: " GITHUB_URL
    
    if [ -z "$GITHUB_URL" ]; then
        echo "❌ URL negali būti tuščias"
        exit 1
    fi
    
    git remote add origin "$GITHUB_URL"
    echo "✅ Remote origin nustatytas: $GITHUB_URL"
else
    echo "✅ Remote origin jau nustatytas"
fi

# 2. Patikriname ar remote URL teisingas
echo ""
echo "🔍 Patikriname remote URL..."
git remote -v

# 3. Nustatome upstream branch
echo ""
echo "🔄 Nustatome upstream branch..."
git push -u origin main

echo ""
echo "✅ Git problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/git-push.sh    # Push pakeitimų"
echo "   ./scripts/git-pull.sh    # Pull pakeitimų (Mac)"
echo ""
echo "📱 Branch pavadinimas: main (ne master)"
echo "🌐 Remote: origin -> $GITHUB_URL"
