# GitQuest — Test Log

## Baseline (before this work)

| Check | Result |
|---|---|
| `gitquest-ui` build | ✅ passed |
| `gitquest-ui` lint | ❌ 23 errors (duplicate `color` key, unused vars, react-refresh violation, missing jest globals) |
| `gitquest-ui` tests | ✅ 4/4 — but only `WelcomeScreen` was covered |
| root `tests/` | ❌ failed to run (`.js` test file outside the ts-jest transform; wrong `../Git` import) |

## Final verification (this branch)

All commands run from a clean checkout, Node 22, `npm ci`.

| Check | Command | Result |
|---|---|---|
| Build | `gitquest-ui: npm run build` | ✅ built, no warnings |
| Lint | `gitquest-ui: npm run lint` | ✅ 0 errors, 0 warnings |
| Unit + integration tests | `gitquest-ui: npm run test` | ✅ 8 suites, 89/89 passed |
| Root parser spike | `tests: npm run test` | ✅ 3/3 passed |
| Production serve | `npm run preview` + fetch of `/gitquest/` and hashed assets | ✅ 200s, correct base path |

### Suite contents (gitquest-ui/tests)

- `validateCommand.test.js` (22) — normalization (whitespace/smart quotes), accept variants, `<message>` placeholder, reject rules, and every diagnostic class: empty, non-git, case, wrong command, missing/extra argument, wrong flag near-miss, wrong target.
- `unlocks.test.js` (13) — recruit sequential gating incl. cross-mission boundaries, replayability, safe default when mode is missing, field-agent free roam, next-playable and next-after traversal.
- `statsAndAchievements.test.js` (13) — totals (36-unit registry), overall/mission %, stale-completion filtering, coin earn/spend/floor, battle scoring floor, perfect/average scores; achievement earn rules incl. the 10-lesson Level 1 badge boundary (9 ≠ badge, 10 = badge) and monotonicity.
- `ProgressContext.test.jsx` (7) — completion + score + First Blood, idempotent replay keeping best score, localStorage persistence and rehydration, corrupt-storage fallback, guarded purchases (insufficient/double), placement storage, full reset.
- `TrainingPage.test.jsx` (11) — tutorial + battle render, first-try 100 persisted, empty-input message, wrong-command diagnostic + retry, hint reveal timing and −10/−25 scoring with `hintsUsed` persisted, `git add .` teaching rejection, `git switch` accept variant, Next-lesson gating (offered when unlocked, hidden when locked), unknown-lesson guard, capstone: 7-step advance, step-local failure (`git pull` at the fetch step), averaged score, completion persisted.
- `PlacementQuiz.test.jsx` (9) — threshold math at exactly 75% and below, unanswered-safe scoring, submit gating, pass result + persisted recommendation, wrong-answer explanations, skip path.
- `App.test.jsx` (4) — shell routing smoke: recruit → map with derived topbar, field agent → placement → skip → map, returning agent bypasses placement and sees the recommendation banner, mission panel → Start → training page with lock states.
- `WelcomeScreen.test.js` (4) — pre-existing, kept green.

## Checklist mapping (HANDOFF §13)

Happy path, wrong/empty commands, hint flow, refresh persistence, unlock order, replay, capstone step failure, placement threshold, purchase guards, import/export/reset — covered by the suites above. 

## Remaining manual verification

- Cross-browser pass (Chrome, Firefox, Safari): not runnable in the build container (no browsers installed; browser-download hosts outside the network allowlist). The suite runs under jsdom; the app uses no APIs newer than ES2020/standard DOM, so risk is low, but the pass should be done before release.
- Visual/UX review on a real display (map layout at narrow widths).
