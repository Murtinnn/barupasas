# 🔧 Dependencies Problemų Sprendimas

## 🚨 Problema

Build nepavyko dėl trūkstamo `react-native-reanimated/plugin` modulio:
```
Cannot find module 'react-native-reanimated/plugin'
```

## 💡 Sprendimai

### 1. ⚡ Greitas Sprendimas (Rekomenduojama)

```bash
cd mobile
./scripts/fix-dependencies.sh
```

**Ką daro:**
- Įdiegia trūkstamus dependencies
- Atnaujina babel.config.js
- Išvalo cache
- Išsprendžia visas dependencies problemas

### 2. 🚀 Expo Go Sprendimas

```bash
cd mobile
./scripts/build-expo-go.sh
```

**Ką daro:**
- Naudoja Expo Go vietoj custom build
- Apeina visas build problemas
- Greičiausias būdas testuoti programėlę

### 3. 🛠️ Rankinis Sprendimas

```bash
# 1. Pašalinkite trūkstamą plugin iš babel.config.js
# 2. Įdiegiame dependencies
npm install

# 3. Išvalome cache
rm -rf node_modules/.cache
rm -rf .expo

# 4. Paleidžiame Expo Go
npx @expo/cli start --ios
```

## 🚀 Po Sprendimo

Kai dependencies problemos išspręstos, galite naudoti:

```bash
# EAS Mac build
./scripts/build-mac.sh

# Xcode build
./scripts/build-xcode.sh

# Tiesioginis Xcode build
./scripts/build-xcode-direct.sh

# Expo Go (rekomenduojama)
./scripts/build-expo-go.sh
```

## 📋 Kodėl Atsiranda Problemos?

**Dependencies problemos atsiranda, kai:**
1. `babel.config.js` naudoja trūkstamus plugins
2. `package.json` neturi reikalingų dependencies
3. Cache yra sugadintas
4. Versijos nesutampa

**Dažniausios priežastys:**
- Trūksta `react-native-reanimated` paketo
- Babel konfigūracijos klaidos
- Sugadintas npm cache

## 🔍 Patikrinimas

Patikrinkite ar veikia:

```bash
# Dependencies sąrašas
npm list

# Babel konfigūracija
cat babel.config.js

# Cache statusas
ls -la node_modules/.cache
```

## 💡 Patarimai

1. **Visada naudokite scriptus** - jie automatiškai išsprendžia problemas
2. **Expo Go** yra greičiausias būdas testuoti
3. **Išvalykite cache** kai kyla problemų
4. **Patikrinkite babel.config.js** prieš build

## 🚨 Jei Problemos Lieka

1. Patikrinkite ar Node.js versija tinkama
2. Patikrinkite ar npm cache yra švarus
3. Patikrinkite ar .env failas egzistuoja
4. Naudokite Expo Go sprendimą

## 📞 Pagalba

Jei kyla problemų:
1. Paleiskite `./scripts/fix-dependencies.sh`
2. Patikrinkite šias instrukcijas
3. Naudokite Expo Go sprendimą
4. Patikrinkite dependencies sąrašą

## 🔄 Workflow Po Fix

```bash
# 1. Išspręskite dependencies problemas
./scripts/fix-dependencies.sh

# 2. Patikrinkite ar veikia
npm start

# 3. Paleiskite build
./scripts/build-expo-go.sh
```

---

**Expo Go yra greičiausias būdas apeiti build problemas!** 🎯
