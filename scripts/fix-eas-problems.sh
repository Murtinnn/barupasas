#!/bin/bash

echo "🔧 Išsprendžiame EAS problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 EAS problemos:"
echo "   1. 'build.mac.platform' nėra leidžiamas parametras"
echo "   2. Neteisingi build profiliai"
echo "   3. EAS konfigūracijos klaidos"
echo ""

echo "🔧 Išsprendžiame problemas..."

# 1. Atnaujinsime eas.json
echo "📝 Atnaujinsime eas.json..."
cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "mac-build": {
      "extends": "production",
      "ios": {
        "resourceClass": "m-medium",
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF

echo "✅ eas.json atnaujintas!"

# 2. Atnaujinsime build scriptus
echo "📝 Atnaujinsime build scriptus..."

# Atnaujinsime build-mac.sh
if [ -f "scripts/build-mac.sh" ]; then
    echo "📝 Atnaujinsime build-mac.sh..."
    sed -i 's/profile mac --local/profile mac-build --local/' scripts/build-mac.sh
    echo "✅ build-mac.sh atnaujintas!"
fi

echo ""
echo "✅ EAS problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/build-mac.sh        # EAS Mac build"
echo "   ./scripts/build-xcode.sh      # Xcode build"
echo "   ./scripts/build-xcode-direct.sh # Tiesioginis Xcode build"
echo ""
echo "🚀 Pabandykite dar kartą:"
echo "   ./scripts/build-mac.sh"
echo ""
echo "💡 Jei EAS vis dar neveikia, naudokite:"
echo "   ./scripts/build-xcode-direct.sh"
