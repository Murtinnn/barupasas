#!/bin/bash

echo "🔧 Automatiškai išsprendžiame Git problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos, kurios bus išspręstos:"
echo "   1. Git branch pavadinimas (main vs master)"
echo "   2. Remote origin nustatymas"
echo "   3. Upstream branch nustatymas"
echo ""

# Patikriname ar yra .git aplankas
if [ ! -d ".git" ]; then
    echo "❌ Nerastas .git aplankas. Inicializuojame Git..."
    git init
fi

# Patikriname branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Dabartinis branch: $CURRENT_BRANCH"

# Patikriname remote
echo ""
echo "🌐 Dabartiniai remote:"
git remote -v

echo ""
echo "🔧 Išsprendžiame problemas..."

# 1. Nustatome branch į main
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Keičiame branch į 'main'..."
    git branch -M main
    echo "✅ Branch pakeistas į 'main'"
else
    echo "✅ Branch jau yra 'main'"
fi

# 2. Nustatome remote origin
if ! git remote get-url origin &> /dev/null; then
    echo "🌐 Nustatome remote origin..."
    
    # Naudojame default URL arba klausiame vartotojo
    DEFAULT_URL="https://github.com/Murtinnn/barupasas.git"
    
    echo "💡 Naudojame default URL: $DEFAULT_URL"
    echo "   Jei norite pakeisti, įveskite naują URL:"
    echo "   (palikite tuščią, kad naudotų default)"
    echo ""
    
    read -p "GitHub URL [default: $DEFAULT_URL]: " GITHUB_URL
    
    if [ -z "$GITHUB_URL" ]; then
        GITHUB_URL="$DEFAULT_URL"
    fi
    
    git remote add origin "$GITHUB_URL"
    echo "✅ Remote origin nustatytas: $GITHUB_URL"
else
    echo "✅ Remote origin jau nustatytas"
    GITHUB_URL=$(git remote get-url origin)
fi

# 3. Nustatome upstream branch
echo ""
echo "🔄 Nustatome upstream branch..."
if git push -u origin main 2>/dev/null; then
    echo "✅ Upstream branch nustatytas"
else
    echo "⚠️  Upstream branch nustatyti nepavyko (galbūt remote repozitorija tuščia)"
    echo "💡 Pirmiausia sukurkite repozitoriją GitHub'e"
fi

echo ""
echo "✅ Git problemos išspręstos!"
echo ""
echo "📋 Rezultatas:"
echo "   Branch: $(git branch --show-current)"
echo "   Remote: origin -> $GITHUB_URL"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/git-push.sh    # Push pakeitimų"
echo "   ./scripts/git-pull.sh    # Pull pakeitimų (Mac)"
echo ""
echo "🚀 Pabandykite dar kartą:"
echo "   ./scripts/git-push.sh"
