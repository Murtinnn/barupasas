# 🍎 Mac Build Instrukcijos Barupasas

## Greičiausi Build Metodai

### 1. 🚀 EAS Mac Build (Rekomenduojama)
```bash
# Naudokite Mac build profilį
./scripts/build-mac.sh
```

**Privalumai:**
- ⚡ 3-5x greičiau nei cloud build
- 🖥️ Naudoja jūsų Mac resursus
- 📱 Automatiškai generuoja .ipa failą

### 2. 🔨 Xcode Build (Greičiausias)
```bash
# Tiesioginis Xcode build
./scripts/build-xcode.sh
```

**Privalumai:**
- ⚡ 5-10x greičiau nei cloud build
- 📱 Automatiškai įdiegia į iPhone
- 🧪 Real-time debugging

## 📋 Reikalavimai

- **macOS** 12.0 arba naujesnis
- **Xcode** 14.0 arba naujesnis
- **Node.js** 18.0 arba naujesnis
- **Expo CLI** ir **EAS CLI**

## 🛠️ Įdiegimas

```bash
# Įdiegiame reikalingus įrankius
npm install -g @expo/cli
npm install -g eas-cli

# Prisijungiame prie Expo
eas login
```

## 🔧 Build Konfigūracija

Jūsų `eas.json` jau sukonfigūruotas su Mac build profiliu:

```json
"mac": {
  "extends": "production",
  "platform": "ios",
  "ios": {
    "resourceClass": "m-medium",
    "buildConfiguration": "Release"
  }
}
```

## 📱 Build Rezultatai

- **EAS Mac Build**: `.ipa` failas `build/ios/` aplanke
- **Xcode Build**: Automatiškai įdiegta į iPhone

## 🚨 Problemų Sprendimas

### Build užtrunka ilgai
- Naudokite Mac build profilį vietoj cloud
- Įsitikinkite, kad Mac turi pakankamai RAM (8GB+)

### Xcode klaidos
- Atnaujinkite Xcode iki naujausios versijos
- Patikrinkite iOS deployment target (15.1)

### EAS klaidos
- Patikrinkite interneto ryšį
- Įsitikinkite, kad esate prisijungęs prie Expo

## 💡 Patarimai

1. **Visada naudokite Mac build** - tai daug greičiau
2. **Xcode build** yra greičiausias testavimui
3. **EAS Mac build** yra geriausias produkcijai
4. **Cloud build** naudokite tik kai nėra Mac

## 📞 Pagalba

Jei kyla problemų:
1. Patikrinkite šias instrukcijas
2. Patikrinkite Xcode versiją
3. Įsitikinkite, kad esate prisijungęs prie Expo
