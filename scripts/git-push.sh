#!/bin/bash

echo "🚀 Pradedamas Git push Barupasas projektui..."
echo "📱 Pridedami visi failai..."

# Pridedame visus failus
git add .

# Patikriname statusą
echo "📋 Git statusas:"
git status --short

# Commitiname pakeitimus
echo "💾 Commitiname pakeitimus..."
git commit -m "🔄 Barupasas Mobile Update - $(date '+%Y-%m-%d %H:%M:%S')

📱 Pridėti nauji failai:
- Mac build konfigūracija
- Build scriptai
- Atnaujinta EAS konfigūracija
- Nauji assets ir konfigūracijos

🔧 Build optimizacijos:
- Mac build profilis
- Xcode build scriptas
- Greitesnis build procesas"

# Pushiname į remote
echo "🚀 Pushiname į remote..."
git push origin master

echo "✅ Git push baigtas!"
echo "📱 Dabar galite Mac įrenginyje paleisti:"
echo "   git pull origin master"
echo "💡 Arba naudoti automatinį pull scriptą:"
echo "   ./scripts/git-pull.sh"
