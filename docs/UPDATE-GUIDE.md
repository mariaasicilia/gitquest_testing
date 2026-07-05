# UPDATE GUIDE — Storyline v2 Integration

This documents the integration of the teammate's updated mission list (`Operation_Shadow_Breach_Latest_Storyline.txt`) on branch `feature/storyline-v2`, which builds on `feature/complete-mvp`. It covers what changed, which files are affected, and the exact workflow to apply everything to the shared repo without disturbing existing work.

## 1. What changed (summary)

The curriculum is restructured from 5 missions / 17 lessons to the storyline's **3 Levels × 10 missions (30 total)**, with new ids `L1M1`–`L3M10`.

**New commands taught (17):** diff, stash, stash pop, merge, tag, branch -a, revert, reset --hard, cherry-pick, stash branch, merge --squash, bisect start, bisect good, reflog, rebase -i, commit -S, archive.

**Kept and relocated (13):** clone, pull, status, add, commit -m, log, restore, branch, checkout, amend, push, branch -d, rebase.

**Removed by the storyline (4):** `git fetch`, `git push --force-with-lease`, `git rebase --continue`, and the 7-step capstone.
> ⚠️ **FR-11 gap — needs a team decision.** The handoff lists fetch and force-with-lease as Must-priority (FR-11). The teammate's storyline omits them. This branch follows the storyline faithfully and flags the conflict rather than silently re-adding content. The retired lesson content still exists in git history (`feature/complete-mvp`) and can be reinstated as L2/L3 missions if the team chooses.

**New storyline features:** each Level now has an `outro` — the "🏆 Level Complete" celebration text — shown on the training completion panel when the final mission of a level is cleared; L3's outro includes the Director's operation-complete message. The placement quiz recommendation now points at `L2`, and two placement questions that tested retired commands (fetch-vs-pull, force-with-lease) were replaced with questions on L1 content (diff, restore).

**Kept but dormant:** the sequence-battle engine (multi-step boss missions) and its validator support remain fully functional and tested via a synthetic lesson, ready for a future capstone.

## 2. Affected files

### Mission data — `gitquest-ui/src/missions/`
| Change | Files |
|---|---|
| New level registries | `level1/Level1.js`, `level2/Level2.js`, `level3/Level3.js` (title, desc, outro, map coords, mission maps) |
| Relocated lessons (git mv, ids renamed) | `Level1M1,2,3,4,5,6,8,9,10.js`, `Level2M3,4,10.js`, `Level3M2.js` (from mission1/, mission2/, mission3/Level1, mission4/Level1-2) |
| New lessons (17) | `Level1M7.js`; `Level2M1,2,5,6,7,8,9.js`; `Level3M1,3,4,5,6,7,8,9,10.js` |
| Deleted | `mission1/`–`mission5/` directories (fetch, force-with-lease, rebase --continue, capstone content retired) |
| Registry | `Missions.js` — `MISSION_ORDER = ['L1','L2','L3']` |

### Game logic — `gitquest-ui/src/game/`
- `achievements.js` — level badges remapped: `level1-cleared` → "Field Agent Certified" (L1), new `senior-field-agent` (L2), `remote-operator`/`history-surgeon` replaced by `ghost-protocol` (L3). Earn rules now target L1/L2/L3.
- `placement.js` — `recommendedMission` now `'L2'`/`'L1'`; two questions replaced (see above).
- `validateCommand.js`, `unlocks.js`, `stats.js` — **no changes**; they are registry-driven and adapted automatically.

### Context — `gitquest-ui/src/context/`
- `context.js` — default `currentMission: 'L1'`, `currentLevel: 'L1M1'` (comment examples updated).

### Components — `gitquest-ui/src/components/`
- `TrainingPage.jsx` — completion panel now shows the level `outro` when the completed mission clears its whole level (`levelJustCleared` + `isMissionComplete` import).
- `PlacementQuiz.jsx` — question cards get `data-testid` for scoped tests; comment updated.
- `MissionMap.jsx`, `Arsenal.jsx`, `TrophyRoom.jsx`, `App.jsx` — **no changes**; fully derived from the registry (3 map nodes, 🎖 x/3, coin totals all adapt).

### Tests — `gitquest-ui/tests/` (85/85 passing)
- `statsAndAchievements.test.js` — totals 17→30, coin math for 10-mission levels, badge boundary now the ten L1 missions, new badge ids.
- `TrainingPage.test.jsx` — lesson ids updated (git status is now L1M3, add L1M4, checkout L1M10, clone L1M1); capstone test replaced with a synthetic-lesson sequence test (feature preserved); two new outro tests (shown on level clear, hidden mid-level).
- `PlacementQuiz.test.jsx`, `ProgressContext.test.jsx`, `App.test.jsx` — ids/labels updated (`L2` recommendation, "Level 1 — Recruit Training", 🎖 0/3); placement clicks scoped per question card.
- `validateCommand.test.js`, `unlocks.test.js`, `WelcomeScreen.test.js` — unchanged.

### Docs
- `gitquest-ui/README.md` — curriculum table rewritten for 3×10.
- `docs/PROJECT-STATUS.md`, `docs/TEST-LOG.md` — counts updated.
- `docs/UPDATE-GUIDE.md` — this file.

### ⚠️ Saved-progress compatibility
Lesson ids changed (`M1L1` → `L1M1`), so **existing localStorage progress will not carry over** — stale ids are safely ignored by design (stats filter unknown ids), so the app treats it as a fresh start rather than crashing. Fine pre-release; if any testers have progress worth keeping, they should finish evaluating before updating, or use the export feature for the record.

## 3. How to apply to the shared repo (safe workflow)

Two patches now exist, meant to be applied **in order** as two feature branches (or one stacked branch), so each is independently reviewable:

1. `gitquest-complete-mvp.patch` — the MVP completion (apply per the commit-chunking guide you already have).
2. `gitquest-storyline-v2.patch` — this storyline integration, which applies **on top of** the MVP work.

```bash
cd ~/projects/gitquest/gitquest
git checkout main && git pull

# Branch 1 — MVP (as previously planned)
git checkout -b feature/complete-mvp
git apply --check ~/projects/gitquest_test/gitquest-complete-mvp.patch   # must pass
git apply ~/projects/gitquest_test/gitquest-complete-mvp.patch
# ...commit in the 5 logical chunks from the earlier guide, push, open PR #1

# Branch 2 — storyline, stacked on branch 1
git checkout -b feature/storyline-v2       # branched FROM feature/complete-mvp
git apply --check ~/projects/gitquest_test/gitquest-storyline-v2.patch   # must pass
git apply ~/projects/gitquest_test/gitquest-storyline-v2.patch
```

Suggested commit sequence for branch 2 (each leaves the tree working):

```bash
# 1 — curriculum data
git add gitquest-ui/src/missions/
git commit -m "Restructure curriculum to storyline v2: 3 levels x 10 missions

- Relocate 13 existing lessons under L1-L3 ids; add 17 new lessons
  (diff, stash family, merge, tag, revert, reset, cherry-pick, bisect,
  reflog, rebase -i, signed commits, archive)
- Add per-level outro celebration text from the storyline
- Retire fetch, force-with-lease, rebase --continue, capstone
  (FR-11 gap flagged in docs/UPDATE-GUIDE.md for team decision)"

# 2 — logic + component adjustments
git add gitquest-ui/src/game/ gitquest-ui/src/context/ gitquest-ui/src/components/
git commit -m "Adapt achievements, placement, and completion panel to storyline levels

- Level badges: Field Agent Certified (L1), Senior Field Agent (L2),
  Ghost Protocol Cleared (L3); placement recommends L2
- Replace two placement questions testing retired commands
- Show level outro on the completion panel when a level is cleared"

# 3 — tests + docs
git add -A
git commit -m "Update tests and docs for storyline v2 (85 passing)

- New ids throughout; sequence engine kept, tested via synthetic lesson
- Outro display tests; placement tests scoped per question card
- README curriculum, PROJECT-STATUS, TEST-LOG, UPDATE-GUIDE"

npm --prefix gitquest-ui run test && npm --prefix gitquest-ui run lint && npm --prefix gitquest-ui run build
git push -u origin feature/storyline-v2    # open PR #2, based on PR #1
```

Open PR #2 with **base = `feature/complete-mvp`** (not main) so reviewers see only the storyline diff; merge PR #1 first, then retarget/merge PR #2. In the PR description, link this guide and call out the FR-11 gap explicitly so the fetch/force-with-lease decision gets made by the team, not by default.
