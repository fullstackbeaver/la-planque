# 🚀 Build System - Générateur de Sites Statiques

Un système de build léger et rapide basé sur **Bun** pour créer des sites statiques avec un système de **composants HTML réutilisables**, la **compilation SCSS** et un **serveur de développement intégré**.

## ✨ Fonctionnalités

- **🔧 Composants HTML natifs** : Créez vos propres balises HTML personnalisées (ex: `<my-button>`)
- **🎨 Compilation SCSS intelligente** : Agrégation automatique des styles par composant/page
- **📦 Système de slots** : Injection de contenu dans les composants (comme React/Vue)
- **🏷️ Héritage des attributs** : Les classes et attributs se propagent automatiquement aux templates
- **👁️ Watch mode** : Rebuild instantané à la modification des fichiers
- **🌐 Serveur dev intégré** : Serveur web local avec Bun (port 3000)
- **⚡ Ultra-rapide** : Utilise Bun pour des builds instantanés

---

## 📁 Structure du Projet

```
project/
├── build.ts              # Ce script
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── button/
│   │   │   ├── button.html
│   │   │   └── button.scss
│   │   └── card/
│   │       ├── card.html
│   │       └── card.scss
│   ├── pages/           # Pages HTML finales
│   │   ├── index.html
│   │   └── about.html
│   ├── styles/          # Styles globaux/partagés
│   ├── assets/          # Images, fonts, etc.
│   └── main.scss        # Point d'entrée SCSS principal
└── public/              # 🎯 Dossier de sortie (généré)
```

---

## 🚀 Installation

```bash
# Prérequis : Bun doit être installé
curl -fsSL https://bun.sh/install | bash

# Installer les dépendances
bun install bun glob chokidar
```

---

## 🎮 Utilisation

### Build unique
```bash
bun run build.ts
```

### Mode développement (Watch)
```bash
bun run build.ts --watch
```
Surveille tous les fichiers dans `src/` et rebuild automatiquement.

### Serveur de développement
```bash
bun run build.ts --serve
```
Lance un serveur sur `http://localhost:3000` avec hot-reload intégré.

---

## 🧩 Système de Templates

### 1. Création d'un Composant

Créez un dossier dans `src/components/[nom-composant]/` :

**src/components/my-button/my-button.html**
```html
<button class="btn">
  <slot/>
</button>
```

**src/components/my-button/my-button.scss**
```scss
.btn {
  padding: 10px 20px;
  background: blue;
  color: white;
  border: none;
  border-radius: 4px;
  
  &:hover {
    background: darkblue;
  }
}
```

### 2. Utilisation dans une Page

**src/pages/index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Utilisation simple -->
  <my-button>Cliquez-moi</my-button>
  
  <!-- Avec attributs -->
  <my-button class="primary" data-id="123" disabled>
    Envoyer
  </my-button>
</body>
</html>
```

### 3. Système de Slots

Le contenu entre les balises ouvrantes et fermantes est injecté dans le `` :

```html
<!-- Composant : card.html -->
<article class="card">
  <header>
    <h2><slot/></h2>
  </header>
  <div class="content">
    {children}  <!-- Alternative au slot -->
  </div>
</article>
```

**Règles des slots :**
- `<slot/>` : Injection du contenu
- `{children}` : Syntaxe alternative (remplacée après les slots)
- Si aucun slot n'est trouvé, le contenu est injecté après la première balise ouvrante

### 4. Héritage des Attributs

Les attributs de la balise personnalisée sont automatiquement fusionnés avec le template :

| Attribut Source | Comportement |
|----------------|--------------|
| `class` | Fusionne avec les classes existantes du template (pas de doublon) |
| `data-*` | Ajouté tel quel |
| Attributs booléens (`disabled`, `hidden`, etc.) | Ajoutés sans valeur |
| Autres attributs (`id`, `type`, etc.) | Ajoutés avec leur valeur |

**Exemple :**
```html
<!-- Utilisation -->
<my-card class="large" data-user="42" id="main-card">
  Contenu
</my-card>

<!-- Template resultat -->
<article class="card large" data-user="42" id="main-card">
  Contenu
</article>
```

### 5. Nesting de Composants

Les composants peuvent s'imbriquer (jusqu'à 100 niveaux de profondeur) :

```html
<my-card>
  <my-button class="outline">Annuler</my-button>
  <my-button class="primary">Valider</my-button>
</my-card>
```

---

## 🎨 Gestion des Styles

### Organisation recommandée

1. **Styles globaux** : `src/styles/` (variables, mixins, reset)
2. **Styles de composants** : `src/components/[nom]/[nom].scss`
3. **Styles de pages** : `src/pages/[page]/[page].scss`
4. **Point d'entrée** : `src/main.scss`

### Compilation

Le système génère automatiquement `public/style.css` en agrégeant :
1. Tous les fichiers `.scss` de `src/styles/`
2. Tous les `.scss` des dossiers de composants
3. Tous les `.scss` des dossiers de pages
4. `src/main.scss`

Utilise `@use` pour éviter les conflits de namespace :
```scss
// main.scss
@use 'src/styles/variables' as *;
@use 'src/components/button/button' as *;
```

---

## 🔧 API Détaillée

### Fonctions Internes

#### `parseAttributes(tagString)`
Parse une balise HTML et extrait :
- `classes` : Tableau des classes
- `dataAttrs` : Objet des data-attributes
- `otherAttrs` : Autres attributs avec valeur
- `booleanAttrs` : Attributs booléens (sans valeur)

#### `injectAttributes(template, attrs)`
Injecte les attributs parsés dans le template HTML.

#### `injectSlot(template, slotContent)`
Injecte le contenu dans les slots du template.

#### `collectComponentStyles(path)`
Collecte récursivement tous les fichiers `.scss`.

---

## ⚠️ Limitations & Bonnes Pratiques

1. **Balises auto-fermantes** : Impossible d'injecter du contenu (`<my-btn />`)
2. **Noms de composants** : Doivent contenir un tiret (`my-component`, pas `component`)
3. **Conflits de classes** : Les classes sont fusionnées (pas remplacées)
4. **Tags natifs protégés** : Impossible de surcharger les balises HTML standard (`div`, `span`, etc.)

---

## 🐛 Débogage

Le script affiche des logs détaillés :
- `💻` : Commandes exécutées
- `📄` : Fichiers traités
- `✅` : Succès des opérations
- `⚠️` : Warnings (ex: slot impossible sur balise auto-fermante)
- `❌` : Erreurs de compilation

---

## 📄 License

MIT - Libre d'utilisation et de modification.
