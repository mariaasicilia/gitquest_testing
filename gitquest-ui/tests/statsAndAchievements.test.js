import {
  totalLevels, completedCount, overallPct, missionProgress,
  missionsCompleted, earnedCoins, coinBalance, battleScore,
  perfectScores, averageScore,
} from '../src/game/stats'
import { ACHIEVEMENTS, updatedAchievements } from '../src/game/achievements'
import { MISSIONS, MISSION_ORDER } from '../src/missions/Missions'
import { defaultProgress } from '../src/context/context'

const allLevelIds = MISSION_ORDER.flatMap(id => Object.keys(MISSIONS[id].levels))
const level1Ids = Object.keys(MISSIONS.L1.levels)

const withProgress = (extra) => ({ ...defaultProgress, ...extra })

describe('stats — derived progress', () => {
  test('the registry contains the full storyline curriculum (3 levels x 10 missions)', () => {
    expect(totalLevels()).toBe(30)
    expect(level1Ids).toHaveLength(10)
  })

  test('0% / partial / 100% overall progress', () => {
    expect(overallPct(withProgress())).toBe(0)
    expect(overallPct(withProgress({ completedLevels: ['L1M1'] }))).toBe(Math.round(100 / 30))
    expect(overallPct(withProgress({ completedLevels: allLevelIds }))).toBe(100)
  })

  test('stale/unknown completions are ignored, not counted', () => {
    const p = withProgress({ completedLevels: ['L1M1', 'DELETED-LEVEL'] })
    expect(completedCount(p)).toBe(1)
  })

  test('per-level progress', () => {
    const p = withProgress({ completedLevels: ['L1M1', 'L1M2'] })
    expect(missionProgress('L1', p)).toEqual({ completed: 2, total: 10, pct: 20 })
    expect(missionProgress('L2', p)).toEqual({ completed: 0, total: 10, pct: 0 })
  })

  test('coins: 10 per lesson + 25 per completed mission; balance never negative', () => {
    const m1 = Object.keys(MISSIONS.L1.levels)
    const p = withProgress({ completedLevels: m1 })
    expect(missionsCompleted(p)).toBe(1)
    expect(earnedCoins(p)).toBe(10 * 10 + 25)
    expect(coinBalance(withProgress({ completedLevels: m1, spentCoins: 30 }))).toBe(95)
    expect(coinBalance(withProgress({ completedLevels: [], spentCoins: 999 }))).toBe(0)
  })

  test('battleScore: attempts and hint penalties with a floor of 25', () => {
    expect(battleScore(0, false)).toBe(100) // first try, no hint
    expect(battleScore(1, false)).toBe(75)
    expect(battleScore(1, true)).toBe(65)
    expect(battleScore(9, true)).toBe(25)  // floor
  })

  test('perfect and average scores', () => {
    const p = withProgress({ scores: { L1M1: 100, L1M2: 50 } })
    expect(perfectScores(p)).toBe(1)
    expect(averageScore(p)).toBe(75)
    expect(averageScore(withProgress())).toBeNull()
  })
})

describe('achievements — earn rules', () => {
  test('nothing is earned at zero progress', () => {
    expect(updatedAchievements(withProgress())).toEqual({})
  })

  test('First Blood after one completion', () => {
    const a = updatedAchievements(withProgress({ completedLevels: ['L1M1'] }))
    expect(a['first-blood']).toBeDefined()
    expect(a['level1-cleared']).toBeUndefined()
  })

  test('the Level 1 completion badge requires all ten L1 missions', () => {
    const nine = level1Ids.slice(0, 9)
    expect(updatedAchievements(withProgress({ completedLevels: nine }))['level1-cleared']).toBeUndefined()
    const a = updatedAchievements(withProgress({ completedLevels: level1Ids }))
    expect(a['level1-cleared']).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('Clean Commit requires a perfect score', () => {
    expect(updatedAchievements(withProgress({ completedLevels: ['L1M1'], scores: { L1M1: 75 } }))['clean-commit']).toBeUndefined()
    expect(updatedAchievements(withProgress({ completedLevels: ['L1M1'], scores: { L1M1: 100 } }))['clean-commit']).toBeDefined()
  })

  test('finishing everything earns the legendary badge', () => {
    const a = updatedAchievements(withProgress({ completedLevels: allLevelIds }))
    expect(a['operation-complete']).toBeDefined()
  })

  test('earned achievements are monotone — dates never change or disappear', () => {
    const existing = withProgress({ completedLevels: [], achievements: { 'first-blood': '2026-01-01' } })
    const a = updatedAchievements(existing)
    expect(a['first-blood']).toBe('2026-01-01')
  })

  test('every achievement has the fields the Trophy Room renders', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.id).toBeTruthy()
      expect(a.name).toBeTruthy()
      expect(a.desc).toBeTruthy()
      expect(a.icon).toBeTruthy()
      expect(['common', 'uncommon', 'rare', 'legendary']).toContain(a.rarity)
      expect(typeof a.earnedWhen).toBe('function')
    }
  })
})
