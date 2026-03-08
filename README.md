# robot-front

Dashboard frontend for piloting a robot (ROS). Next.js, TypeScript, Tailwind. Clean Architecture with an API layer and gateways for REST/WebSocket.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Build** : `pnpm build` then `pnpm start`
- **Lint / format / typecheck** : `pnpm lint`, `pnpm format:check`, `pnpm typecheck`

## Project structure

```
src/
├── app/                    # Next.js App Router (pages, layout, not-found)
├── architecture/
│   ├── api/                # HTTP client, WebSocket client, shared types
│   └── gateways/           # Feature gateways (routes, DTOs, calls to robot API)
├── components/             # UI components (ui/, dashboard/)
│   ├── ui/                 # Base components (e.g. shadcn)
│   └── dashboard/          # Dashboard-specific blocks
└── types/                  # Shared generic types
```

- **architecture/api** : transport (client, ws.client) and types used by gateways.
- **architecture/gateways** : one gateway per domain (e.g. auth, robot); each holds its DTOs and uses the API clients.
- **components** : reusable UI and dashboard pieces (see [src/components/readme.md](src/components/readme.md) for shadcn/Tremor and Figma MCP).

More detail: [docs/architecture.md](docs/architecture.md).
