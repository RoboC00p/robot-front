# Composants UI – Stratégie

Ce dossier contient les composants du dashboard. On s’appuie sur des librairies **copy-paste** et sur le **Figma MCP** pour une interface efficace sans tout coder à la main.

---

## 1. Librairies utilisées (copy-paste)

### shadcn/ui

- **Site** : [ui.shadcn.com](https://ui.shadcn.com)
- **Principe** : composants React + Tailwind **copiés dans le projet** (pas une dépendance npm opaque). Le code vit sous `src/components/ui/` ; on peut tout modifier.
- **Usage** : ajouter uniquement les composants dont on a besoin (Button, Card, Table, Tabs, Dialog, etc.) via la CLI ou en copiant le code depuis le site.
- **Intérêt** : base solide pour formulaires, cartes, navigation, modales — aligné Next.js + Tailwind.

### Tremor

- **Site** : [tremor.so](https://www.tremor.so)
- **Principe** : composants orientés **dashboard et data** (KPIs, graphiques, cartes métriques). Même approche copy-paste : on intègre les composants dans le repo.
- **Usage** : réutiliser les blocs (ex. `Card`, `Metric`, `AreaChart`, `BarChart`) pour les écrans de pilotage robot (batterie, statut, métriques).
- **Intérêt** : gain de temps sur la partie “dashboard” sans réinventer les visualisations.

**Convention** : les composants issus de shadcn vont dans `src/components/ui/` ; ceux issus de Tremor (ou inspirés Tremor) peuvent vivre dans `src/components/ui/` ou dans un sous-dossier dédié (ex. `src/components/dashboard/`) selon la granularité qu’on choisit.

---

## 2. Figma MCP (design-to-code)

Le **serveur MCP Figma** (activé dans Cursor) permet de :

- **Lire un design** : fournir une URL Figma (écran, frame, composant) → récupération du contexte (structure, styles, parfois code de référence).
- **Design-to-code** : outil `get_design_context` pour obtenir une base de code à partir d’un frame ; on adapte ensuite au projet (Next, Tailwind, composants existants).
- **Code Connect** : lier les composants Figma aux composants du repo pour garder design et code alignés.
- **Règles design system** : générer des règles pour que le code généré respecte nos tokens (couleurs, espacements).

**Workflow envisagé** : concevoir le dashboard dans Figma (layout, cartes robot/batterie/état), puis utiliser le MCP pour “implémenter ce frame” ; les blocs sont ensuite basés sur shadcn/Tremor quand c’est pertinent. On évite de tout coder à la main tout en gardant une UI cohérente.

---

## 3. Organisation du dossier

- **`ui/`** : composants de base (shadcn, éventuellement Tremor réutilisables).
- **Composants métier** : composants spécifiques au dashboard robot (ex. cartes Robot ID, Batterie, État) peuvent vivre à la racine de `components/` ou dans un sous-dossier (ex. `dashboard/`) selon la taille du projet.

À affiner au fil des ajouts (shadcn, Tremor, écrans Figma).
