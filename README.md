# GitQuest

A browser-based, gamified Git-learning application for beginner developers and students. Learners progress through a cyber-defense story, **Operation Shadow Breach**, by reading short tutorials and entering Git commands into a simulated terminal-style practice field, with immediate feedback, hints, retries, scored assessments, locally persisted progress, and achievements.

GitQuest is a **simulation**: it never executes Git against a real repository. All behavior is driven by controlled lesson data.

## Repository layout

| Path | What it is |
|---|---|
| `gitquest-ui/` | The application (React 19 + Vite). **Start here.** Its README covers setup, architecture, curriculum, testing, and deployment. |
| `tests/` | A small standalone TypeScript command-parser spike with its own Jest setup. Kept as a passing historical prototype; it is **not** the authoritative test suite. The authoritative tests live in `gitquest-ui/tests/`. |
| `docs/` | Project status and test evidence (`PROJECT-STATUS.md`, `TEST-LOG.md`). |

## Quick start

```bash
cd gitquest-ui
npm ci
npm run dev      # local development server
npm run test     # authoritative Jest suite
npm run build    # production build
npm run lint     # ESLint (must be clean)
npm run deploy   # publish dist/ to GitHub Pages
```

The parser spike, if needed:

```bash
cd tests
npm ci
npm run test
```

## Documentation map

- **Start here:** `HANDOFF.md` — project state, decisions, and what needs doing next.
- Requirement-by-requirement status: `docs/PROJECT-STATUS.md`.
- Test evidence: `docs/TEST-LOG.md`.
- Application internals: `gitquest-ui/README.md`.
