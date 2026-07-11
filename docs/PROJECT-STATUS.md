# GitQuest — Project Status

Status of the implementation against `HANDOFF.md`. Supersedes the "What is done / partial / missing" tables in that document. Test evidence lives in `docs/TEST-LOG.md`.

## Functional requirements (Must)

| FR | Requirement | Status | Where |
|---|---|---|---|
| FR-01 | Display learning modules by topic | ✅ Done | Mission map renders M1–M5 from the mission registry; per-mission panel lists lessons with difficulty. |
| FR-02 | Completion status / progress indicators per module | ✅ Done | Map nodes show ✓/◎/⬡ states; mission panel shows per-lesson ✓ and a mission progress bar — all derived from persisted state. |
| FR-03 | Interactive tutorials | ✅ Done | Each lesson's tutorial sections render on the training page (M1–M5, 17 lessons). |
| FR-04 | Practice after tutorial | ✅ Done | Battle field follows the tutorial on every lesson. |
| FR-05 | Command validation with feedback, hints, retries | ✅ Done | Structured validator distinguishes empty input, non-Git input, wrong command, missing/extra/wrong arguments, capitalization, near-miss flags, and lesson-specific unsafe/rejected commands with teaching messages. Unlimited retries; staged hint policy. |
| FR-06 | Quizzes with scores + wrong-answer explanations | ✅ Done (decision D1) | Battles are scored assessments (100 −25/wrong −10/hint, floor 25; persisted best score). The placement quiz provides scored multiple-choice with per-question explanations. |
| FR-07 | Track lesson/module completion | ✅ Done | `ProgressContext` persists completions, best scores, hints, achievements to `localStorage`; survives refresh; import/export/reset. |
| FR-08 | Overall + per-level progress | ✅ Done | Topbar overall %, per-mission bars, Trophy Room field record — all derived (`src/game/stats.js`). |
| FR-11 | Later lessons: push, fetch, force-with-lease, rebase, branch -d | ✅ Done | All five taught: push (M1), fetch (M3, vs pull), rebase (M3, vs merge), branch -d (M3), force-with-lease (M4, paired with rebase -i). Reinstated by the workflow-curriculum redesign after being dropped in storyline v2. |

## Functional requirements (Should / stretch)

| FR | Requirement | Status | Notes |
|---|---|---|---|
| FR-09 | Achievements/badges | ✅ Done | 6 badges incl. the required persisted Level 1 completion badge ("Operation Foundation"); monotone earn rules with dates; derived Trophy Room. |
| FR-10 | Repo state graph visualization | ⬜ Not built | Stretch scope; unchanged. |
| FR-12 | Placement quiz for experienced route | ✅ Done | 8 questions, 75% threshold, recommendation persisted and shown on the map; skippable. |

## Handoff directives (§ "What the next owner should do")

| Directive | Status |
|---|---|
| Wire onboarding modes to real behavior | ✅ `mode` persisted; recruit = sequential unlocks, field agent = free navigation + placement offer. |
| Replace static map/topbar/coins/trophies with derived state | ✅ No hard-coded game values remain in any component; streak and decorative sound button removed. |
| Persistence end-to-end | ✅ Auto-save, hydration, corrupt-storage fallback, export/import (validated) and reset (confirmed). |
| Capstone identifies which step failed | ✅ Sequence battle shows STEP n/total, fails only the current step, names it in the failure banner. |
| Reject `git add .` when a specific file is expected | ✅ Lesson-level reject rule with a teaching message; same pattern used across M1–M5 (e.g. `--force`, `-D`, `checkout -b`). |
| `git branch -d` taught as local deletion | ✅ M4L1 lesson content + reject rules for `-D` and `push --delete`. |
| Consolidate/fix the root tests project | ✅ Fixed (renamed to `.ts`, corrected import) and kept as a passing historical spike; `gitquest-ui/tests` documented as authoritative. |
| Rewrite READMEs | ✅ Root `README.md` added; `gitquest-ui/README.md` rewritten (was the Vite template). |
| Lint clean | ✅ 0 errors (was 23 at baseline). |
| Automated tests | ✅ 89 passing in `gitquest-ui` (8 suites) + 3 in the root spike. |
| Cross-browser manual pass | ⬜ Remaining — see TEST-LOG. |

## Decisions of record

- **D1 — Quiz mechanism.** The scored command battle is the per-lesson assessment satisfying FR-06's "score" requirement; wrong attempts receive targeted explanations at the moment of error. The placement assessment covers the classic multiple-choice-with-explanations form. A separate post-lesson multiple-choice bank per lesson remains open future work (FUT).
- **D2 — Arsenal economy.** Coins are earned (+10/lesson, +25/mission) and purchases persist. Two items have real effects (Auto-hint Module, Ghost Command); cosmetic items are labeled prototypes in-app. Full economy/cosmetics remain future scope.
- **D3 — Simulation fidelity.** Validation is data-driven per lesson (accept variants + reject rules + generic diagnostics), not a Git parser/emulator — matching the SFS "simulation with controlled lesson data" constraint and keeping content authorable.
- **D4 — Root `tests/` spike.** Kept and fixed rather than deleted: it passes, it documents the original parser exploration, and the README marks it non-authoritative.

## Known limitations / future work

FUT items from the handoff remain open: real Git execution sandbox, accounts/sync, repo graph (FR-10), full arsenal economy and cosmetics, per-lesson multiple-choice banks, mobile layout audit, localization. Manual cross-browser verification is the one outstanding Definition-of-Done item (container had no browsers; see TEST-LOG).
