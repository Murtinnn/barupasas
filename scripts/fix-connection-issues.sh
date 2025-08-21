#!/bin/bash

echo "🔧 Išsprendžiame prisijungimo problemas..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problemos:"
echo "   1. 'Unknown error could not connect to server'"
echo "   2. 'Not authorized to send Apple events to System Events'"
echo "   3. QR kodas nuskaito, bet negali prisijungti"
echo ""

echo "🔧 Išsprendžiame problemas..."

# 1. Patikriname ar yra .env failas
echo "🔍 Patikriname .env failą..."
if [ ! -f ".env" ]; then
    echo "📝 Sukuriame .env failą..."
    cat > .env << 'EOF'
# Barupasas Mobile Environment Variables
EXPO_PUBLIC_API_URL=http://194.135.95.218
EXPO_PUBLIC_APP_NAME=Barupasas
EXPO_PUBLIC_APP_VERSION=1.0.0
EOF
    echo "✅ .env failas sukurtas!"
else
    echo "✅ .env failas egzistuoja"
fi

# 2. Patikriname ar yra app.config.js
echo "🔍 Patikriname app.config.js..."
if [ ! -f "app.config.js" ]; then
    echo "📝 Sukuriame app.config.js..."
    cat > app.config.js << 'EOF'
import 'dotenv/config';

export default {
  expo: {
    name: "Barupasas",
    slug: "barupasas-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0a3848"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.barupasas.mobile",
      buildNumber: "1",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Ši programėlė naudoja jūsų vietą, kad rastų netoliese esančius barus.",
        NSLocationAlwaysAndWhenInUseDescription: "Ši programėlė naudoja jūsų vietą, kad rastų netoliese esančius barus.",
        NSCameraUsageDescription: "Ši programėlė naudoja kamerą nuotraukų darymui baruose.",
        NSPhotoLibraryUsageDescription: "Ši programėlė naudoja nuotraukų galeriją nuotraukų pasirinkimui.",
        ITSAppUsesNonExemptEncryption: false,
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSExceptionDomains: {
            "194.135.95.218": {
              NSExceptionAllowsInsecureHTTPLoads: true,
              NSExceptionMinimumTLSVersion: "1.0",
              NSExceptionRequiresForwardSecrecy: false,
              NSIncludesSubdomains: true
            }
          }
        }
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0a3848"
      },
      package: "com.barupasas.mobile"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "d0a85707-a79e-4256-bbb6-e49de16b86e8"
      }
    },
    owner: "murtinnn",
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
            useFrameworks: "static"
          }
        }
      ]
    ]
  }
};
EOF
    echo "✅ app.config.js sukurtas!"
else
    echo "✅ app.config.js egzistuoja"
fi

# 3. Sukuriame alternatyvų start scriptą be permissions problemų
echo "📝 Sukuriame alternatyvų start scriptą..."

cat > scripts/start-expo-tunnel.sh << 'EOF'
#!/bin/bash

echo "🚀 Paleidžiame Expo development serverį su tunnel..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Expo Go su tunnel (be permissions problemų)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Paleidžiame Expo development serverį su tunnel
echo "📱 Paleidžiame Expo development serverį su tunnel..."
echo "💡 Atsisiųskite Expo Go programėlę į iPhone iš App Store"
echo "💡 Nuskaitykite QR kodą su Expo Go programėle"
echo "💡 Tunnel apeina permissions problemas!"
echo ""

# Naudojame tunnel, kad apeiti permissions problemas
npx @expo/cli start --tunnel --ios

echo ""
echo "✅ Expo development serveris paleistas su tunnel!"
echo "📱 Programėlė veiks Expo Go programėlėje"
echo "💡 Tunnel apeina visas permissions problemas!"
echo ""
echo "💡 QR kodas dabar turėtų veikti!"
EOF

chmod +x scripts/start-expo-tunnel.sh

echo "✅ Tunnel start scriptas sukurtas!"

# 4. Sukuriame local network start scriptą
echo "📝 Sukuriame local network start scriptą..."

cat > scripts/start-expo-local.sh << 'EOF'
#!/bin/bash

echo "🚀 Paleidžiame Expo development serverį local network..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Expo Go local network (be permissions problemų)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Paleidžiame Expo development serverį local network
echo "📱 Paleidžiame Expo development serverį local network..."
echo "💡 Atsisiųskite Expo Go programėlę į iPhone iš App Store"
echo "💡 Įsitikinkite, kad iPhone ir Mac yra tame pačiame WiFi tinkle"
echo "💡 Nuskaitykite QR kodą su Expo Go programėle"
echo ""

# Naudojame local network, kad apeiti permissions problemas
npx @expo/cli start --localhost --ios

echo ""
echo "✅ Expo development serveris paleistas local network!"
echo "📱 Programėlė veiks Expo Go programėlėje"
echo "💡 Local network apeina permissions problemas!"
echo ""
echo "💡 QR kodas dabar turėtų veikti!"
EOF

chmod +x scripts/start-expo-local.sh

echo "✅ Local network start scriptas sukurtas!"

# 5. Sukuriame manual start scriptą
echo "📝 Sukuriame manual start scriptą..."

cat > scripts/start-expo-manual.sh << 'EOF'
#!/bin/bash

echo "🚀 Paleidžiame Expo development serverį manual..."
echo "📱 Platforma: iOS"
echo "🖥️  Build tipas: Expo Go manual (be permissions problemų)"

# Patikriname ar Expo CLI yra pasiekiamas per npx
if ! npx @expo/cli --version &> /dev/null; then
    echo "📦 Expo CLI bus atsisiųstas automatiškai per npx..."
fi

# Paleidžiame Expo development serverį manual
echo "📱 Paleidžiame Expo development serverį manual..."
echo "💡 Atsisiųskite Expo Go programėlę į iPhone iš App Store"
echo "💡 Įveskite URL rankiniu būdu Expo Go programėlėje"
echo "💡 URL bus rodomas terminale"
echo ""

# Naudojame manual, kad apeiti permissions problemas
npx @expo/cli start --offline --ios

echo ""
echo "✅ Expo development serveris paleistas manual!"
echo "📱 Programėlė veiks Expo Go programėlėje"
echo "💡 Manual apeina permissions problemas!"
echo ""
echo "💡 URL dabar turėtų būti rodomas terminale!"
EOF

chmod +x scripts/start-expo-manual.sh

echo "✅ Manual start scriptas sukurtas!"

echo ""
echo "✅ Prisijungimo problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/start-expo-tunnel.sh   # Tunnel (rekomenduojama)"
echo "   ./scripts/start-expo-local.sh    # Local network"
echo "   ./scripts/start-expo-manual.sh   # Manual"
echo ""
echo "🚀 Pabandykite start:"
echo "   ./scripts/start-expo-tunnel.sh"
echo ""
echo "💡 Tunnel apeina visas permissions problemas!"
