Voici une version propre et structurée de votre documentation en Markdown, optimisée pour la lisibilité et sans icônes.

---

# Vue PDF Canvas Viewer

Un composant Vue 3 pour prévisualiser des fichiers PDF dans un canvas, basé sur **pdfjs-dist**. Il permet de naviguer entre plusieurs fichiers, de prévisualiser le contenu, de télécharger le PDF et de personnaliser les dimensions et styles du rendu.

## Installation

Installez le package ainsi que ses dépendances de pair :

```bash
npm install vue-pdf-canvas-viewer-pkg pdfjs-dist vue

```

---

## Usage simple

```vue
<script setup lang="ts">
import "vue-pdf-canvas-viewer-pkg/dist/style.css";
import PdfPreview from "vue-pdf-canvas-viewer-pkg";

const urls = [
  "https://exemple.com/fichier1.pdf",
  "https://exemple.com/fichier2.pdf"
];
</script>

<template>
  <div style="max-width: 600px; margin: 40px auto;">
    <PdfPreview :pdf-urls="urls" />
  </div>
</template>

```

---

## Props disponibles

| Prop | Type | Défaut | Description |
| --- | --- | --- | --- |
| `pdfUrls` | `string[]` | `[]` | Tableau d’URLs des fichiers PDF à afficher |
| `width` | `string` | `"100%"` | Largeur du container/canvas |
| `height` | `string` | `"350px"` | Hauteur du container/canvas |
| `canvasBorder` | `string` | `"1px solid #e5e7eb"` | Style de la bordure du canvas |
| `downloadColor` | `string` | `"#2563eb"` | Couleur du bouton de téléchargement |

---

## Fonctionnalités

* **Rendu Canvas** : Prévisualisation performante des PDF via l'API Canvas.
* **Navigation multi-fichiers** : Système de slider intégré pour passer d'un document à l'autre.
* **Téléchargement** : Bouton natif pour récupérer le fichier PDF actuellement affiché.
* **Responsive** : Adaptation automatique à la largeur du conteneur parent.
* **Personnalisation** : Contrôle des dimensions et des couleurs via les props.

---

## CSS et Dépendances

### Style

Le style par défaut doit être importé manuellement dans votre composant ou votre fichier d'entrée principal :

```typescript
import "vue-pdf-canvas-viewer-pkg/dist/style.css";

```

### Peer Dependencies

Ce composant nécessite les bibliothèques suivantes pour fonctionner correctement :

* **Vue 3**
* **pdfjs-dist**

---

## Licence

MIT