#!/bin/bash

echo "🔧 Išsprendžiame versijų nesutapimo problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos:"
echo "   1. @react-native-community/datetimepicker@8.4.4 - expected: 8.4.1"
echo "   2. react-native-reanimated@4.0.2 - expected: ~3.17.4"
echo "   3. react-native-svg@15.12.1 - expected: 15.11.2"
echo ""

echo "🔧 Išsprendžiame problemas..."

# 1. Pašaliname netinkamas versijas
echo "🗑️  Pašaliname netinkamas versijas..."
npm uninstall @react-native-community/datetimepicker react-native-reanimated react-native-svg

# 2. Įdiegiame teisingas versijas
echo "📦 Įdiegiame teisingas versijas..."

echo "📦 Įdiegiame @react-native-community/datetimepicker@8.4.1..."
npm install @react-native-community/datetimepicker@8.4.1

echo "📦 Įdiegiame react-native-reanimated@3.17.4..."
npm install react-native-reanimated@3.17.4

echo "📦 Įdiegiame react-native-svg@15.11.2..."
npm install react-native-svg@15.11.2

# 3. Atnaujinsime babel.config.js su reanimated plugin
echo "📝 Atnaujinsime babel.config.js..."

cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
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
echo "✅ Versijų nesutapimo problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/build-expo-go.sh    # Expo Go build"
echo "   ./scripts/build-mac.sh        # EAS Mac build"
echo "   ./scripts/build-xcode.sh      # Xcode build"
echo ""
echo "🚀 Pabandykite build:"
echo "   ./scripts/build-expo-go.sh"
echo ""
echo "💡 Versijos dabar turėtų sutapti!"
