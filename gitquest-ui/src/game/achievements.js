// Achievement definitions and earn rules (FR-09).
//
// Rules are pure predicates over progress state. Earned achievements are
// persisted in progress.achievements as { id: ISO-date } by ProgressContext
// whenever progress changes. Persistence is MONOTONE: once earned, a badge
// keeps its original date and is never revoked (even by replay or rule
// changes) — only resetProgress clears it.

import {
  completedCount,
  isMissionComplete,
  missionsCompleted,
  perfectScores,
} from './stats'
import { MISSION_ORDER } from '../missions/Missions'

export const ACHIEVEMENTS = [
  {
    id: 'first-blood',
    name: 'First Blood',
    desc: 'Complete your very first battle scenario.',
    icon: '🩸',
    rarity: 'common',
    earnedWhen: p => completedCount(p) >= 1,
  },
  {
    id: 'clean-commit',
    name: 'Clean Commit',
    desc: 'Score a perfect 100 on any battle — first try, no hints.',
    icon: '✦',
    rarity: 'uncommon',
    earnedWhen: p => perfectScores(p) >= 1,
  },
  {
    id: 'level1-cleared',
    name: 'Operation Foundation',
    desc: 'Complete all ten Level 1 lessons (Missions 1 and 2).',
    icon: '🎖',
    rarity: 'uncommon',
    earnedWhen: p => isMissionComplete('M1', p) && isMissionComplete('M2', p),
  },
  {
    id: 'remote-operator',
    name: 'Remote Operator',
    desc: 'Complete Mission 3 — Remote Uplink.',
    icon: '📡',
    rarity: 'rare',
    earnedWhen: p => isMissionComplete('M3', p),
  },
  {
    id: 'history-surgeon',
    name: 'History Surgeon',
    desc: 'Complete Mission 4 — History Surgery.',
    icon: '⎇',
    rarity: 'rare',
    earnedWhen: p => isMissionComplete('M4', p),
  },
  {
    id: 'operation-complete',
    name: 'Shadow Breach Neutralized',
    desc: 'Complete every mission. The operation is over.',
    icon: '🛡',
    rarity: 'legendary',
    earnedWhen: p => missionsCompleted(p) === MISSION_ORDER.length,
  },
]

// Returns an updated achievements map ({ id: ISO date }) for the given
// progress. Existing entries are preserved untouched (monotonicity).
export function updatedAchievements(progress, now = new Date()) {
  const current = { ...(progress?.achievements ?? {}) }
  for (const a of ACHIEVEMENTS) {
    if (current[a.id]) continue
    if (a.earnedWhen(progress)) current[a.id] = now.toISOString().slice(0, 10)
  }
  return current
}
