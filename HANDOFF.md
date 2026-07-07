# GitQuest — Project Handoff

**Last updated:** July 11, 2026
**Status:** MVP complete and green (build, lint, 86 tests). Not yet merged to `main`; not yet cross-browser verified.

This document supersedes the original handoff. It is the single entry point for anyone picking up GitQuest: what it is, where the code lives, what's done, what's decided, and what's left.

---

## 1. What GitQuest is

A browser-based, gamified Git-learning app for beginners and students. Learners advance through a cyber-defense story — **Operation Shadow Breach** — by reading short tutorials and typing Git commands into a simulated terminal, with immediate feedback, hints, retries, scored assessments, persisted progress, and achievements.

**GitQuest is a simulation.** It never executes Git against a real repository. Every behavior is driven by controlled lesson data. There is no sign-in — learners start as guests and progress is saved in the browser (`localStorage`).

---

## 2. Repository map

| Path | What it is |
|---|---|
| `gitquest-ui/` | **The application.** React 19 + Vite. This is where ~all work happens. |
| `gitquest-ui/src/game/` | Pure, unit-tested logic with no React: validation, unlocks, stats, achievements, placement. |
| `gitquest-ui/src/missions/` | Curriculum data (`level1/`, `level2/`, `level3/`), one file per lesson + a registry per level. |
| `gitquest-ui/src/context/` | Progress state: persistence, scoring, purchases, import/export/reset. |
| `gitquest-ui/src/components/` | Screens: welcome, placement quiz, mission map, training/battle, arsenal, trophy room. |
| `gitquest-ui/tests/` | **Authoritative test suite** (Jest + Testing Library, jsdom). |
| `tests/` | A standalone TypeScript command-parser spike with its own Jest setup. Passing, kept as a historical prototype. **Not** authoritative. |
| `docs/` | `PROJECT-STATUS.md` (requirements status), `TEST-LOG.md` (test evidence), `UPDATE-GUIDE.md` (change log + branch workflow). |

---

## 3. Running it

Requires **Node ≥ 22** (Vite 8 will not run on Node 18 — it fails with `CustomEvent is not defined`). Use `nvm install 22 && nvm use 22`.

```bash
cd gitquest-ui
npm ci
npm run dev      # dev server
npm run test     # 86 tests, 8 suites — must stay green
npm run lint     # must be 0 errors
npm run build    # production build
npm run preview  # serve the build (base path /gitquest/)
npm run deploy   # publish dist/ to GitHub Pages
```

The root parser spike, if needed: `cd tests && npm ci && npm run test` (3 tests).

---

## 4. Current state

### Working end to end
- **Onboarding modes are real.** "New recruit" enforces strictly sequential unlocking; "Field agent" gets free navigation plus a skippable placement assessment. The choice is persisted and drives behavior.
- **Placement assessment.** 8 scored multiple-choice questions, wrong answers get explanations, ≥75% recommends starting at Level 2. It's a recommendation, not a lock.
- **30 lessons across 3 levels**, each with a tutorial and a scored command battle.
- **Structured command validation.** Not string equality: per-lesson `accept` variants (e.g. `git switch` for `checkout`, any commit message), per-lesson `reject` rules with teaching messages (e.g. `git add .`, `reset --hard` on pushed commits), plus generic diagnostics for empty input, non-Git input, capitalization, wrong subcommand, missing/extra/wrong arguments, and near-miss flag typos.
- **Scoring.** 100 − 25 per wrong attempt − 10 if the hint was revealed, floored at 25. Best score per lesson is persisted.
- **Hints.** After 1 wrong attempt a "reveal hint" button appears; after 2 it auto-reveals. (The Auto-hint arsenal item moves this one attempt earlier.)
- **Persistence.** Everything (completions, best scores, mode, placement, hints, achievements, inventory, spent coins) is saved to `localStorage` under `gitquest-progress`, survives refresh, tolerates corrupt/absent data, and supports **export / import / reset** from the map.
- **Derived UI.** No hard-coded game values remain anywhere. Progress bars, coin balance, mission states, trophies, and stats all compute from saved progress.
- **Achievements.** 6 badges with earn dates, monotone (never revoked).
- **Arsenal.** Coins earned (+10/lesson, +25/mission); purchases persist. Two items have real effects (Auto-hint Module, Ghost Command); cosmetics are labeled in-app as prototypes.

### Curriculum (Operation Shadow Breach — 3 levels × 10 missions)

| Level | Difficulty | Commands |
|---|---|---|
| **L1 — Recruit Training** | Easy (1★) | `clone`, `pull`, `status`, `add <file>`, `commit -m`, `log`, `diff`, `restore <file>`, `branch <name>`, `checkout <branch>` |
| **L2 — Field Operations** | Intermediate (2★) | `stash`, `stash pop`, `commit --amend --no-edit`, `push`, `merge`, `tag`, `branch -a`, `revert HEAD`, `reset --hard HEAD~1`, `branch -d` |
| **L3 — Ghost Protocol** | Hard (3★) | `cherry-pick`, `rebase`, `stash branch`, `merge --squash`, `bisect start`, `bisect good`, `reflog`, `rebase -i`, `commit -S`, `archive` |

Each level ends with its storyline celebration; finishing L3 shows the Director's operation-complete message.

**Terminology gotcha:** the code registry calls each storyline *Level* a "mission" (`MISSIONS`, `MISSION_ORDER`) containing "levels" (the lessons). The data shape predates the storyline naming. Lesson ids are `L1M1`–`L3M10`.

### Verification status

| Check | Result |
|---|---|
| `npm run build` | ✅ passes |
| `npm run lint` | ✅ 0 errors (was 23 at baseline) |
| `npm run test` (gitquest-ui) | ✅ 8 suites, 86/86 |
| Root parser spike | ✅ 3/3 |
| Cross-browser (Chrome/Firefox/Safari) | ⬜ **not done** — see §6 |

---

## 5. Requirements status

Full detail in `docs/PROJECT-STATUS.md`. Summary:

| Requirement | Status |
|---|---|
| FR-01 display modules by topic | ✅ |
| FR-02 completion/progress indicators | ✅ |
| FR-03 interactive tutorials | ✅ |
| FR-04 practice after tutorial | ✅ |
| FR-05 validation w/ feedback, hints, retries | ✅ |
| FR-06 quizzes with scores + wrong-answer explanations | ✅ (see decision D1) |
| FR-07 completion tracking | ✅ |
| FR-08 overall + per-level progress | ✅ |
| FR-09 achievements (Should) | ✅ |
| FR-10 repo state graph (stretch) | ⬜ not built |
| FR-11 later lessons (push, fetch, force-with-lease, rebase, branch -d) | ⚠️ **partial — needs a decision, see §6** |
| FR-12 placement quiz | ✅ |

---

## 6. What needs to be done

### 🔴 Blocking a merge / needs a human decision

1. **FR-11 gap — `git fetch` and `git push --force-with-lease` are not in the curriculum.**
   The handoff lists both as Must-priority. The teammate's updated storyline (`Operation_Shadow_Breach_Latest_Storyline.txt`) omits them, and the curriculum now follows that storyline faithfully. This was flagged rather than silently resolved, because it's a scope call, not a bug.
   **Options:** (a) accept the storyline as-is and amend FR-11; (b) reinstate the two lessons as extra L2/L3 missions — the retired lesson content still exists in git history on the `complete-mvp` commit and can be restored. Also retired: `git rebase --continue` and the 7-step capstone.
   **Owner needed.**

2. **Cross-browser manual pass (Chrome, Firefox, Safari).** Never run — the build container has no browsers. Tests run under jsdom. The app uses no APIs newer than ES2020/standard DOM, so risk is low, but this is the last Definition-of-Done item.

3. **Merge the work.** The branch is not on `main` yet. See `docs/UPDATE-GUIDE.md` for the branch/commit workflow and PR guidance.

### 🟡 UI polish backlog (nothing broken)

From the old-vs-new UI review:
- Center the mission-map path on the page (currently left-aligned; the side action buttons are absolutely positioned, so check for overlap).
- Replay UX: consider dropping the explicit replay buttons in favor of clicking a completed mission directly, with a hover cue. Possibly sub-actions for replay-training vs. replay-battle.
- Widen the mission-overview outer container.
- Add a slightly longer pause on a correct command before the OBJECTIVE SECURED panel appears.

### 🟢 Known limitations / future scope

- **Saved-progress compatibility:** lesson ids changed (`M1L1` → `L1M1`), so any pre-existing `localStorage` progress resets. Stale ids are filtered safely (no crash), so this is a clean reset, not a bug. Fine pre-release.
- **The sequence-battle engine** (multi-step boss missions) is fully implemented and tested via a synthetic lesson, but **no live lesson uses it** — the storyline dropped the capstone. It's ready if the team wants a boss battle at the end of L3.
- **Arsenal economy is partial by design.** Only 2 of the items do anything; cosmetics say so in-app. A full economy/cosmetic system is future work.
- Not built: real Git execution sandbox, user accounts/sync, repo state graph (FR-10), per-lesson multiple-choice question banks, mobile layout audit, localization.

---

## 7. Decisions of record

- **D1 — What counts as the "quiz" (FR-06).** The scored command battle *is* the per-lesson assessment: it produces a score, and wrong attempts get targeted explanations at the moment of error. The placement assessment covers the classic multiple-choice-with-explanations form. Separate per-lesson MCQ banks remain open future work.
- **D2 — Arsenal economy.** Coins are earned and purchases persist, but only Auto-hint Module and Ghost Command have gameplay effects. Cosmetic items are honest prototypes, labeled as such in the UI, rather than fake buttons.
- **D3 — Simulation fidelity.** Validation is data-driven per lesson (accept variants + reject rules + generic diagnostics), *not* a Git parser/emulator. This matches the "simulation with controlled lesson data" constraint and keeps content authorable by non-engineers.
- **D4 — Root `tests/` spike.** Kept and fixed (renamed `.js`→`.ts`, corrected import) rather than deleted: it passes and documents the original parser exploration. Marked non-authoritative in the READMEs.
- **D5 — Difficulty scheme.** Normalized to the storyline's own per-level difficulty: L1 = `easy` (1★), L2 = `med` (2★), L3 = `hard` (3★). This fixed a real bug where lessons using the value `"medium"` fell outside the star map and rendered 1★ while `"med"` lessons rendered 2★.

---

## 8. Landmines for the next person

- **Node 18 will not work.** Vite 8 needs Node ≥ 22. The failure mode is a confusing `ReferenceError: CustomEvent is not defined`.
- **Don't hard-code game values in components.** Every displayed number must come from `src/game/stats.js` or progress state. Removing static values (a fake 45% bar, `💰120`, static trophies) was a large part of this work; don't reintroduce them.
- **Lesson difficulty must be one of `easy` / `med` / `hard`.** The string `"medium"` silently degrades to 1 star. If you add difficulty values, update `DIFF_STARS` in `MissionMap.jsx`.
- **`TrainingPage` is keyed by lesson id in `App.jsx`.** Removing that `key` reintroduces a bug where advancing to the next lesson keeps the previous lesson's completion panel and no input field.
- **Adding a lesson** means: create the lesson file, register it in that level's `LevelN.js`, and update the lesson-count expectations in `tests/statsAndAchievements.test.js`. Unlocks, progress, coins, and the map all derive from the registry automatically.
- **Tailwind is installed but the UI uses inline styles.** Stay consistent with inline styles unless the team decides to migrate deliberately.

---

## 9. Where to look next

- `docs/UPDATE-GUIDE.md` — what changed, file by file, and the exact branch/commit workflow for landing it safely.
- `docs/PROJECT-STATUS.md` — requirement-by-requirement status and decisions.
- `docs/TEST-LOG.md` — baseline vs. final test evidence, suite contents, remaining manual checks.
- `gitquest-ui/README.md` — architecture, curriculum, scoring rules, unlock policy, deployment.
