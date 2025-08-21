# 🍎 Xcode Build Instrukcija

## 🚀 Kaip Padaryti Build Naudojant Xcode

### 📋 Reikalavimai

1. **macOS** - Xcode veikia tik macOS
2. **Xcode** - Įdiegtas iš App Store
3. **iPhone** - Fizinis įrenginys arba Simulator
4. **Apple Developer Account** - Nemokamas arba mokamas

### 🔧 Pirmas Žingsnis - Sukurti iOS Projektą

```bash
cd barupasas-mobile

# Generuojame iOS projektą
npx @expo/cli prebuild --platform ios

# Įdiegiame CocoaPods dependencies
cd ios && pod install && cd ..
```

### 📱 Antras Žingsnis - Atidaryti Xcode

```bash
# Atidarome Xcode projektą
open ios/Barupasas.xcworkspace
```

**SVARBU:** Naudokite `.xcworkspace` failą, ne `.xcodeproj`!

### 🎯 Trečias Žingsnis - Xcode Konfigūracija

#### 1. **Pasirinkite Target**
- Kairėje pusėje pasirinkite `Barupasas` projektą
- Pasirinkite `Barupasas` target

#### 2. **Pasirinkite Device**
- Viršuje pasirinkite iPhone arba Simulator
- iPhone: `iPhone 15 Pro` arba kitas
- Simulator: `iPhone 15 Pro Simulator`

#### 3. **Pasirinkite Build Configuration**
- `Debug` - development
- `Release` - production

### 🚀 Ketvirtas Žingsnis - Build

#### **1. Greitas Build (⌘+R)**
```bash
# Xcode meniu
Product → Run (⌘+R)
```

#### **2. Build be įdiegimo (⌘+B)**
```bash
# Xcode meniu
Product → Build (⌘+B)
```

#### **3. Clean Build (⇧+⌘+K)**
```bash
# Xcode meniu
Product → Clean Build Folder (⇧+⌘+K)
```

### 📱 Penktas Žingsnis - Įdiegimas

#### **iPhone (Fizinis Įrenginys)**
1. Prijunkite iPhone per USB
2. iPhone turi būti "Trusted" kompiuteriui
3. Pasirinkite iPhone kaip target
4. Paspauskite ⌘+R

#### **Simulator**
1. Pasirinkite Simulator kaip target
2. Paspauskite ⌘+R
3. Simulator atsidarys automatiškai

### 🔧 Xcode Problemų Sprendimas

#### **1. "No Provisioning Profile"**
```
Solution: Pasirinkite "Automatically manage signing"
```

#### **2. "Build Failed"**
```
Solution: Clean Build Folder (⇧+⌘+K)
```

#### **3. "Device not found"**
```
Solution: Patikrinkite USB kabelį ir "Trust" nustatymus
```

#### **4. "Code signing failed"**
```
Solution: Pasirinkite teisingą Team ir Bundle Identifier
```

### 📋 Xcode Nustatymai

#### **Signing & Capabilities**
1. Pasirinkite `Barupasas` target
2. Eikite į `Signing & Capabilities`
3. Įjunkite `Automatically manage signing`
4. Pasirinkite `Team` (Apple ID)

#### **Bundle Identifier**
```
com.barupasas.mobile
```

#### **Deployment Target**
```
iOS 15.1 (kaip nurodyta app.config.js)
```

### 🚀 Greitas Build Scriptas

Sukurkite scriptą greičiam Xcode build:

```bash
#!/bin/bash

echo "🚀 Pradedamas Xcode build..."

# Generuojame iOS projektą
echo "📱 Generuojame iOS projektą..."
npx @expo/cli prebuild --platform ios

# Įdiegiame CocoaPods
echo "📦 Įdiegiame CocoaPods..."
cd ios && pod install && cd ..

# Atidarome Xcode
echo "🍎 Atidarome Xcode..."
open ios/Barupasas.xcworkspace

echo "✅ Xcode atidarytas!"
echo "💡 Dabar paspauskite ⌘+R build pradžiai"
```

### 📱 Build Rezultatai

#### **Sėkmingas Build**
- Programėlė automatiškai įdiegta į iPhone/Simulator
- Xcode rodo "Build Succeeded"
- Console rodo logus

#### **Nesėkmingas Build**
- Xcode rodo "Build Failed"
- Error logai rodo problemų vietas
- Reikia išspręsti klaidas

### 💡 Patarimai

1. **Visada naudokite `.xcworkspace`** - ne `.xcodeproj`
2. **Clean Build Folder** kai kyla problemų
3. **Automatically manage signing** išsprendžia daug problemų
4. **iPhone turi būti "Trusted"** kompiuteriui
5. **Pasirinkite teisingą device** viršuje

### 🔄 Workflow

```bash
# 1. Generuojame iOS projektą
npx @expo/cli prebuild --platform ios

# 2. Įdiegiame CocoaPods
cd ios && pod install && cd ..

# 3. Atidarome Xcode
open ios/Barupasas.xcworkspace

# 4. Xcode build (⌘+R)
# 5. Programėlė automatiškai įdiegta!
```

### 📚 Daugiau Informacijos

- **Expo Prebuild**: https://docs.expo.dev/workflow/prebuild/
- **Xcode Build**: https://developer.apple.com/xcode/
- **iOS Development**: https://developer.apple.com/ios/

---

**Xcode build yra greičiausias būdas testuoti programėlę!** 🎯
