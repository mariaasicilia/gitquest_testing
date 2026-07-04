import {
  totalLevels, completedCount, overallPct, missionProgress,
  missionsCompleted, earnedCoins, coinBalance, battleScore,
  perfectScores, averageScore,
} from '../src/game/stats'
import { ACHIEVEMENTS, updatedAchievements } from '../src/game/achievements'
import { MISSIONS, MISSION_ORDER } from '../src/missions/Missions'
import { defaultProgress } from '../src/context/context'

const allLevelIds = MISSION_ORDER.flatMap(id => Object.keys(MISSIONS[id].levels))
const level1Ids = ['M1', 'M2'].flatMap(id => Object.keys(MISSIONS[id].levels))

const withProgress = (extra) => ({ ...defaultProgress, ...extra })

describe('stats — derived progress', () => {
  test('the registry contains the full intended curriculum (10 + 3 + 3 + 1)', () => {
    expect(totalLevels()).toBe(17)
    expect(level1Ids).toHaveLength(10)
  })

  test('0% / partial / 100% overall progress', () => {
    expect(overallPct(withProgress())).toBe(0)
    expect(overallPct(withProgress({ completedLevels: ['M1L1'] }))).toBe(Math.round(100 / 17))
    expect(overallPct(withProgress({ completedLevels: allLevelIds }))).toBe(100)
  })

  test('stale/unknown completions are ignored, not counted', () => {
    const p = withProgress({ completedLevels: ['M1L1', 'DELETED-LEVEL'] })
    expect(completedCount(p)).toBe(1)
  })

  test('per-mission progress', () => {
    const p = withProgress({ completedLevels: ['M1L1', 'M1L2'] })
    expect(missionProgress('M1', p)).toEqual({ completed: 2, total: 5, pct: 40 })
    expect(missionProgress('M3', p)).toEqual({ completed: 0, total: 3, pct: 0 })
  })

  test('coins: 10 per lesson + 25 per completed mission; balance never negative', () => {
    const m1 = Object.keys(MISSIONS.M1.levels)
    const p = withProgress({ completedLevels: m1 })
    expect(missionsCompleted(p)).toBe(1)
    expect(earnedCoins(p)).toBe(5 * 10 + 25)
    expect(coinBalance(withProgress({ completedLevels: m1, spentCoins: 30 }))).toBe(45)
    expect(coinBalance(withProgress({ completedLevels: [], spentCoins: 999 }))).toBe(0)
  })

  test('battleScore: attempts and hint penalties with a floor of 25', () => {
    expect(battleScore(0, false)).toBe(100) // first try, no hint
    expect(battleScore(1, false)).toBe(75)
    expect(battleScore(1, true)).toBe(65)
    expect(battleScore(9, true)).toBe(25)  // floor
  })

  test('perfect and average scores', () => {
    const p = withProgress({ scores: { M1L1: 100, M1L2: 50 } })
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
    const a = updatedAchievements(withProgress({ completedLevels: ['M1L1'] }))
    expect(a['first-blood']).toBeDefined()
    expect(a['level1-cleared']).toBeUndefined()
  })

  test('the Level 1 completion badge requires all ten M1+M2 lessons', () => {
    const nine = level1Ids.slice(0, 9)
    expect(updatedAchievements(withProgress({ completedLevels: nine }))['level1-cleared']).toBeUndefined()
    const a = updatedAchievements(withProgress({ completedLevels: level1Ids }))
    expect(a['level1-cleared']).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('Clean Commit requires a perfect score', () => {
    expect(updatedAchievements(withProgress({ completedLevels: ['M1L1'], scores: { M1L1: 75 } }))['clean-commit']).toBeUndefined()
    expect(updatedAchievements(withProgress({ completedLevels: ['M1L1'], scores: { M1L1: 100 } }))['clean-commit']).toBeDefined()
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
