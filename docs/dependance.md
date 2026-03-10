# Dépendances du projet – robot-front

Ce document recense les dépendances utilisées pour le dashboard robot ROS, par phase d’implémentation (aligné sur [docs/architecture.md](architecture.md) et le plan par phases « Dashboard ROS architecture »). Objectif : versions explicites, pas de dérive entre environnements, `pnpm-lock.yaml` commité.

---

## Gestion des paquets

| Outil        | Usage                             |
| ------------ | --------------------------------- |
| **pnpm**     | Gestion des dépendances, lockfile |
| **Lockfile** | `pnpm-lock.yaml` — à commiter     |

---

## Phase 0 – Bootstrap

| Type      | Package                | Rôle                  | Version (actuelle / cible) |
| --------- | ---------------------- | --------------------- | -------------------------- |
| Framework | `next`                 | Framework, App Router | 16.1.6                     |
| Framework | `react`                | UI, hooks             | 19.2.3                     |
| Framework | `react-dom`            | Rendu DOM             | 19.2.3                     |
| Langage   | `typescript`           | Typage statique       | ^5                         |
| Langage   | `@types/node`          | Types Node.js         | ^20                        |
| Langage   | `@types/react`         | Types React           | ^19                        |
| Langage   | `@types/react-dom`     | Types React DOM       | ^19                        |
| Styling   | `tailwindcss`          | CSS utility-first     | ^4                         |
| Build     | `@tailwindcss/postcss` | Intégration PostCSS   | ^4                         |
| Lint      | `eslint`               | Linting               | ^9                         |
| Lint      | `eslint-config-next`   | Règles Next.js        | 16.1.6                     |

**À faire** : figer les versions exactes dans `package.json` (sans `^`) si besoin de reproductibilité stricte ; garder `pnpm-lock.yaml` à jour et commité.

---

## Phase 1 – architecture/api (DTOs, validation)

| Type       | Package | Rôle                                     | À installer    |
| ---------- | ------- | ---------------------------------------- | -------------- |
| Validation | `zod`   | Schémas de validation (request/response) | `pnpm add zod` |

---

## Phase 2 – architecture/gateways

| Type | Package | Rôle                    | À installer      |
| ---- | ------- | ----------------------- | ---------------- |
| HTTP | `axios` | Client HTTP (optionnel) | `pnpm add axios` |

**Note** : `fetch` natif suffit ; WebSocket via API native, pas de dépendance supplémentaire.

---

## Phase 3 – Dashboard UI

| Type    | Package                              | Rôle                 | Statut (actuel)                     |
| ------- | ------------------------------------ | -------------------- | ----------------------------------- |
| Styling | `tailwindcss`                        | Styles               | Déjà installé (Phase 0)             |
| Styling | `postcss`                            | Pipeline CSS         | Inclus avec Tailwind                |
| Styling | `autoprefixer`                       | Préfixes navigateurs | Optionnel (Tailwind 4)              |
| Icons   | `lucide-react` ou `@heroicons/react` | Icônes               | Optionnel : `pnpm add lucide-react` |

---

## Phase 4 – Qualité code (hooks, lint, format)

| Type   | Package                                 | Rôle                            | À installer                                         |
| ------ | --------------------------------------- | ------------------------------- | --------------------------------------------------- |
| Hooks  | `husky`                                 | Git hooks (pre-commit, etc.)    | `pnpm add -D husky`                                 |
| Staged | `lint-staged`                           | Lint/format sur fichiers stagés | `pnpm add -D lint-staged`                           |
| Format | `prettier`                              | Formatage                       | `pnpm add -D prettier`                              |
| Format | `@trivago/prettier-plugin-sort-imports` | Tri des imports (optionnel)     | `pnpm add -D @trivago/prettier-plugin-sort-imports` |

ESLint et `eslint-config-next` sont déjà en place (Phase 0).

---

## Phase 5 – CI/CD

Aucune dépendance npm : uniquement les workflows GitHub (`.github/workflows/`).

---

## Récapitulatif par phase

| Phase | Dépendances à ajouter (hors Phase 0)                      |
| ----- | --------------------------------------------------------- |
| 0     | Déjà en place (Next, React, TypeScript, Tailwind, ESLint) |
| 1     | `zod`                                                     |
| 2     | (optionnel) `axios`                                       |
| 3     | (optionnel) `lucide-react`                                |
| 4     | `husky`, `lint-staged`, `prettier`                        |
| 5     | Aucune                                                    |

---

## Commandes utiles

```bash
# Installer les dépendances (après clone)
pnpm install

# Ajouter une dépendance de production
pnpm add <package>

# Ajouter une dépendance de développement
pnpm add -D <package>

# Vérifier les versions installées
pnpm list --depth 0
```
