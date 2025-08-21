# 🍺 Barupasas Mobile

React Native + Expo mobili programėlė barų lankymui su check-in sistema, žemėlapiais ir draugystėmis.

## 🚀 Greitas Startas

### 1. Serveryje (pirmą kartą):
```bash
cd mobile
./scripts/setup-git.sh
```

### 2. Mac įrenginyje:
```bash
git clone <your-repo-url> barupasas-mobile
cd barupasas-mobile
npm install
chmod +x scripts/*.sh
```

## 📱 Build Instrukcijos

### Mac Build (Rekomenduojama):
```bash
./scripts/build-mac.sh
```

### Xcode Build (Greičiausias):
```bash
./scripts/build-xcode.sh
```

## 🔄 Git Workflow

### Serveryje (kai darote pakeitimus):
```bash
./scripts/git-push.sh
```

### Mac įrenginyje:
```bash
./scripts/git-pull.sh
```

### Automatinis Sync (Mac):
```bash
./scripts/git-sync.sh
```

## 📋 Scriptų Sąrašas

| Scriptas | Aprašymas | Kur naudoti |
|----------|-----------|-------------|
| `setup-git.sh` | Nustato Git repozitoriją | Serveryje (1x) |
| `git-push.sh` | Ikelia pakeitimus į Git | Serveryje |
| `git-pull.sh` | Pullina pakeitimus | Mac |
| `git-sync.sh` | Automatinis sync | Mac |
| `build-mac.sh` | EAS Mac build | Mac |
| `build-xcode.sh` | Xcode build | Mac |

## 🛠️ Technologijos

- **Frontend**: React Native + Expo
- **Backend**: Laravel API
- **Build**: EAS Build + Xcode
- **Platforma**: iOS (Android vėliau)

## 🔧 Konfigūracija

### Environment Variables:
```bash
EXPO_PUBLIC_API_URL=http://194.135.95.218:8001/api/v1
EXPO_PUBLIC_WEB_URL=http://194.135.95.218:8001
EXPO_PUBLIC_BACKEND_URL=http://194.135.95.218:8001
```

### iOS Konfigūracija:
- Deployment Target: iOS 15.1
- Bundle ID: com.barupasas.mobile
- Supports Tablet: false

## 📱 Features

- 🗺️ Žemėlapis su barų lokacijomis
- ✅ Check-in sistema
- 👥 Draugystės ir socialinės funkcijos
- 📸 Nuotraukų darymas
- 🌍 Real-time atnaujinimai

## 🚨 Problemų Sprendimas

### Mac Permissions Problemos:
```bash
# Greitas sprendimas (rekomenduojama)
./scripts/quick-fix.sh

# Homebrew sprendimas
./scripts/install-mac-tools.sh

# Manual fix
./scripts/fix-mac-permissions.sh
```

### Build problemos:
```bash
# Išvalykite cache
rm -rf node_modules package-lock.json
npm install

# iOS build problemos
cd ios && pod install && cd ..
```

### Git problemos:
```bash
# Patikrinkite statusą
git status

# Atstatykite pakeitimus
git reset --hard HEAD
```

## 📞 Pagalba

1. Patikrinkite šį README
2. Patikrinkite `BUILD-MAC.md` Mac build instrukcijoms
3. Patikrinkite `GIT-WORKFLOW.md` Git workflow instrukcijoms
4. Naudokite scriptus automatiškai

## 🔄 Atnaujinimai

Kai darote pakeitimus:
1. **Serveryje**: `./scripts/git-push.sh`
2. **Mac**: `./scripts/git-pull.sh`
3. **Build**: `./scripts/build-mac.sh`

---

**Barupasas Mobile** - Geresnis barų lankymas! 🍺✨
