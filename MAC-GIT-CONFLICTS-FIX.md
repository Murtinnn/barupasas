# 🔧 Mac Git Konfliktų Problemų Sprendimas

## 🚨 Problema

Mac įrenginyje gaunate klaidas:
```
error: Your local changes to the following files would be overwritten by merge:
	scripts/build-mac.sh
Please commit your changes or stash them before you merge.
Aborting
```

## 💡 Sprendimai

### 1. ⚡ Greitas Sprendimas (Rekomenduojama)

```bash
cd mobile
./scripts/force-pull-mac.sh
```

**Ką daro:**
- Perrašo lokalių pakeitimų
- Automatiškai pullina naujų pakeitimų
- Išsprendžia konfliktus

**⚠️ DĖMESIO:** Lokalūs pakeitimai bus prarasti!

### 2. 🔧 Saugus Sprendimas

```bash
cd mobile
./scripts/fix-mac-git-conflicts.sh
```

**Ką daro:**
- Išsaugo lokalių pakeitimų stash'e
- Pullina naujų pakeitimų
- Leidžia atkurti lokalių pakeitimų

### 3. 🛠️ Rankinis Sprendimas

```bash
# 1. Stash lokalius pakeitimus
git stash push -m "Lokalių pakeitimų backup"

# 2. Pull naujų pakeitimų
git pull origin main

# 3. Patikrinkite ar norite atkurti lokalių pakeitimų
git stash show -p

# 4. Jei norite atkurti
git stash pop

# 5. Jei norite ištrinti
git stash drop
```

## 🚀 Po Sprendimo

Kai Git konfliktai išspręsti, galite naudoti:

```bash
# EAS Mac build
./scripts/build-mac.sh

# Xcode build
./scripts/build-xcode.sh

# Tiesioginis Xcode build (rekomenduojama)
./scripts/build-xcode-direct.sh
```

## 📋 Kodėl Atsiranda Konfliktai?

**Konfliktai atsiranda, kai:**
1. Lokaliai pakeičiate failus
2. Serveris taip pat pakeičia tuos pačius failus
3. Git negali automatiškai sujungti pakeitimų

**Dažniausios priežastys:**
- Lokaliai redaguojate scriptus
- Serveris atnaujina tuos pačius failus
- Skirtingos versijos tarp serverio ir Mac

## 🔍 Patikrinimas

Patikrinkite ar veikia:

```bash
# Git statusas
git status

# Naujų failų sąrašas
ls -la scripts/

# Git log
git log --oneline -5
```

## 💡 Patarimai

1. **Visada naudokite scriptus** - jie automatiškai išsprendžia problemas
2. **Force pull** yra greičiausias sprendimas
3. **Stash** yra saugus sprendimas
4. **Tiesioginis Xcode build** apeina EAS problemas

## 🚨 Jei Problemos Lieka

1. Patikrinkite ar esate teisingame aplanke
2. Patikrinkite ar Git repozitorija teisinga
3. Patikrinkite ar turite teises pullinti
4. Naudokite force pull scriptą

## 📞 Pagalba

Jei kyla problemų:
1. Paleiskite `./scripts/force-pull-mac.sh`
2. Patikrinkite šias instrukcijas
3. Patikrinkite Git statusą
4. Naudokite tiesioginį Xcode build

## 🔄 Workflow Po Fix

```bash
# 1. Išspręskite Git konfliktus
./scripts/force-pull-mac.sh

# 2. Patikrinkite naujus failus
ls -la scripts/

# 3. Paleiskite build
./scripts/build-xcode-direct.sh
```

---

**Force pull išsprendžia visas Git konfliktų problemas!** 🎯
