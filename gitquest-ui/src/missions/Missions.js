import { mission1 } from './mission1/Mission1'
import { mission2 } from './mission2/Mission2'
import { mission3 } from './mission3/Mission3'
import { mission4 } from './mission4/Mission4'
import { mission5 } from './mission5/Mission5'

// Canonical mission sequence. Unlocking, progress, and "next lesson" logic
// all derive from this order — never from flags stored on the mission data.
export const MISSION_ORDER = ['M1', 'M2', 'M3', 'M4', 'M5']

export const MISSIONS = {
  M1: mission1,
  M2: mission2,
  M3: mission3,
  M4: mission4,
  M5: mission5,
}
