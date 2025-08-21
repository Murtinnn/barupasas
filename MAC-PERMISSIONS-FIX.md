# 🔧 Mac Permissions Problemų Sprendimas

## 🚨 Problema

Mac įrenginyje gaunate klaidas:
```
npm ERR! code EACCES
npm ERR! Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/@expo'
```

## 💡 Sprendimai

### 1. ⚡ Greitas Sprendimas (Rekomenduojama)

```bash
cd mobile
./scripts/quick-fix.sh
```

**Ką daro:**
- Atnaujina build scriptus, kad naudotų `npx`
- `npx` automatiškai atsisiunčia paketus be permissions problemų
- Nereikia įdiegti globalių paketų

### 2. 🍺 Homebrew Sprendimas

```bash
cd mobile
./scripts/install-mac-tools.sh
```

**Ką daro:**
- Įdiegia Node.js, Expo CLI ir EAS CLI per Homebrew
- Homebrew automatiškai išsprendžia permissions problemas
- Rekomenduojama ilgalaikiam sprendimui

### 3. 🔧 Manual Permissions Fix

```bash
cd mobile
./scripts/fix-mac-permissions.sh
```

**Ką daro:**
- Atnaujina scriptus, kad naudotų `npx`
- Išsprendžia permissions problemas programiškai

## 🚀 Po Sprendimo

Kai permissions problemos išspręstos, galite naudoti:

```bash
# EAS Mac build
./scripts/build-mac.sh

# Xcode build
./scripts/build-xcode.sh
```

## 📋 Kas Yra npx?

**npx** yra npm įrankis, kuris:
- Automatiškai atsisiunčia paketus, jei jie neįdiegti
- Nereikalauja globalių paketų įdiegimo
- Išsprendžia permissions problemas
- Veikia iš karto be papildomos konfigūracijos

## 🔍 Patikrinimas

Patikrinkite ar veikia:

```bash
# Expo CLI
npx @expo/cli --version

# EAS CLI
npx eas-cli --version
```

## 💡 Patarimai

1. **Visada naudokite `npx`** - tai išsprendžia permissions problemas
2. **Homebrew** yra geriausias sprendimas ilgalaikiam naudojimui
3. **Greitas sprendimas** veikia iš karto
4. **Nereikia sudo** arba keisti permissions

## 🚨 Jei Problemos Lieka

1. Patikrinkite ar Node.js įdiegtas: `node --version`
2. Patikrinkite ar npm veikia: `npm --version`
3. Naudokite `npx` vietoj globalių paketų
4. Įdiegiame per Homebrew

## 📞 Pagalba

Jei kyla problemų:
1. Paleiskite `./scripts/quick-fix.sh`
2. Patikrinkite šias instrukcijas
3. Naudokite `npx` vietoj globalių paketų
4. Įdiegiame per Homebrew

---

**npx yra sprendimas permissions problemoms!** 🎯
