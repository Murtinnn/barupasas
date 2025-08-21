#!/bin/bash

echo "🔄 Pradedamas automatinis Git sync..."
echo "⏰ Sync intervalas: 30 sekundės"
echo "🛑 Sustabdyti sync: Ctrl+C"

# Nustatome sync intervalą (sekundėmis)
SYNC_INTERVAL=30

while true; do
    echo ""
    echo "🕐 $(date '+%H:%M:%S') - Tikriname pakeitimus..."
    
    # Patikriname ar yra naujų pakeitimų
    git fetch origin
    
    LOCAL_COMMIT=$(git rev-parse HEAD)
    REMOTE_COMMIT=$(git rev-parse origin/master)
    
    if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
        echo "🆕 Rasta naujų pakeitimų! Pulliname..."
        git pull origin master
        
        # Automatiškai įdiegiame dependencies
        if [ -f "package.json" ]; then
            echo "📦 Įdiegiame dependencies..."
            npm install
        fi
        
        echo "✅ Pakeitimai atnaujinti!"
    else
        echo "✅ Jokių naujų pakeitimų"
    fi
    
    echo "⏳ Laukiama $SYNC_INTERVAL sekundžių..."
    sleep $SYNC_INTERVAL
done
