@AGENTS.md

# Pokemon Manager

A local-first Pokemon team manager. Trainers own unlimited **spaces**; each space represents one Pokemon line and holds whichever of its forms/evolutions the user adds. The **met location lives on the space**, not the Pokemon. Each Pokemon is fully editable (nature, ability, held item, 4-move set, shiny, level, IVs/EVs) with live calculated stats. Data lives in SQLite; species/move/ability/item data comes from PokeAPI through the BFF layer.

Entity chain: `trainer 1—N space 1—N pokemon` (cascade deletes down the chain).

## Stack

- Next.js (App Router) + React + TypeScript strict
- MUI v9 (`sx` prop for ALL styling — no Tailwind, no CSS modules, no inline `style={}`)
- Zustand (only state manager), axios, react-hook-form + zod v4, framer-motion
- Drizzle ORM on SQLite (`better-sqlite3` driver), migrations via `drizzle-kit`

## Architecture (hard rules)

```
Component → *.proxy.ts (axios → /api/*) → route.ts → *.service.ts → *.model.ts → *.schema.ts (Drizzle/SQLite)
                                                    └→ PokeAPI (pokedex services, cached)
```

- Components NEVER import services or models. Proxies hit relative `/api/*` only.
- Models/schemas are server-only (they import better-sqlite3) — imported exclusively by services.
- Every endpoint returns `ApiResponseWrapper<T> { success, statusCode, message, data, timestamp }`; the axios factory uses `validateStatus < 500`, so 4xx never throws — callers branch on `response.success`.
- Routes are centralized in frozen `ClientRoutesConfig` / `ServerRoutesConfig` — no hardcoded path strings in components.

## Component Naming & File Structure

Every component lives in its own kebab-case folder:

| File | Purpose |
|---|---|
| `x.component.tsx` | the component |
| `x.component.props.ts` | `interface XComponentProps` — ALL fields `readonly` |
| `x.component.config.ts` | optional frozen static config (UPPERCASE keys) |
| `x.component.store.ts` | optional component-local Zustand store |

Dialogs use the `.dialog.` infix: `add-pokemon.dialog.component.tsx`.

Domain layer suffixes: `.schema.ts`, `.model.ts`, `.proxy.ts`, `.service.ts`, `.store.ts`, `.hook.ts`, `.enum.ts`, `.config.ts`, `.helper.ts`, `.factory.ts`, `.external-gateway.ts`, `.validation-schema.ts`. DTO folders are literally `DTOs/{api-responses,inputs}`.

Domain layout: `src/domains/<domain>/<entity>/{schemas,models,services,proxies,store,enums,configs,helpers,DTOs,validation-schemas}` plus `src/domains/shared/` and `src/global/{configs,providers,contexts}`.

## Coding Standards

- `function` declarations for all components — never arrow-function components.
- Pages: `export default function XPage()`. Reusable components: `export function XComponent(props: XComponentProps)`.
- `"use client"` (double quotes) on line 1 of interactive components.
- Proxies/services/helpers/factories: module-private interface + exported frozen const object literal — no classes.
- Models are the ONE class-based layer (mirrors the backend services pattern): `class TrainerModel extends PersistenceModel<TrainerDocument>` — `public static` methods are the query interface, instance setters mutate via `this.getData()`, `save()/update()/delete()` persist. No repository classes.
- Schemas: Drizzle `sqliteTable` exported as `XSchema` + row type `XDocument` (`$inferSelect`).
- Enums: TS enums, SCREAMING_SNAKE members with string values.
- Zustand: always read via selector (`useStore(s => s.field)`), never destructure the whole store. Dialogs are self-contained — mounted once per page, opened via their own store.
- Config objects: `Object.freeze({...})` with UPPERCASE keys.
- Import alias `@/*` → repo root, so imports read `@/src/domains/...`.

## Form Pattern

```ts
const { control, formState, handleSubmit } = useForm({
    resolver: zodResolver(MySchema),
    defaultValues: MySchema.parse({}),   // every zod field has .default()
    mode: "onChange",
})
```

Fields wrapped in `<Controller>`; submit disabled on `!formState.isValid`.

## Styling Rules

- MUI `sx` prop everywhere; theme built in `src/global/providers/theme.provider.tsx`.
- Dark = black + electric blue (`#3B82F6` accent); light = white + blue (`#2563EB` accent).
- Glass surfaces: translucent background + `backdropFilter: blur(12px)` + 1px subtle border; `backgroundImage: "none"` on Paper/Dialog.
- Uppercase micro-labels: fontSize 10–11, fontWeight 700, letterSpacing 0.08–0.18em.
- Calculated-stat green: `#22C55E`.
- Theme mode persisted via `mode` cookie; root layout reads it server-side (`await cookies()`) — no flash.

## Commands

- `npm run dev` — start dev server (migrations run automatically at boot)
- `npm run db:generate` — regenerate Drizzle migrations after schema changes (commit `drizzle/`)
- `npm run lint && npm run typecheck && npm run build` — quality gate

## Critical Rules

- Never refactor unrelated files; minimal diffs.
- Never bypass the proxy → route → service → model chain.
- Never fetch natures/type-colors/damage-class styles from PokeAPI — they are hardcoded (enum + frozen configs).
- IV range 0–31, EV range 0–252 per stat. There is deliberately NO EV total cap — every stat may be maxed.
- PATCH validation uses `edit-pokemon-partial.validation-schema.ts`, which is built WITHOUT `.default()` on any field — deriving it from the defaulted base schema silently resets omitted fields. Keep it that way.
- Move dropdowns show each move's type badge and physical/special/status icon — metadata comes from `/api/pokedex/moves` (`MoveApiResponse { name, type, damageClass }`), assembled server-side from PokeAPI type + damage-class endpoints and cached forever.
