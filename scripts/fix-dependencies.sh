#!/bin/bash

echo "🔧 Išsprendžiame dependencies problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos:"
echo "   1. Trūksta react-native-reanimated paketo"
echo "   2. Babel konfigūracijos klaidos"
echo "   3. Trūkstami dependencies"
echo ""

echo "🔧 Išsprendžiame problemas..."

# 1. Įdiegiame trūkstamus dependencies
echo "📦 Įdiegiame trūkstamus dependencies..."

# Įdiegiame react-native-reanimated (jei reikia)
if ! npm list react-native-reanimated &> /dev/null; then
    echo "📦 Įdiegiame react-native-reanimated..."
    npm install react-native-reanimated
else
    echo "✅ react-native-reanimated jau įdiegtas"
fi

# 2. Įdiegiame kitus reikalingus paketus
echo "📦 Įdiegiame kitus reikalingus paketus..."

# Įdiegiame reikalingus Babel paketus
npm install --save-dev @babel/plugin-proposal-export-namespace-from

# 3. Atnaujinsime babel.config.js
echo "📝 Atnaujinsime babel.config.js..."

cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true
        }
      ]
    ]
  };
};
EOF

echo "✅ babel.config.js atnaujintas!"

# 4. Išvalome cache
echo "🧹 Išvalome cache..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf ios/build
rm -rf android/build

# 5. Įdiegiame dependencies iš naujo
echo "📦 Įdiegiame dependencies iš naujo..."
npm install

echo ""
echo "✅ Dependencies problemos išspręstos!"
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
