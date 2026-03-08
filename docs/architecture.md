# Technical Stack – Frontend

This document defines the technical stack used by the frontend. Initial version, non-exhaustive — to be iterated.

---

## 1. Framework & routing

| Component | Tech        | Justification                                                         |
| --------- | ----------- | --------------------------------------------------------------------- |
| Framework | **Next.js** | Native routing, no manual route management (React Router DOM avoided) |
| Runtime   | React 18+   | Components, hooks, concurrency                                        |

---

## 2. Architecture – Clean Architecture

### Target structure

```
src/
├── architecture/
│   ├── api/           # DTOs (request/response), validation schemas, API typings
│   └── gateways/      # Bridge client: routes, URL construction, calls to robot API
├── app/               # Next.js App Router (pages, layouts)
├── components/
├── ...
```

- **`/architecture/api`** : DTOs (request/response), validation schemas, shared types — aligned with backend `robocoop_api`
- **`/architecture/gateways`** : **bridge (client side)** — centralizes robot API base URL, route construction, REST/WebSocket calls (commands, status, alerts). Abstraction layer between UI and robot.

---

## 3. Package management & versions

| Tool         | Usage                                               |
| ------------ | --------------------------------------------------- |
| **pnpm**     | Dependency management, locked versions              |
| **lockfile** | `pnpm-lock.yaml` — committed, no drift between devs |

**Goal** : define packages and versions upfront for a common base and avoid conflicts.

To document in `package.json` / `pnpm-workspace.yaml` as needed:

- Next.js
- React
- TypeScript
- UI / state / validation libraries
- Testing, lint, formatting tools

---

## 4. Git hooks & code quality

| Tool            | Usage                            |
| --------------- | -------------------------------- |
| **Husky**       | Git hooks (commit, pre-commit)   |
| **lint-staged** | Lint/format only on staged files |

Example hooks:

- Pre-commit: lint, format, types
- Commit-msg: message validation (e.g. Conventional Commits)

---

## 5. CI / CD & Pull Requests

### Target structure

```
.github/
├── workflows/
│   ├── ci.yml           # Tests, lint, build
│   └── pr-checks.yml    # PR checks
```

### Behaviour

- CI triggered on push and on PR open/update
- On CI failure → merge blocked
- Protected branches: PR required + CI green to merge

---

## 6. Next steps

- [ ] Validate the choices above
- [ ] Pin exact versions (package.json / .npmrc)
- [ ] Detail `architecture/api` and `architecture/gateways`
- [ ] Write `.github/workflows/` workflows
- [ ] Configure Husky + lint-staged
