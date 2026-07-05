import { level1 } from './level1/Level1'
import { level2 } from './level2/Level2'
import { level3 } from './level3/Level3'

// Canonical mission sequence per the Operation Shadow Breach storyline
// (3 levels x 10 missions). Unlocking, progress, and "next lesson" logic
// all derive from this order — never from flags stored on the mission data.
// NOTE: the code's registry shape calls each Level a "mission" containing
// "levels" — storyline Levels map to MISSIONS entries, storyline Missions
// map to the lesson entries inside them.
export const MISSION_ORDER = ['L1', 'L2', 'L3']

export const MISSIONS = {
  L1: level1,
  L2: level2,
  L3: level3,
}
