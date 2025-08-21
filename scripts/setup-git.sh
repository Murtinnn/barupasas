#!/bin/bash

echo "🔧 Nustatome Git remote repozitoriją..."
echo "📱 Barupasas Mobile projektui"

# Patikriname ar yra .git aplankas
if [ ! -d ".git" ]; then
    echo "❌ Nerastas .git aplankas. Inicializuojame Git..."
    git init
fi

# Nustatome remote repozitoriją
echo "🌐 Nustatome remote repozitoriją..."
echo "💡 Įveskite savo GitHub repozitorijos URL:"
echo "   Pvz.: https://github.com/Murtinnn/barupasas.git"
echo ""

read -p "GitHub URL: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo "❌ URL negali būti tuščias"
    exit 1
fi

# Pridedame remote
git remote add origin "$GITHUB_URL"

# Patikriname ar pavyko
if git remote -v | grep -q "origin"; then
    echo "✅ Remote repozitorija nustatyta!"
    echo "🌐 Origin: $GITHUB_URL"
    
    # Pridedame visus failus
    echo "📁 Pridedame failus..."
    git add .
    
    # Commitiname
    echo "💾 Commitiname..."
    git commit -m "🚀 Barupasas Mobile - Initial Commit
    
📱 Mobile aplikacija su:
- React Native + Expo
- Mac build konfigūracija
- Build scriptai
- Git workflow"
    
    # Pushiname į main branch
    echo "🚀 Pushiname į main branch..."
    git branch -M main
    git push -u origin main
    
    echo "✅ Git repozitorija sėkmingai nustatyta!"
    echo "📱 Dabar galite naudoti:"
    echo "   ./scripts/git-push.sh    # Push pakeitimų"
    echo "   ./scripts/git-pull.sh    # Pull pakeitimų (Mac)"
    
else
    echo "❌ Nepavyko nustatyti remote repozitorijos"
    exit 1
fi
