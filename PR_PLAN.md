# GitQuest — Iteration-Based History (9 PRs, 26 commits, 3 tags)

A history organized by the 3 product iterations (MVP → Storyline v2 →
Curriculum Redesign), with annotated release tags and PR boundaries chosen so
that main is deliverable after every single PR merge — verified by
running the test suite at every PR tip and `vite build` at every tag.

## PRs in merge order

| #   | Branch                      | Commits | Suite at tip | PR title / message                                                                                                                                                                                                                                                                                                                |
| --- | --------------------------- | ------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | iter1/test-infrastructure   | 2       | 4 passed     | **Test & lint infrastructure.** CSS-import mock + adapted WelcomeScreen test; ESLint tightening; smoke test to TS. No app changes.                                                                                                                                                                                                |
| 2   | iter1/validation-engine     | 1       | 26 passed    | **Command validation engine.** Standalone module + unit tests; nothing imports it yet, app unchanged.                                                                                                                                                                                                                             |
| 3   | iter1/mvp-integration       | 6       | 83 passed    | **MVP integration.** Reviewed per commit: state refactor → mission content 1–5 → game modules (stats/unlocks/achievements/placement) → placement quiz → UI (onboarding modes, map, training, armory, trophy room) → integration tests. Modules import mission data, so these land together; the PR tip is the full working MVP.   |
| 4   | iter1/docs                  | 1       | 83 passed    | **MVP documentation.** README, project status, test log. → **tag `v0.1.0-mvp`**                                                                                                                                                                                                                                                   |
| 5   | iter2/storyline-restructure | 6       | 85 passed    | **Storyline v2: 3 levels × 10 missions.** Per-level commits keep git rename tracking (R096–098) for the 15 reused lessons; then wiring, adapted tests, docs.                                                                                                                                                                      |
| 6   | iter2/ui-review-fixes       | 2       | 86 passed    | **UI review fixes.** Difficulty normalized to the 1/2/3-star scheme; training view resets on "Next lesson" (+ regression test).                                                                                                                                                                                                   |
| 7   | iter2/handoff-docs          | 1       | 86 passed    | **Project handoff document.** → **tag `v0.2.0-storyline`**                                                                                                                                                                                                                                                                        |
| 8   | iter3/workflow-curriculum   | 6       | 89 passed    | **Workflow-first curriculum + field assignments.** One commit per mission theme (Daily Loop / Damage Control / Parallel Operations / Ghost Protocol), each including its FA capstone and keeping rename tracking for all 30 reused lessons; then wiring with assignment panels and FA gating; then adapted tests. Resolves FR-11. |
| 9   | iter3/redesign-docs         | 1       | 89 passed    | **Redesign documentation.** HANDOFF/status/test-log updates. → **tag `v1.0.0`**                                                                                                                                                                                                                                                   |

`vite build` verified OK at all three tags. Merging all nine PRs in order
produces a tree byte-identical to the final redesign state.

## Design notes

- Deliverability is per-PR, not per-commit: inside PRs 3, 5, and 8, content
  commits precede the wiring commit, so mid-PR commits may not build — but
  every PR tip (what lands on main) compiles and passes its suite. This trade preserves rename tracking and
  reviewability.
- Why iteration 1 has only two carve-out PRs: `stats/unlocks/achievements`
  import mission data, mission data changes the shape the old UI consumes, and
  the new UI needs the new state — the MVP is one integration unit. The
  validation engine and test infra are the only genuinely independent pieces.
- The MVP-era historical commit claimed "86 tests"; the UI suite measures 83
  (the historical figure likely included the separate top-level `tests/`
  harness). Messages here use measured numbers.
- Era source trees: `era1` (MVP), `era2a` (storyline restructure), `era2`
  (post-UI-fix + HANDOFF), `era3` (final). The updated `eras.tar.gz` contains
  all four and remains compatible with the previous kit's script.
