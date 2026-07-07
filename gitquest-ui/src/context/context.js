import { createContext } from 'react'

export const ProgressContext = createContext(null)
export const STORAGE_KEY = 'gitquest-progress'

export const defaultProgress = {
  completedLevels: [],   // e.g. ['L1M1', 'L1M2']
  currentMission: 'L1',
  currentLevel: 'L1M1',
  mode: null,            // 'new' (recruit, sequential) | 'vet' (field agent, free roam)
  scores: {},            // levelId -> best assessment score (0–100)
  hintsUsed: 0,          // lifetime hint reveals
  achievements: {},      // achievementId -> ISO date earned
  placement: null,       // { correct, total, pct, passed, recommendedMission, date }
  inventory: [],         // arsenal item ids owned
  spentCoins: 0,         // total coins spent in the arsenal
}
