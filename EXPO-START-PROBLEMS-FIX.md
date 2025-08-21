# 🔧 Expo Start Problemų Sprendimas

## 🚨 Problemos

### 1. Portų Problema
```
Port 8081 is being used by another process
```

### 2. Versijų Nesutapimas
```
The following packages should be updated for best compatibility:
@react-native-community/datetimepicker@8.4.4 - expected version: 8.4.1
react-native-reanimated@4.0.2 - expected version: ~3.17.4
react-native-svg@15.12.1 - expected version: 15.11.2
```

### 3. macOS Permissions Problema
```
Error: Not authorized to send Apple events to System Events. (-1743)
```

## 💡 Sprendimai

### 1. ⚡ Versijų Nesutapimo Sprendimas (Rekomenduojama)

```bash
cd mobile
./scripts/fix-version-mismatch.sh
```

**Ką daro:**
- Pašalina netinkamas versijas
- Įdiegia teisingas versijas
- Atnaujina babel.config.js
- Išvalo cache

### 2. 🔧 Portų Problemų Sprendimas

```bash
cd mobile
./scripts/fix-port-issues.sh
```

**Ką daro:**
- Sustabdo procesus, kurie naudoja portą 8081
- Išvalo portų cache
- Išsprendžia Metro Bundler konfliktus

### 3. 🍎 macOS Permissions Problemų Sprendimas

```bash
cd mobile
./scripts/fix-macos-permissions.sh
```

**Ką daro:**
- Patikrina macOS permissions
- Sukuria alternatyvų start scriptą
- Apeina System Events problemas

### 4. 🚀 Alternatyvus Start (Be Problemų)

```bash
cd mobile
./scripts/start-expo-simple.sh
```

**Ką daro:**
- Naudoja custom portą 8083
- Apeina visas permissions problemas
- Greičiausias būdas paleisti Expo

## 🚀 Po Sprendimo

Kai problemos išspręstos, galite naudoti:

```bash
# Expo start (be problemų)
./scripts/start-expo-simple.sh

# Expo Go build
./scripts/build-expo-go.sh

# EAS Mac build
./scripts/build-mac.sh

# Xcode build
./scripts/build-xcode.sh
```

## 📋 Kodėl Atsiranda Problemos?

**Portų problemos atsiranda, kai:**
1. Kitas Metro Bundler procesas veikia
2. Expo development serveris nebuvo tinkamai sustabdytas
3. Portų cache yra sugadintas

**Versijų problemos atsiranda, kai:**
1. Dependencies versijos nesutampa su Expo versija
2. Paketai buvo įdiegti su netinkamomis versijomis
3. Babel konfigūracija naudoja trūkstamus plugins

**Permissions problemos atsiranda, kai:**
1. macOS neleidžia Terminal naudoti System Events
2. Simulator permissions nėra nustatyti
3. Security restrictions blokuoja automatinius veiksmus

## 🔍 Patikrinimas

Patikrinkite ar veikia:

```bash
# Portų statusas
lsof -ti:8081

# Dependencies versijos
npm list

# macOS permissions
ls -la /System/Library/PreferencePanes/
```

## 💡 Patarimai

1. **Visada naudokite scriptus** - jie automatiškai išsprendžia problemas
2. **start-expo-simple.sh** yra greičiausias būdas paleisti Expo
3. **Išvalykite cache** kai kyla problemų
4. **Naudokite custom portus** kad išvengtumėte konfliktų

## 🚨 Jei Problemos Lieka

1. Patikrinkite ar Node.js versija tinkama
2. Patikrinkite ar npm cache yra švarus
3. Patikrinkite ar .env failas egzistuoja
4. Naudokite alternatyvų start metodą

## 📞 Pagalba

Jei kyla problemų:
1. Paleiskite `./scripts/fix-version-mismatch.sh`
2. Paleiskite `./scripts/fix-port-issues.sh`
3. Paleiskite `./scripts/fix-macos-permissions.sh`
4. Naudokite `./scripts/start-expo-simple.sh`

## 🔄 Workflow Po Fix

```bash
# 1. Išspręskite versijų problemas
./scripts/fix-version-mismatch.sh

# 2. Išspręskite portų problemas
./scripts/fix-port-issues.sh

# 3. Išspręskite permissions problemas
./scripts/fix-macos-permissions.sh

# 4. Paleiskite Expo
./scripts/start-expo-simple.sh
```

---

**start-expo-simple.sh yra greičiausias būdas apeiti visas problemas!** 🎯
