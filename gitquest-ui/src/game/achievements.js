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
    name: 'Field Agent Certified',
    desc: 'Complete all ten Level 1 missions — Recruit Training cleared.',
    icon: '🎖',
    rarity: 'uncommon',
    earnedWhen: p => isMissionComplete('L1', p),
  },
  {
    id: 'senior-field-agent',
    name: 'Senior Field Agent',
    desc: 'Complete all ten Level 2 missions — Field Operations cleared.',
    icon: '📡',
    rarity: 'rare',
    earnedWhen: p => isMissionComplete('L2', p),
  },
  {
    id: 'ghost-protocol',
    name: 'Ghost Protocol Cleared',
    desc: 'Complete all ten Level 3 missions — history bends to your will.',
    icon: '⎇',
    rarity: 'rare',
    earnedWhen: p => isMissionComplete('L3', p),
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
