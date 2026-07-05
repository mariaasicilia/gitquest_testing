import { level1m1 } from './Level1M1'
import { level1m2 } from './Level1M2'
import { level1m3 } from './Level1M3'
import { level1m4 } from './Level1M4'
import { level1m5 } from './Level1M5'
import { level1m6 } from './Level1M6'
import { level1m7 } from './Level1M7'
import { level1m8 } from './Level1M8'
import { level1m9 } from './Level1M9'
import { level1m10 } from './Level1M10'

export const level1 = {
  id: 'L1', x: 80, y: 140,
  title: 'Level 1 — Recruit Training',
  desc: `You're a newly recruited cyber agent for the U.S. Cyber Defense Agency. A hacker group called Shadow Breach is attempting to infiltrate critical government systems. Master the basics before you're cleared for field operations.`,
  outro: `\u{1F3C6} Level 1 Complete — Field Agent Certified\n\nOutstanding work, Agent. You've proven you can navigate a repository, track changes, document findings, and manage branches under pressure. Shadow Breach underestimated you — but they won't make that mistake again.\n\nHQ has cleared you for the next phase of the operation. The threats ahead are more sophisticated, the stakes are higher, and the commands are sharper. Rest up.\n\nLevel 2 clearance granted. Welcome to the field.`,
  levels: {
    L1M1: level1m1,
    L1M2: level1m2,
    L1M3: level1m3,
    L1M4: level1m4,
    L1M5: level1m5,
    L1M6: level1m6,
    L1M7: level1m7,
    L1M8: level1m8,
    L1M9: level1m9,
    L1M10: level1m10,
  },
}
