import { level2m1 } from './Level2M1'
import { level2m2 } from './Level2M2'
import { level2m3 } from './Level2M3'
import { level2m4 } from './Level2M4'
import { level2m5 } from './Level2M5'
import { level2m6 } from './Level2M6'
import { level2m7 } from './Level2M7'
import { level2m8 } from './Level2M8'
import { level2m9 } from './Level2M9'
import { level2m10 } from './Level2M10'

export const level2 = {
  id: 'L2', x: 230, y: 100,
  title: 'Level 2 — Field Operations',
  desc: `Shadow Breach has gone underground. Your team must now coordinate across multiple agents, manage parallel investigation threads, push intelligence to headquarters, and surgically correct mistakes without losing critical data.`,
  outro: `\u{1F3C6} Level 2 Complete — Senior Field Agent\n\nImpressive, Agent. You've coordinated intelligence across branches, transmitted findings to headquarters, reversed critical errors, and kept the repository clean under operational pressure. Shadow Breach's underground network is fracturing.\n\nBut their leadership is still out there — and they've activated Ghost Protocol, their most sophisticated contingency plan yet. What comes next will require mastery of Git's most powerful and unforgiving commands.\n\nLevel 3 clearance granted. This is where most agents stop. You won't.`,
  levels: {
    L2M1: level2m1,
    L2M2: level2m2,
    L2M3: level2m3,
    L2M4: level2m4,
    L2M5: level2m5,
    L2M6: level2m6,
    L2M7: level2m7,
    L2M8: level2m8,
    L2M9: level2m9,
    L2M10: level2m10,
  },
}
