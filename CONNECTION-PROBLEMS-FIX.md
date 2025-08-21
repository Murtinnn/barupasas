# 🔧 Prisijungimo Problemų Sprendimas

## 🚨 Problemos

### 1. QR Kodas Nuskaito, Bet Negali Prisijungti
```
Unknown error could not connect to server
```

### 2. macOS Permissions Problema
```
Error: Not authorized to send Apple events to System Events. (-1743)
```

### 3. Simulator Permissions Problema
```
Command failed: osascript -e tell app "System Events" to count processes whose name is "Simulator"
```

## 💡 Sprendimai

### 1. ⚡ Tunnel Start (Rekomenduojama)

```bash
cd mobile
./scripts/start-expo-tunnel.sh
```

**Ką daro:**
- Naudoja Expo tunnel
- Apeina visas permissions problemas
- QR kodas veiks iš bet kur
- Nereikia WiFi tinklo

**Privalumai:**
- ✅ Veikia iš bet kur
- ✅ Apeina permissions problemas
- ✅ QR kodas visada veiks
- ✅ Nereikia konfigūruoti

### 2. 🔧 Local Network Start

```bash
cd mobile
./scripts/start-expo-local.sh
```

**Ką daro:**
- Naudoja local network
- Apeina permissions problemas
- Reikia WiFi tinklo
- QR kodas veiks lokaliai

**Privalumai:**
- ✅ Greičiau nei tunnel
- ✅ Apeina permissions problemas
- ✅ QR kodas veiks lokaliai
- ⚠️  Reikia WiFi tinklo

### 3. 📱 Manual Start

```bash
cd mobile
./scripts/start-expo-manual.sh
```

**Ką daro:**
- Naudoja offline mode
- Apeina permissions problemas
- Reikia įvesti URL rankiniu būdu
- URL rodomas terminale

**Privalumai:**
- ✅ Visiškai apeina permissions problemas
- ✅ Veikia be WiFi
- ✅ URL rodomas terminale
- ⚠️  Reikia įvesti rankiniu būdu

## 🚀 Kaip Naudoti

### 1. Tunnel Start (Rekomenduojama)

```bash
# Paleiskite tunnel start
./scripts/start-expo-tunnel.sh

# Nuskaitykite QR kodą su Expo Go
# Programėlė automatiškai prisijungs
```

### 2. Local Network Start

```bash
# Paleiskite local network start
./scripts/start-expo-local.sh

# Įsitikinkite, kad iPhone ir Mac yra tame pačiame WiFi
# Nuskaitykite QR kodą su Expo Go
```

### 3. Manual Start

```bash
# Paleiskite manual start
./scripts/start-expo-manual.sh

# Nukopijuokite URL iš terminalo
# Įveskite URL Expo Go programėlėje
```

## 📋 Kodėl Atsiranda Problemos?

**Prisijungimo problemos atsiranda, kai:**
1. macOS neleidžia Terminal naudoti System Events
2. Simulator permissions nėra nustatyti
3. Network konfigūracija neteisinga
4. Firewall blokuoja prisijungimą
5. Portai užimti ar blokuojami

**Permissions problemos atsiranda, kai:**
1. macOS Security & Privacy nustatymai
2. Terminal nėra įtrauktas į Accessibility
3. Automation permissions nėra suteikti
4. System Integrity Protection (SIP) aktyvus

## 🔍 Patikrinimas

Patikrinkite ar veikia:

```bash
# Patikrinkite ar yra .env failas
ls -la .env

# Patikrinkite ar yra app.config.js
ls -la app.config.js

# Patikrinkite network statusą
ifconfig | grep inet

# Patikrinkite portų statusą
lsof -ti:8081
```

## 💡 Patarimai

1. **Visada naudokite tunnel** - jis apeina visas problemas
2. **Patikrinkite WiFi** - jei naudojate local network
3. **Naudokite npx** - kad išvengtumėte permissions problemų
4. **Išvalykite cache** - kai kyla problemų

## 🚨 Jei Problemos Lieka

1. Patikrinkite ar iPhone ir Mac yra tame pačiame WiFi
2. Patikrinkite ar firewall neblokuoja
3. Patikrinkite ar .env failas egzistuoja
4. Naudokite tunnel start

## 📞 Pagalba

Jei kyla problemų:
1. Paleiskite `./scripts/start-expo-tunnel.sh` (rekomenduojama)
2. Paleiskite `./scripts/start-expo-local.sh`
3. Paleiskite `./scripts/start-expo-manual.sh`
4. Patikrinkite network konfigūraciją

## 🔄 Workflow Po Fix

```bash
# 1. Išspręskite prisijungimo problemas
./scripts/fix-connection-issues.sh

# 2. Paleiskite tunnel start (rekomenduojama)
./scripts/start-expo-tunnel.sh

# 3. Nuskaitykite QR kodą su Expo Go
# 4. Programėlė automatiškai prisijungs
```

## 🌐 Network Reikalavimai

**Tunnel:**
- ✅ Veikia iš bet kur
- ✅ Nereikia WiFi
- ✅ Apeina visas problemas
- ⚠️  Gali būti lėčiau

**Local Network:**
- ✅ Greičiau nei tunnel
- ⚠️  Reikia WiFi tinklo
- ⚠️  iPhone ir Mac turi būti tame pačiame tinkle
- ⚠️  Gali būti firewall problemų

**Manual:**
- ✅ Visiškai apeina problemas
- ⚠️  Reikia įvesti URL rankiniu būdu
- ⚠️  URL gali būti ilgas

---

**start-expo-tunnel.sh yra greičiausias būdas išspręsti visas prisijungimo problemas!** 🎯
