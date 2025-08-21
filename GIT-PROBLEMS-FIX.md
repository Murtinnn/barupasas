# 🔧 Git Problemų Sprendimas

## 🚨 Problemos

### 1. Branch Pavadinimas
```
error: src refspec master does not match any
```
**Priežastis:** Git branch pavadinimas yra `main`, ne `master`

### 2. Remote Origin
```
error: failed to push some refs to 'https://github.com/Murtinnn/barupasas.git'
```
**Priežastis:** Nėra nustatytas remote origin arba neteisingas URL

## 💡 Sprendimai

### 1. ⚡ Automatinis Sprendimas (Rekomenduojama)

```bash
cd mobile
./scripts/auto-fix-git.sh
```

**Ką daro:**
- Automatiškai išsprendžia visas Git problemas
- Nustato branch į `main`
- Nustato remote origin
- Nustato upstream branch

### 2. 🔧 Manual Sprendimas

```bash
cd mobile
./scripts/fix-git-issues.sh
```

**Ką daro:**
- Interaktyvus Git problemų sprendimas
- Leidžia pasirinkti custom URL

### 3. 🛠️ Rankinis Sprendimas

```bash
# 1. Patikrinkite branch
git branch

# 2. Jei branch yra 'master', pakeiskite į 'main'
git branch -M main

# 3. Nustatykite remote origin
git remote add origin https://github.com/Murtinnn/barupasas.git

# 4. Nustatykite upstream branch
git push -u origin main
```

## 🚀 Po Sprendimo

Kai Git problemos išspręstos, galite naudoti:

```bash
# Push pakeitimų
./scripts/git-push.sh

# Pull pakeitimų (Mac)
./scripts/git-pull.sh
```

## 📋 Kas Yra main vs master?

**GitHub 2020 metais pakeitė default branch pavadinimą:**
- **Seniau:** `master` (default)
- **Dabar:** `main` (default)

**Kodėl tai svarbu:**
- GitHub automatiškai sukuria `main` branch
- Lokalūs projektai gali turėti `master` branch
- Reikia sinchronizuoti branch pavadinimus

## 🔍 Patikrinimas

Patikrinkite ar veikia:

```bash
# Branch pavadinimas
git branch --show-current

# Remote origin
git remote -v

# Git statusas
git status
```

## 💡 Patarimai

1. **Visada naudokite `main` branch** - tai naujas standartas
2. **Automatinis fix** išsprendžia visas problemas
3. **Patikrinkite remote URL** prieš push
4. **Naudokite upstream branch** pirmą kartą

## 🚨 Jei Problemos Lieka

1. Patikrinkite ar GitHub repozitorija egzistuoja
2. Patikrinkite ar turite teises pushinti
3. Patikrinkite ar remote URL teisingas
4. Naudokite automatinį fix scriptą

## 📞 Pagalba

Jei kyla problemų:
1. Paleiskite `./scripts/auto-fix-git.sh`
2. Patikrinkite šias instrukcijas
3. Patikrinkite GitHub repozitorijos URL
4. Įsitikinkite, kad repozitorija egzistuoja

## 🔄 Workflow Po Fix

```bash
# 1. Išspręskite Git problemas
./scripts/auto-fix-git.sh

# 2. Pushinkite pakeitimus
./scripts/git-push.sh

# 3. Mac įrenginyje pullinkite
./scripts/git-pull.sh

# 4. Paleiskite build
./scripts/build-mac.sh
```

---

**Automatinis fix išsprendžia visas Git problemas!** 🎯
