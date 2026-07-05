import { level3m1 } from './Level3M1'
import { level3m2 } from './Level3M2'
import { level3m3 } from './Level3M3'
import { level3m4 } from './Level3M4'
import { level3m5 } from './Level3M5'
import { level3m6 } from './Level3M6'
import { level3m7 } from './Level3M7'
import { level3m8 } from './Level3M8'
import { level3m9 } from './Level3M9'
import { level3m10 } from './Level3M10'

export const level3 = {
  id: 'L3', x: 380, y: 150,
  title: 'Level 3 — Ghost Protocol',
  desc: `Shadow Breach's masterminds have been located. This is the most critical phase of the operation. Only agents who can manipulate repository history with surgical precision will be trusted with Ghost Protocol. One wrong command could compromise everything.`,
  outro: `\u{1F3C6} Level 3 Complete — Ghost Protocol Cleared\n\nIt's over, Agent. Shadow Breach has been dismantled.\n\nYou navigated the most dangerous phase of the operation with precision — recovering lost intelligence, rewriting history without leaving a trace, and sealing the final evidence package for the classified vault. The masterminds behind Ghost Protocol never stood a chance.\n\nYour record has been filed. Your methods will be studied.\n\n\u{1F396} OPERATION SHADOW BREACH — COMPLETE\n\nFrom the desk of the Director, U.S. Cyber Defense Agency:\n\nAgent, when you first cloned that repository, you were a recruit. Today, you are something else entirely.\n\nYou learned to read the history of a codebase like a case file. You staged evidence, committed findings, corrected mistakes, and pushed intelligence under fire. You merged parallel operations, recovered deleted work from the void, rewrote history with surgical precision, and sealed the final archive.\n\nShadow Breach is gone. But the skills you've built here don't expire. Every repository you'll ever touch, every team you'll ever work with, every crisis you'll ever debug — you're ready.\n\nThe nation owes you one, Agent. Well done.`,
  levels: {
    L3M1: level3m1,
    L3M2: level3m2,
    L3M3: level3m3,
    L3M4: level3m4,
    L3M5: level3m5,
    L3M6: level3m6,
    L3M7: level3m7,
    L3M8: level3m8,
    L3M9: level3m9,
    L3M10: level3m10,
  },
}
