# 🔧 Ngrok Problemų Sprendimas

## 🚨 Problemos

### 1. Ngrok Global Install Klaida
```
Error: Failed to install @expo/ngrok@^4.1.0 globally: npm install --global @expo/ngrok@^4.1.0 exited with non-zero code: 243
```

### 2. Tunnel Start Klaida
```
Error: npm install --global @expo/ngrok@^4.1.0 exited with non-zero code: 243
```

## 💡 Sprendimai

### 1. ⚡ Local Network Start (Rekomenduojama)

```bash
cd mobile
./scripts/start-expo-simple.sh
```

**Ką daro:**
- Naudoja local network vietoj tunnel
- Apeina ngrok permissions problemas
- QR kodas veiks lokaliai
- Reikia WiFi tinklo

**Privalumai:**
- ✅ Apeina ngrok problemas
- ✅ Greičiau nei tunnel
- ✅ QR kodas veiks lokaliai
- ⚠️  Reikia WiFi tinklo

### 2. 🔧 Local Network Start

```bash
cd mobile
./scripts/start-expo-local.sh
```

**Ką daro:**
- Naudoja local network
- Apeina ngrok permissions problemas
- Reikia WiFi tinklo
- QR kodas veiks lokaliai

### 3. 📱 Manual Start

```bash
cd mobile
./scripts/start-expo-manual.sh
```

**Ką daro:**
- Naudoja offline mode
- Apeina visas permissions problemas
- Reikia įvesti URL rankiniu būdu
- URL rodomas terminale

## 🚀 Kaip Naudoti

### 1. Local Network Start (Rekomenduojama)

```bash
# Paleiskite local network start
./scripts/start-expo-simple.sh

# Įsitikinkite, kad iPhone ir Mac yra tame pačiame WiFi
# Nuskaitykite QR kodą su Expo Go
```

### 2. Patikrinkite WiFi

```bash
# Patikrinkite ar iPhone ir Mac yra tame pačiame WiFi
# Local network veiks tik tame pačiame tinkle
```

## 📋 Kodėl Atsiranda Ngrok Problemos?

**Ngrok problemos atsiranda, kai:**
1. npm global install permissions problema
2. macOS Security & Privacy nustatymai
3. System Integrity Protection (SIP) aktyvus
4. Terminal nėra įtrauktas į Accessibility

**Permissions problemos atsiranda, kai:**
1. macOS neleidžia npm global install
2. User nėra sudo grupėje
3. npm cache sugadintas
4. Node.js versija netinkama

## 🔍 Patikrinimas

Patikrinkite ar veikia:

```bash
# Patikrinkite ar yra WiFi tinklas
ifconfig | grep inet

# Patikrinkite ar iPhone ir Mac yra tame pačiame tinkle
# Patikrinkite WiFi pavadinimą abiejuose įrenginiuose
```

## 💡 Patarimai

1. **Visada naudokite local network** - jis apeina ngrok problemas
2. **Patikrinkite WiFi** - iPhone ir Mac turi būti tame pačiame tinkle
3. **Naudokite npx** - kad išvengtumėte globalaus install
4. **Išvalykite cache** - kai kyla problemų

## 🚨 Jei Problemos Lieka

1. Patikrinkite ar iPhone ir Mac yra tame pačiame WiFi
2. Patikrinkite ar firewall neblokuoja
3. Patikrinkite ar .env failas egzistuoja
4. Naudokite local network start

## 📞 Pagalba

Jei kyla problemų:
1. Paleiskite `./scripts/start-expo-simple.sh` (rekomenduojama)
2. Paleiskite `./scripts/start-expo-local.sh`
3. Paleiskite `./scripts/start-expo-manual.sh`
4. Patikrinkite WiFi konfigūraciją

## 🔄 Workflow Po Fix

```bash
# 1. Įsitikinkite, kad iPhone ir Mac yra tame pačiame WiFi
# 2. Paleiskite local network start (rekomenduojama)
./scripts/start-expo-simple.sh

# 3. Nuskaitykite QR kodą su Expo Go
# 4. Programėlė automatiškai prisijungs
```

## 🌐 Network Reikalavimai

**Local Network:**
- ✅ Greičiau nei tunnel
- ✅ Apeina ngrok problemas
- ⚠️  Reikia WiFi tinklo
- ⚠️  iPhone ir Mac turi būti tame pačiame tinkle

**Tunnel (ngrok):**
- ✅ Veikia iš bet kur
- ❌ Reikalauja globalaus ngrok install
- ❌ Permissions problemos
- ❌ Lėčiau nei local network

**Manual:**
- ✅ Visiškai apeina problemas
- ⚠️  Reikia įvesti URL rankiniu būdu
- ⚠️  URL gali būti ilgas

---

**start-expo-simple.sh yra greičiausias būdas išspręsti ngrok problemas!** 🎯
