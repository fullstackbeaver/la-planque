# Méthode de Codage HTML/CSS - La Planque

## Vue d'ensemble

Cette documentation présente la méthode de codage HTML/CSS utilisée pour le projet "La Planque". Elle combine des principes de sémantique HTML, une architecture SCSS modulaire et une approche orientée composants.

## Principes Fondamentaux

### HTML Sémantique
- Utilisation majoritaire de balises sémantiques (`<article>`, `<section>`, `<header>`, etc.)
- Éviter les balises qui n'auraient pour enfant qu'une seule autre balise
- Structure logique et hiérarchique du contenu

### Gestion des Classes
- Ajout de classes uniquement pour :
  - Référencer un composant (nom de composant en classe ou id)
  - Appliquer une modification d'état ou une surcharge localisée
  - Cibler les sous-éléments d'un composant via leur balise, leur position ou leur enchainement
- Baser la mise en page sur un système de grille, en limitant au maximum l'usage des marges (margin / padding)
- Appliquer des classes au niveau des balises, et non l'inverse : on n'applique pas une classe à un élément neutre, on étend une balise (@extends en Sass)

## Architecture SCSS

### Organisation des Fichiers
```
src/
├── styles/
│   ├── colors.scss          # Variables de couleurs
│   ├── sizes.scss           # Variables de tailles
│   ├── fonts.scss           # Définition des polices
│   ├── extendLayout.scss    # Classes utilitaires de layout
│   ├── extendSurface.scss   # Classes utilitaires de surface
│   ├── extendBlock.scss     # Classes utilitaires de bloc
│   └── extendTypo.scss      # Classes utilitaires de typographie
└── components/
    ├── card/
    ├── cta/
    ├── hero/
    ├── mainNav/
    └── ...                  # Autres composants
```

### Utilisation des Extensions Sass
- Utilisation intensive de `@extend` pour réutiliser les styles
- Création de classes utilitaires étendues dans les composants spécifiques
- Organisation par thématique (couleurs, tailles, typographie, layout)

## Système de Design

### Palette de Couleurs
```scss
$color-1  : #1F4839;  // Foret
$color-2  : #2F7056;  // Sapin
$color-3  : #61A345;  // Herbe
$color-4  : #AD3C05;  // Feuillage
$color-5  : #D67000;  // Citrouille
$color-6  : #CE8C8D;  // Brique
$color-7  : #DEB150;  // Soleil
$color-8  : #BC8F35;  // Sable
$color-9  : #B5DFFF;  // Ciel
$color-10 : #F4F1EF;  // Nuage
$color-11 : #B2B1AE;  // Cailloux
$color-12 : #29261F;  // Terreau
$color-13 : #FFFFFF;  // Neige
```

### Espacement et Tailles
```scss
$padding-xs     : 8px;
$padding-s      : 12px;
$padding-default: 16px;
$padding-l      : 24px;
$padding-xl     : 32px;

$section-spacing-h: 120px;
$section-spacing-v: 60px;
```

## Patterns de Mise en Page

### Grille Principale
- Utilisation de CSS Grid pour les mises en page complexes
- Système de grille responsive avec `clamp()` pour l'adaptabilité
- Alignement précis des éléments avec `grid-area`

### Layouts Spécifiques
1. **Hero Section** : Grille avec navigation et contenu centré
2. **Photo Gauche/Droite** : Grille asymétrique pour texte + image
3. **Triptyque** : Grille 3 colonnes avec image centrale mise en valeur
4. **Cartes** : Grille flexible pour les collections d'éléments
5. **Footer** : Grille complexe avec zones définies

## Composants Réutilisables

### Card
- Conteneur avec bordure et fond
- Typographie spécifique
- Adaptatif selon le contenu

### CTA (Call To Action)
- Boutons avec états hover/disabled
- Variations de style (primaire, secondaire)
- Support des icônes via masques CSS

### Navigation
- Menus flexibles avec espacements
- Effets de survol avec animations
- Support des états actifs

## Responsive Design

### Approche Mobile-First
- Unités `clamp()` pour les tailles adaptables
- Media queries intégrées dans les définitions de tailles
- Grilles CSS adaptatives avec `grid-template-columns`

### Points de Rupture
- Adaptation automatique aux différentes tailles d'écran
- Pas de breakpoints fixes mais des calculs fluides

## Bonnes Pratiques Implémentées

1. **Performance**
   - Minimisation des requêtes HTTP
   - Utilisation de masques SVG pour les icônes
   - Optimisation des polices avec `font-display: swap`

2. **Accessibilité**
   - Utilisation appropriée des attributs ARIA
   - Labels pour les formulaires
   - Contraste des couleurs conforme aux standards

3. **Maintenabilité**
   - Organisation modulaire du code
   - Nommage cohérent des variables et classes
   - Séparation claire entre structure et présentation

## Recommandations d'Amélioration

1. **Documentation**
   - Créer une bibliothèque de composants visuelle (style guide)
   - Documenter les classes utilitaires dans un fichier dédié

2. **Structure**
   - Renommer certains composants pour plus de clarté sémantique
   - Centraliser les variables globales dans un seul fichier

3. **Performance**
   - Optimiser les images avec des formats modernes (WebP)
   - Implémenter le chargement différé (lazy loading) plus systématiquement

Cette méthode permet une approche cohérente et maintenable du développement front-end, en mettant l'accent sur la sémantique, la réutilisabilité et l'adaptabilité.