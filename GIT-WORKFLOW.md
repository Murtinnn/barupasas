# 🔄 Git Workflow Barupasas Mobile

## 📱 Paprastas Kodas Serverio → Mac

### 1. 🚀 Serveryje (Push)
```bash
cd mobile
./scripts/git-push.sh
```

**Ką daro:**
- Prideda visus failus į Git
- Committina pakeitimus
- Pushina į remote repozitoriją

### 2. 📥 Mac įrenginyje (Pull)
```bash
cd mobile
./scripts/git-pull.sh
```

**Ką daro:**
- Pullina pakeitimus iš serverio
- Įdiegia dependencies
- Atnaujina iOS build failus

### 3. 🔄 Automatinis Sync (Mac)
```bash
cd mobile
./scripts/git-sync.sh
```

**Ką daro:**
- Automatiškai tikrina pakeitimus kas 30 sekundžių
- Pullina pakeitimus kai jie atsiranda
- Įdiegia dependencies

## 🚀 Greitas Workflow

### Serveryje (kai darote pakeitimus):
```bash
# 1. Padarykite pakeitimus
# 2. Ikelkite į Git
./scripts/git-push.sh
```

### Mac įrenginyje:
```bash
# 1. Pullinkite pakeitimus
./scripts/git-pull.sh

# 2. Paleiskite build
./scripts/build-mac.sh    # EAS build
# ARBA
./scripts/build-xcode.sh  # Xcode build
```

## 📋 Failų Sąrašas

### Serveryje:
- `scripts/git-push.sh` - Ikelia pakeitimus į Git
- `scripts/git-pull.sh` - Pullina pakeitimus (Mac)
- `scripts/git-sync.sh` - Automatinis sync (Mac)
- `scripts/build-mac.sh` - Mac build
- `scripts/build-xcode.sh` - Xcode build

### Mac įrenginyje:
- `scripts/git-pull.sh` - Pullina pakeitimus
- `scripts/git-sync.sh` - Automatinis sync
- `scripts/build-mac.sh` - Mac build
- `scripts/build-xcode.sh` - Xcode build

## 🔧 Konfigūracija

### 1. Pirmą kartą Mac įrenginyje:
```bash
# Klonuokite repozitoriją
git clone <your-repo-url> barupasas-mobile
cd barupasas-mobile

# Įdiegiame dependencies
npm install

# Padarome scriptus vykdomus
chmod +x scripts/*.sh
```

### 2. Kas kartą kai darote pakeitimus:
```bash
# Serveryje
./scripts/git-push.sh

# Mac įrenginyje
./scripts/git-pull.sh
```

## 💡 Patarimai

1. **Visada naudokite scriptus** - jie automatiškai daro viską
2. **Automatinis sync** yra patogus kai dirbate intensyviai
3. **Git push** darote tik serveryje
4. **Git pull** darote tik Mac įrenginyje
5. **Build scriptai** paleidžiami tik Mac įrenginyje

## 🚨 Problemų Sprendimas

### Git klaidos:
```bash
# Patikrinkite statusą
git status

# Atstatykite pakeitimus
git reset --hard HEAD
```

### Dependencies problemos:
```bash
# Išvalykite cache
rm -rf node_modules package-lock.json
npm install
```

### iOS build problemos:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## 📞 Pagalba

Jei kyla problemų:
1. Patikrinkite Git statusą: `git status`
2. Patikrinkite remote: `git remote -v`
3. Patikrinkite branch: `git branch`
4. Naudokite scriptus automatiškai
