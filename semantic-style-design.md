# Semantic Style Design (SSD)
**Une méthodologie de développement front-end moderne centrée sur la sémantique**

Version 1.0 • Février 2025

---

## Table des matières

1. [Manifeste](#manifeste)
2. [Principes fondamentaux](#principes-fondamentaux)
3. [Architecture HTML](#architecture-html)
4. [Architecture CSS](#architecture-css)
5. [Système de composition](#système-de-composition)
6. [Patterns et conventions](#patterns-et-conventions)
7. [Mise en œuvre technique](#mise-en-œuvre-technique)
8. [Migration et adoption](#migration-et-adoption)

---

## Manifeste

### Le constat

L'émergence des frameworks front-end et CSS a entraîné une perte progressive de la notion de sémantique — pourtant au cœur du HTML. Le rôle fondamental du HTML est de donner du sens au contenu à travers ses balises. Mais dans de nombreux projets, ces balises ne servent plus qu'à structurer visuellement l'interface. Elles deviennent des coquilles vides, des conteneurs fonctionnels au service des développeurs.

Pourtant, **la mise en page devrait être l'affaire du CSS, et non du HTML**.

### La vision

Nous affirmons qu'il est urgent de revenir aux fondamentaux. La balise sémantique doit redevenir le pilier de la structuration des pages web. C'est une question de lisibilité, de référencement, et de durabilité du code.

### Les principes directeurs

Le Semantic Style Design repose sur huit principes fondamentaux :

1. **Utiliser majoritairement des balises sémantiques** (`<article>`, `<section>`, `<header>`, etc.)
2. **Éviter les balises qui n'auraient pour enfant qu'une seule autre balise**
3. **Ajouter des classes uniquement pour référencer un composant ou appliquer une modification d'état**
4. **Cibler les sous-éléments d'un composant via leur balise, leur position ou leur enchaînement**
5. **Baser la mise en page sur un système de grille**, en limitant au maximum l'usage des marges
6. **Appliquer des classes au niveau des balises**, et non l'inverse (on étend une balise via `@extend`, pas l'inverse)
7. **Créer des balises custom** pour les composants UI récurrents sans équivalent sémantique natif
8. **Outiller sans complexifier** : le système de build doit faciliter le SSD, pas le contraindre

**Le SSD n'est pas un outil : c'est un état d'esprit.**

> Moins de classes. Plus de sens. Pour un web plus propre, plus durable, plus humain.

---

## Principes fondamentaux

### 1. Hiérarchie sémantique

Le SSD établit une hiérarchie claire dans l'utilisation des balises HTML :

**Niveau 1 : Balises natives HTML5** (priorité maximale)
- Pour le contenu éditorial : `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<aside>`
- Pour la structure : `<main>`, `<figure>`, `<figcaption>`
- Pour le texte : `<h1>`-`<h6>`, `<p>`, `<blockquote>`, `<ul>`, `<ol>`, `<li>`

**Niveau 2 : Balises custom** (pour composants UI)
- Quand aucune balise native n'existe : `<logo>`, `<icon>`, `<testimonial>`
- Règle : doivent contenir un tiret dans leur nom (`my-component`, jamais `component`)

**Niveau 3 : Classes** (usage minimal)
- Référencement de composant : `class="hero"`
- Modificateurs d'état : `class="featured"`, `class="disabled"`
- JAMAIS pour mise en page ou décoration

### 2. La règle de l'enfant unique

**Anti-pattern à éviter :**

```html
<!-- ❌ Mauvais : balise avec un seul enfant -->
<div class="container">
  <div class="wrapper">
    <div class="content">
      <p>Texte</p>
    </div>
  </div>
</div>
```

**Pattern SSD :**

```html
<!-- ✅ Bon : chaque niveau a plusieurs enfants ou un rôle sémantique -->
<article class="card">
  <header>
    <h2>Titre</h2>
    <p>Sous-titre</p>
  </header>
  <div>
    <p>Contenu...</p>
    <a href="#">Lien</a>
  </div>
</article>
```

**Exceptions acceptables :**
- Balises avec rôle ARIA spécifique : `<aside role="banner">`
- Balises custom clarifiantes : `<logo>` au lieu de `<div class="logo">`

### 3. Classes : usage strict

Les classes ne doivent servir qu'à deux fins :

**A. Référencer un composant**

```html
<section class="hero">
  <!-- Entrée CSS pour le composant -->
</section>
```

**B. Modifier un état ou une variante**

```html
<article class="card featured">
  <!-- "card" = composant, "featured" = modificateur -->
</article>

<button class="cta-small" disabled>
  <!-- "cta-small" = variante, "disabled" = état HTML natif -->
</button>
```

**Ce qu'on ne fait JAMAIS :**

```html
<!-- ❌ Classes utilitaires dans le HTML -->
<div class="flex items-center justify-between p-4 bg-white rounded">

<!-- ❌ Classes de mise en page -->
<div class="mt-4 mb-8 ml-2">

<!-- ❌ Classes descriptives de style -->
<p class="text-blue-500 font-bold text-lg">
```

### 4. Grid-first architecture

La mise en page doit être gérée par CSS Grid, pas par des marges ou du positionnement.

**Avantages :**
- Espacement cohérent (via `gap`)
- Layouts complexes simplifiés
- Responsive intégré
- Moins de calculs manuels

**Principe :**

```scss
// ✅ Bon : Grid gère l'espacement
.testimonials {
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(3, 1fr);
}

// ❌ Éviter : Marges conditionnelles
.testimonial {
  margin: 24px;
  
  &:nth-child(3n) {
    margin-right: 0;
  }
}
```

### 5. Cascade intelligente

Le CSS doit exploiter la cascade et les sélecteurs contextuels plutôt que multiplier les classes.

**Structure type :**

```scss
.composant {
  // Styles du composant
  
  header {
    // Styles du header dans ce composant
  }
  
  article {
    // Styles des articles enfants
    
    h2 {
      // Styles des titres dans les articles
    }
  }
  
  &.modificateur {
    // Variante du composant
  }
}
```

---

## Architecture HTML

### Structure type d'une page

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titre de la page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  
  <!-- Header global -->
  <header role="banner">
    <nav aria-label="navigation principale">
      <!-- Navigation -->
    </nav>
  </header>
  
  <!-- Contenu principal -->
  <main>
    
    <!-- Section hero -->
    <section class="hero home">
      <article>
        <h1>Titre principal</h1>
        <p>Accroche</p>
        <a href="#" class="cta">Action</a>
      </article>
    </section>
    
    <!-- Sections de contenu -->
    <section class="features">
      <h2>Nos services</h2>
      <article>
        <h3>Service 1</h3>
        <p>Description</p>
      </article>
      <article>
        <h3>Service 2</h3>
        <p>Description</p>
      </article>
    </section>
    
  </main>
  
  <!-- Footer global -->
  <footer>
    <nav aria-label="liens légaux">
      <!-- Navigation footer -->
    </nav>
  </footer>
  
</body>
</html>
```

### Règles de structuration

**1. Une balise = un rôle sémantique**

```html
<!-- ✅ Bon -->
<article class="testimonial">
  <blockquote>Citation</blockquote>
  <footer>
    <p>Auteur</p>
  </footer>
</article>

<!-- ❌ Mauvais -->
<div class="testimonial">
  <div class="quote">Citation</div>
  <div class="author">Auteur</div>
</div>
```

**2. Hiérarchie des headings**

```html
<!-- ✅ Bon : hiérarchie logique -->
<main>
  <h1>Titre de la page</h1>
  <section>
    <h2>Section 1</h2>
    <article>
      <h3>Sous-section</h3>
    </article>
  </section>
</main>

<!-- ❌ Mauvais : sauts de niveaux -->
<main>
  <h1>Titre</h1>
  <h4>Sous-titre</h4>
</main>
```

**3. Listes pour les collections**

```html
<!-- ✅ Bon -->
<nav>
  <ul>
    <li><a href="#">Lien 1</a></li>
    <li><a href="#">Lien 2</a></li>
  </ul>
</nav>

<!-- ❌ Mauvais -->
<nav>
  <a href="#">Lien 1</a>
  <a href="#">Lien 2</a>
</nav>
```

### Balises custom : quand et comment

**Critères de création :**
- Élément récurrent dans le projet
- Identité forte (logo, icon, badge, etc.)
- Pas d'équivalent sémantique natif
- Usage UI, pas contenu éditorial

**Exemples valides :**

```html
<!-- Composants UI -->
<logo class="dark"></logo>
<icon name="search"></icon>
<product-card data-price="49"></product-card>

<!-- Layouts spécifiques -->
<hero></hero>
<testimonial></testimonial>
```

**Exemples invalides :**

```html
<!-- ❌ Ne PAS remplacer les balises natives -->
<custom-article>  <!-- Utiliser <article> -->
<my-heading>      <!-- Utiliser <h1>-<h6> -->
<para>            <!-- Utiliser <p> -->
```

**Implémentation CSS :**

```scss
logo {
  display: block;
  mask: var(--logo-img);
  -webkit-mask: var(--logo-img);
  
  &.light {
    background-color: #FFFFFF;
    width: 151px;
    height: 148px;
  }
  
  &.dark {
    background-color: #29261F;
    width: 179px;
    height: 178px;
  }
}
```

### Accessibilité intégrée

L'accessibilité doit être native, pas ajoutée après coup.

**Checklist :**

```html
<!-- Labels explicites -->
<label for="email">Votre email</label>
<input type="email" id="email" required>

<!-- Labels cachés visuellement si nécessaire -->
<label for="search" class="visually-hidden">Rechercher</label>
<input type="search" id="search">

<!-- ARIA pour compléter, pas remplacer -->
<nav aria-label="navigation principale">
  <ul>...</ul>
</nav>

<!-- Alt sur images -->
<img src="photo.jpg" alt="Description précise">

<!-- Aria-hidden sur décorations -->
<img src="decoration.svg" alt="" aria-hidden="true">

<!-- États interactifs -->
<button aria-label="Fermer" aria-expanded="false">
  <span aria-hidden="true">×</span>
</button>
```

**Classe helper :**

```scss
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Architecture CSS

### Organisation des fichiers

```
src/
├── styles/
│   ├── reset.scss          # Reset CSS
│   ├── variables.scss      # Design tokens
│   ├── extendBlock.scss    # Extends pour composants
│   ├── extendLayout.scss   # Extends pour layouts
│   ├── extendTypo.scss     # Extends pour typographie
│   └── sizes.scss          # Variables de tailles
├── components/
│   ├── button/
│   │   └── button.scss
│   ├── card/
│   │   └── card.scss
│   └── hero/
│       └── hero.scss
├── pages/
│   ├── home/
│   │   └── home.scss
│   └── about/
│       └── about.scss
└── main.scss               # Point d'entrée
```

### Design tokens (variables.scss)

```scss
:root {
  // Couleurs
  --color-primary: #AD3C05;
  --color-secondary: #BC8F35;
  --color-neutral-dark: #29261F;
  --color-neutral-light: #F4F1EF;
  
  // Espacements (multiples de 8)
  --spacing-xs: 8px;
  --spacing-s: 16px;
  --spacing-m: 24px;
  --spacing-l: 32px;
  --spacing-xl: 60px;
  --spacing-xxl: 120px;
  
  // Typographie
  --font-heading: 'Montaga', serif;
  --font-body: 'Albert Sans', sans-serif;
  
  --font-size-h1: 3.5rem;
  --font-size-h2: 2.5rem;
  --font-size-h3: 2rem;
  --font-size-h4: 1.5rem;
  --font-size-body: 1rem;
  
  // Breakpoints
  --bp-mobile: 768px;
  --bp-tablet: 1024px;
  --bp-desktop: 1440px;
}
```

### Extends et placeholders

Les extends permettent de mutualiser du code sans classes utilitaires dans le HTML.

**extendLayout.scss :**

```scss
%flexCentered {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

%gridContainer {
  display: grid;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-m);
}

%absoluteCentered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**extendBlock.scss :**

```scss
%withBorder {
  border: 2px solid var(--color-neutral-dark);
  border-radius: 4px;
}

%cardBase {
  @extend %withBorder;
  padding: var(--spacing-l);
  background: white;
}

%buttonBase {
  @extend %flexCentered;
  padding: var(--spacing-s) var(--spacing-m);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

**extendTypo.scss :**

```scss
%useMontaga {
  font-family: var(--font-heading);
  font-weight: 400;
}

%useAlbertRegular {
  font-family: var(--font-body);
  font-weight: 400;
}

%useAlbertSemi {
  font-family: var(--font-body);
  font-weight: 600;
}
```

### Structure d'un composant

**button.scss :**

```scss
@use "../../styles/variables.scss" as *;
@use "../../styles/extendBlock.scss";

.cta {
  @extend %buttonBase;
  background-color: var(--color-primary);
  color: white;
  
  &:hover:not(:disabled) {
    background-color: darken(#AD3C05, 10%);
    transform: translateY(-2px);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  // Variantes
  &.cta-small {
    font-size: 0.875rem;
    padding: var(--spacing-xs) var(--spacing-s);
  }
  
  &.cta-secondary {
    background-color: var(--color-secondary);
    
    &:hover:not(:disabled) {
      background-color: darken(#BC8F35, 10%);
    }
  }
  
  // Modificateur data-attribute
  &[data-icon="1"]::before {
    content: url('/assets/icons/arrow.svg');
    margin-right: var(--spacing-xs);
  }
}
```

### Ciblage contextuel

**Principes :**

1. **Position dans le DOM :**

```scss
.hero {
  nav:first-of-type {
    // Premier nav dans hero
  }
  
  article:last-child {
    // Dernier article
  }
}
```

2. **Type de balise :**

```scss
.card {
  h2 {
    // Tous les h2 dans card
  }
  
  article {
    // Tous les articles dans card
    
    p {
      // Paragraphes dans articles dans card
    }
  }
}
```

3. **Combinaison :**

```scss
.testimonial {
  article {
    blockquote {
      font-style: italic;
    }
    
    footer {
      p {
        font-weight: bold;
      }
    }
  }
}
```

4. **Sélecteurs avancés :**

```scss
.footer {
  a:not(:first-of-type) {
    // Tous les liens sauf le premier
  }
  
  nav:has(ul) {
    // Nav qui contient une liste
  }
}
```

### Grid patterns

**Layout principal :**

```scss
.hero {
  display: grid;
  grid-template-areas:
    "nav"
    "content"
    "image";
  gap: var(--spacing-xl);
  
  @media (min-width: 768px) {
    grid-template-areas:
      "nav nav"
      "content image";
    grid-template-columns: 1fr 1fr;
  }
  
  nav {
    grid-area: nav;
  }
  
  article {
    grid-area: content;
  }
  
  figure {
    grid-area: image;
  }
}
```

**Grid imbriquées :**

```scss
.card {
  display: grid;
  grid-template-areas:
    "image header"
    "image content"
    "image footer";
  grid-template-columns: 200px 1fr;
  gap: var(--spacing-m);
  
  img {
    grid-area: image;
  }
  
  header {
    grid-area: header;
    
    // Grid interne
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}
```

**Responsive avec clamp :**

```scss
.container {
  padding: clamp(16px, 4vw, 120px);
  gap: clamp(16px, 3vw, 60px);
}

h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
}
```

### États et modificateurs

**Modificateurs de classe :**

```scss
.card {
  // État de base
  
  &.featured {
    border: 2px solid gold;
  }
  
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
```

**Modificateurs data-attribute :**

```scss
.card {
  &[data-priority="high"] {
    order: -1;
  }
  
  &[data-theme="dark"] {
    background: var(--color-neutral-dark);
    color: white;
  }
}
```

**États CSS natifs :**

```scss
button {
  // État de base
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
```

### Progressive enhancement

```scss
.gallery {
  // Mobile first : stack vertical
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m);
  
  // Tablet : grid 2 colonnes
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop : grid 3 colonnes
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Système de composition

Le SSD peut être appliqué manuellement, mais un système de build améliore considérablement la productivité en permettant de créer des composants réutilisables qui compilent vers du HTML sémantique pur.

### Architecture du système

```
Composants (templates)
      ↓
  Build System
      ↓
HTML Sémantique Final
```

### Types de composants

**1. Composants variables (avec slots)**

Templates réutilisables avec contenu variable.

**Fichier : src/components/card/card.html**

```html
<article class="card">
  <header>
    <h2><slot/></h2>
  </header>
  <div>
    {children}
  </div>
</article>
```

**Utilisation : src/pages/index.html**

```html
<my-card class="featured">
  Titre de la carte
</my-card>
```

**Résultat compilé : public/index.html**

```html
<article class="card featured">
  <header>
    <h2>Titre de la carte</h2>
  </header>
  <div>
  </div>
</article>
```

**2. Composants fixes (sans slots)**

Composants avec contenu identique sur toutes les pages (headers, footers, etc.).

**Fichier : src/components/footer/footer.html**

```html
<footer>
  <nav>
    <ul>
      <li><a href="/about">À propos</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
  <p>© 2025 - Entreprise</p>
</footer>
```

**Utilisation : src/pages/index.html**

```html
<footer></footer>
```

### Système de slots

**Règles :**
- `<slot/>` : injection du contenu
- `{children}` : syntaxe alternative
- Si aucun slot, le contenu est injecté après la première balise ouvrante

**Exemple multi-slots :**

```html
<!-- Template -->
<article class="testimonial">
  <blockquote>
    <slot/>
  </blockquote>
  <footer>
    {children}
  </footer>
</article>

<!-- Utilisation -->
<my-testimonial>
  "Citation ici"
</my-testimonial>
```

### Héritage d'attributs

Les attributs de la balise custom sont fusionnés avec le template.

**Règles de fusion :**

| Attribut | Comportement |
|----------|--------------|
| `class` | Fusion avec classes existantes (pas de doublon) |
| `data-*` | Ajouté tel quel |
| Booléens (`disabled`, `hidden`) | Ajoutés sans valeur |
| Autres (`id`, `type`, etc.) | Ajoutés avec valeur |

**Exemple :**

```html
<!-- Utilisation -->
<my-card class="featured" data-user="42" id="main">
  Contenu
</my-card>

<!-- Template -->
<article class="card">
  <slot/>
</article>

<!-- Résultat -->
<article class="card featured" data-user="42" id="main">
  Contenu
</article>
```

### Nesting de composants

Les composants peuvent s'imbriquer à l'infini.

```html
<!-- Page complexe -->
<my-hero>
  <my-nav>
    <my-button>Connexion</my-button>
  </my-nav>
  
  <my-card class="cta">
    <my-button class="primary">S'inscrire</my-button>
  </my-card>
</my-hero>
```

**Compile vers HTML sémantique pur :**

```html
<section class="hero">
  <nav>
    <button class="btn">Connexion</button>
  </nav>
  
  <article class="card cta">
    <button class="btn primary">S'inscrire</button>
  </article>
</section>
```

### Convention de nommage

**Fichiers :**

```
src/components/my-button/
  ├── my-button.html    # Nom = nom du dossier
  └── my-button.scss    # Nom = nom du composant
```

**Utilisation :**

```html
<my-button>  <!-- Nom du dossier = nom de la balise -->
```

**Protection :**
- Impossible de créer `<div>`, `<span>`, `<article>`, etc.

**Flexibilité :**
- Le nom peut contenir un tiret ou être en camelCase

### Build workflow

```bash
# Build unique
bun run build.js

# Mode watch (développement)
bun run build.js --watch

# Serveur + hot reload
bun run build.js --serve
```

**Ce qui est compilé :**
1. Tous les fichiers HTML de `src/pages/`
2. Remplacement des balises custom par leurs templates
3. Injection des slots et attributs
4. Agrégation de tous les SCSS en un seul `style.css`

---

## Patterns et conventions

### Nomenclature

**Classes de composants :**

```scss
// ✅ Bon : descriptif et en français si pertinent
.hero { }
.testimonial { }
.photoGauche { }  // camelCase

// ❌ Éviter : anglais forcé ou acronymes obscurs
.tstmnl { }
.comp-1 { }
```

**Modificateurs :**

```scss
// ✅ Bon : kebab-case pour variantes
.cta-small { }
.cta-secondary { }

// ✅ Bon : états explicites
.featured { }
.disabled { }
.active { }
```

**Variables Sass :**

```scss
// ✅ Bon : préfixe + description
$section-spacing-v: 120px;
$section-spacing-h: 60px;
$padding-default: 24px;
$color-primary: #AD3C05;
```

### Structure d'un fichier SCSS de composant

```scss
// 1. Imports
@use "../../styles/variables.scss" as *;
@use "../../styles/extendBlock.scss";
@use "../../styles/extendLayout.scss";
@use "../../styles/extendTypo.scss";

// 2. Composant de base
.composant {
  // 2.1 Extends
  @extend %cardBase;
  @extend %useAlbertRegular;
  
  // 2.2 Layout (Grid/Flex)
  display: grid;
  grid-template-areas: "header" "content";
  gap: $spacing-m;
  
  // 2.3 Dimensions
  max-width: 1200px;
  padding: $spacing-l;
  
  // 2.4 Apparence
  background: white;
  border-radius: 4px;
  
  // 2.5 Typographie
  font-size: 1rem;
  
  // 2.6 Transitions
  transition: transform 0.3s ease;
  
  // 3. Enfants (ciblage contextuel)
  header {
    grid-area: header;
    
    h2 {
      @extend %useMontaga;
      font-size: 2rem;
    }
  }
  
  article {
    grid-area: content;
  }
  
  // 4. Modificateurs
  &.featured {
    border: 2px solid gold;
  }
  
  &[data-theme="dark"] {
    background: $color-dark;
    color: white;
  }
  
  // 5. États
  &:hover {
    transform: translateY(-4px);
  }
  
  // 6. Responsive
  @media (max-width: 768px) {
    grid-template-areas:
      "header"
      "content";
  }
}

// 7. Variantes (si nombreuses)
.composant-small {
  @extend .composant;
  padding: $spacing-s;
}
```

### Data-attributes patterns

**Usage métier :**

```html
<product-card 
  data-price="49.99"
  data-currency="EUR"
  data-stock="5">
</product-card>
```

```scss
product-card {
  &[data-stock]::before {
    content: "Stock: " attr(data-stock);
  }
  
  &[data-price]::after {
    content: attr(data-price) " " attr(data-currency);
  }
}
```

**Usage comportemental :**

```html
<section data-filter="price-asc">
  <product-card data-price="29">...</product-card>
  <product-card data-price="49">...</product-card>
</section>
```

```scss
[data-filter="price-asc"] {
  product-card {
    order: var(--price-order);
  }
}
```

**Usage UI :**

```html
<button class="cta" data-icon="arrow">Continuer</button>
```

```scss
.cta[data-icon="arrow"]::after {
  content: "→";
  margin-left: 0.5rem;
}
```

### Performance intégrée

**Images :**

```html
<!-- Format moderne -->
<img src="photo.webp" alt="Description">

<!-- Lazy loading natif -->
<img src="photo.jpg" loading="lazy" alt="Description">

<!-- Dimensions explicites (évite le reflow) -->
<img src="photo.jpg" width="800" height="600" alt="Description">
```

**Fonts :**

```scss
@font-face {
  font-family: 'Albert Sans';
  src: url('/fonts/albert-sans.woff2') format('woff2');
  font-display: swap;  // Évite FOIT
  font-weight: 400;
}
```

**CSS :**

```scss
// ✅ Bon : une seule fois
.hero {
  will-change: transform;
  
  &:hover {
    transform: scale(1.05);
  }
}

// ❌ Éviter : propriétés lourdes partout
* {
  will-change: transform, opacity;
}
```

---

## Mise en œuvre technique

### Setup projet minimum

**1. Structure de base :**

```
projet/
├── src/
│   ├── styles/
│   │   ├── reset.scss
│   │   ├── variables.scss
│   │   └── extendBlock.scss
│   ├── components/
│   ├── pages/
│   │   └── index.html
│   └── main.scss
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── public/              # Généré par le build
├── build.js             # Script de build
└── package.json
```

**2. package.json :**

```json
{
  "name": "mon-projet-ssd",
  "version": "1.0.0",
  "scripts": {
    "build": "bun run build.js",
    "watch": "bun run build.js --watch",
    "dev": "bun run build.js --serve"
  },
  "dependencies": {
    "sass": "^1.69.0"
  },
  "devDependencies": {
    "chokidar": "^3.5.3",
    "glob": "^10.3.10"
  }
}
```

**3. Reset CSS (reset.scss) :**

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  line-height: 1.6;
  color: var(--color-neutral-dark);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
  cursor: pointer;
}

ul, ol {
  list-style: none;
}
```

### Premier composant

**1. Créer le dossier :**

```bash
mkdir -p src/components/button
```

**2. Template HTML (button.html) :**

```html
<button class="cta">
  <slot/>
</button>
```

**3. Styles (button.scss) :**

```scss
@use "../../styles/variables.scss" as *;
@use "../../styles/extendBlock.scss";

.cta {
  @extend %buttonBase;
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-s) var(--spacing-m);
  
  &:hover:not(:disabled) {
    background-color: darken(#AD3C05, 10%);
  }
  
  &.cta-small {
    font-size: 0.875rem;
    padding: var(--spacing-xs) var(--spacing-s);
  }
}
```

**4. Utilisation dans une page :**

```html
<!-- src/pages/index.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <my-button>Cliquer ici</my-button>
  <my-button class="cta-small">Petit bouton</my-button>
</body>
</html>
```

**5. Build :**

```bash
bun run build
```

**6. Résultat (public/index.html) :**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <button class="cta">Cliquer ici</button>
  <button class="cta cta-small">Petit bouton</button>
</body>
</html>
```

### Workflow de développement

**Cycle de travail :**

1. **Définir le composant**
   - Analyser le besoin
   - Choisir la balise sémantique appropriée
   - Créer le template HTML
   
2. **Styler le composant**
   - Définir les extends nécessaires
   - Créer le SCSS
   - Tester les variantes
   
3. **Utiliser dans les pages**
   - Intégrer via balise custom
   - Ajouter modificateurs si besoin
   
4. **Tester et itérer**
   - Mode watch pour feedback instantané
   - Vérifier HTML compilé
   - Ajuster selon besoin

**Commandes utiles :**

```bash
# Développement avec hot reload
bun run dev

# Build production
bun run build

# Vérifier HTML généré
cat public/index.html
```

### Debug et maintenance

**1. Inspecter le HTML compilé**

Toujours vérifier que le HTML final est bien sémantique :

```bash
# Voir le résultat
cat public/index.html

# Chercher les div
grep -n "<div" public/index.html

# Vérifier hiérarchie des headings
grep -n "<h[1-6]" public/index.html
```

**2. Valider l'accessibilité**

```bash
# Vérifier présence des alt
grep -n "img" public/index.html | grep -v "alt="

# Vérifier les labels de formulaires
grep -n "input" public/index.html
```

**3. Performance CSS**

```scss
// Éviter les sélecteurs trop profonds
.a .b .c .d .e .f { }  // ❌ Trop profond

// Préférer
.component {
  .nested {
    .element { }  // ✅ 3 niveaux max
  }
}
```

---

## Migration et adoption

### Depuis un projet existant

**Phase 1 : Audit (1-2 jours)**

1. Identifier les patterns répétitifs
2. Lister les composants à créer
3. Analyser la dette technique HTML

**Phase 2 : Setup (1 jour)**

1. Installer le build system
2. Créer la structure de fichiers
3. Définir les design tokens

**Phase 3 : Migration progressive (2-4 semaines)**

1. Créer 2-3 composants pilotes (button, card, etc.)
2. Convertir une page test
3. Itérer sur les retours
4. Migrer les autres pages progressivement

**Phase 4 : Consolidation (1-2 semaines)**

1. Documenter les composants
2. Former l'équipe
3. Établir les code reviews

### Stratégie d'adoption en équipe

**Pour les développeurs habitués à Tailwind/Atomic CSS :**

```
Avant (Tailwind) :
<div class="flex items-center justify-between p-4 bg-white rounded-lg">

Après (SSD) :
<article class="card">
```

**Avantages à communiquer :**
- HTML lisible et maintenable
- SEO optimisé nativement
- Performance (moins de classes)
- Accessibilité intégrée

**Pour les développeurs habitués à BEM :**

```
Avant (BEM) :
<div class="card">
  <div class="card__header">
    <h2 class="card__title">Titre</h2>
  </div>
  <div class="card__body">
    <p class="card__text">Texte</p>
  </div>
</div>

Après (SSD) :
<article class="card">
  <header>
    <h2>Titre</h2>
  </header>
  <div>
    <p>Texte</p>
  </div>
</article>
```

**Transition :**
- BEM = structuré mais verbeux
- SSD = structuré par la sémantique HTML

### Checklist de conformité SSD

**HTML :**
- [ ] Utilisation de balises sémantiques (pas de `<div>` inutiles)
- [ ] Pas de balises avec enfant unique sauf exception justifiée
- [ ] Classes uniquement pour composants et modificateurs
- [ ] Hiérarchie des headings respectée
- [ ] Labels sur tous les inputs
- [ ] Alt sur toutes les images
- [ ] ARIA seulement pour compléter (pas remplacer)

**CSS :**
- [ ] Grid utilisé pour les layouts
- [ ] Marges minimisées (préférer gap)
- [ ] Extends pour mutualisation
- [ ] Ciblage contextuel (pas de classes partout)
- [ ] Variables pour design tokens
- [ ] Un fichier CSS par composant
- [ ] Responsive via media queries ou clamp

**Architecture :**
- [ ] Composants dans des dossiers dédiés
- [ ] Convention de nommage respectée
- [ ] Accessibilité intégrée
- [ ] Performance considérée (lazy loading, font-display, etc.)

### Anti-patterns à éviter

**1. Div-ite aiguë**

```html
<!-- ❌ Anti-pattern -->
<div class="container">
  <div class="wrapper">
    <div class="content">
      <div class="text">
        <p>Texte</p>
      </div>
    </div>
  </div>
</div>

<!-- ✅ SSD -->
<section class="content">
  <p>Texte</p>
</section>
```

**2. Classes utilitaires en cascade**

```html
<!-- ❌ Anti-pattern -->
<div class="mt-4 mb-8 p-4 bg-white rounded shadow-lg flex items-center">

<!-- ✅ SSD -->
<article class="card">
```

**3. Balises non sémantiques**

```html
<!-- ❌ Anti-pattern -->
<div class="article">
  <div class="header">
    <span class="title">Titre</span>
  </div>
</div>

<!-- ✅ SSD -->
<article>
  <header>
    <h2>Titre</h2>
  </header>
</article>
```

**4. Marges conditionnelles complexes**

```scss
// ❌ Anti-pattern
.card {
  margin: 20px;
  
  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:nth-child(3n) {
    margin-right: 0;
  }
}

// ✅ SSD
.cards-container {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}
```

**5. Extends dans le HTML**

```html
<!-- ❌ Anti-pattern -->
<div class="flex-centered card-base">

<!-- ✅ SSD -->
<article class="card">
```

```scss
// Les extends sont dans le CSS
.card {
  @extend %flex-centered;
  @extend %card-base;
}
```

---

## Conclusion

Le Semantic Style Design est une philosophie de développement qui replace la sémantique HTML au cœur de la création web. En combinant :

1. **Des principes clairs** (sémantique, hiérarchie, accessibilité)
2. **Des patterns éprouvés** (Grid-first, extends, ciblage contextuel)
3. **Un outillage moderne** (build system, composants)

Le SSD permet de créer des sites web :
- **Maintenables** : code lisible et structuré
- **Performants** : HTML léger, CSS optimisé
- **Accessibles** : sémantique native
- **Durables** : standards web respectés

**Ce n'est pas une révolution technique, c'est un retour aux fondamentaux du Web, outillé pour la productivité moderne.**

---

## Ressources

### Standards Web
- [HTML Living Standard](https://html.spec.whatwg.org/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

### Outils recommandés
- **Build system** : Bun, Node.js
- **Préprocesseur CSS** : Sass/SCSS
- **Validation** : W3C HTML Validator, axe DevTools
- **Éditeur** : VS Code avec extensions HTML/SCSS

### Philosophies complémentaires
- **Progressive Enhancement**
- **Mobile First**
- **YAGNI (You Aren't Gonna Need It)**
- **KISS (Keep It Simple, Stupid)**

---

**Document maintenu par la communauté SSD**  
**Dernière mise à jour : Février 2025**  
**Version : 1.0**
