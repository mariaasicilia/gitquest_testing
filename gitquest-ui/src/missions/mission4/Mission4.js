import { mission4level1 } from "./Mission4Level1";
import { mission4level2 } from "./Mission4Level2";
import { mission4level3 } from "./Mission4Level3";

export const mission4 = {
  id: 'M4', x: 330, y: 90,
  title: 'Mission 4 — History Surgery',
  levels: {
    M4L1: mission4level1,
    M4L2: mission4level2,
    M4L3: mission4level3,
  }
}
