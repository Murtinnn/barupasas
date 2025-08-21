#!/bin/bash

echo "🔧 Išsprendžiame Expo virtual entry problemą..."
echo "📱 Barupasas Mobile projektui"

echo ""
echo "🚨 Problema:"
echo "   'Unable to resolve module ./expo/.virtual-metro-entry'"
echo "   Trūksta Expo virtual entry failo po Xcode build"
echo ""

echo "🔧 Išsprendžiame problemas..."

# 1. Patikriname ar yra .expo aplankas
echo "🔍 Patikriname .expo aplanką..."
if [ ! -d ".expo" ]; then
    echo "📁 Sukuriame .expo aplanką..."
    mkdir -p .expo
else
    echo "✅ .expo aplankas egzistuoja"
fi

# 2. Sukuriame virtual-metro-entry failą
echo "📝 Sukuriame virtual-metro-entry failą..."
cat > .expo/.virtual-metro-entry.js << 'EOF'
// Expo Virtual Metro Entry
// This file is required for Expo to work properly

import { registerRootComponent } from 'expo';
import App from '../App';

// Register the main component
registerRootComponent(App);
EOF

echo "✅ virtual-metro-entry.js sukurtas!"

# 3. Sukuriame index.js failą
echo "📝 Sukuriame index.js failą..."
cat > index.js << 'EOF'
import { registerRootComponent } from 'expo';
import App from './App';

// Register the main component
registerRootComponent(App);
EOF

echo "✅ index.js sukurtas!"

# 4. Patikriname ar yra App.js failas
echo "🔍 Patikriname ar yra App.js failas..."
if [ ! -f "App.js" ]; then
    echo "📝 Sukuriame App.js failą..."
    cat > App.js << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barupasas Mobile</Text>
      <Text style={styles.subtitle}>Sveiki atvykę!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a3848',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
  },
});
EOF
    echo "✅ App.js sukurtas!"
else
    echo "✅ App.js egzistuoja"
fi

# 5. Išvalome cache
echo "🧹 Išvalome cache..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf ios/build
rm -rf android/build

# 6. Įdiegiame dependencies iš naujo
echo "📦 Įdiegiame dependencies iš naujo..."
npm install

# 7. Sukuriame .expo aplanką iš naujo
echo "📁 Sukuriame .expo aplanką iš naujo..."
mkdir -p .expo

# 8. Sukuriame virtual-metro-entry failą iš naujo
echo "📝 Sukuriame virtual-metro-entry failą iš naujo..."
cat > .expo/.virtual-metro-entry.js << 'EOF'
// Expo Virtual Metro Entry
// This file is required for Expo to work properly

import { registerRootComponent } from 'expo';
import App from '../App';

// Register the main component
registerRootComponent(App);
EOF

echo "✅ virtual-metro-entry.js atnaujintas!"

# 9. Patikriname ar failai egzistuoja
echo ""
echo "🔍 Patikriname ar failai egzistuoja..."
if [ -f ".expo/.virtual-metro-entry.js" ]; then
    echo "✅ .expo/.virtual-metro-entry.js egzistuoja"
else
    echo "❌ .expo/.virtual-metro-entry.js nerastas"
fi

if [ -f "index.js" ]; then
    echo "✅ index.js egzistuoja"
else
    echo "❌ index.js nerastas"
fi

if [ -f "App.js" ]; then
    echo "✅ App.js egzistuoja"
else
    echo "❌ App.js nerastas"
fi

echo ""
echo "✅ Expo virtual entry problemos išspręstos!"
echo ""
echo "💡 Dabar galite naudoti:"
echo "   ./scripts/xcode-build.sh    # Xcode build"
echo "   ./scripts/start-expo-local.sh # Local network start"
echo ""
echo "🚀 Pabandykite Xcode build iš naujo:"
echo "   ./scripts/xcode-build.sh"
echo ""
echo "💡 Virtual entry failas dabar turėtų egzistuoti!"
