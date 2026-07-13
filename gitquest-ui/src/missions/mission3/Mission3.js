import { mission3level1 } from "./Mission3Level1";
import { mission3level2 } from "./Mission3Level2";
import { mission3level3 } from "./Mission3Level3";

export const mission3 = {
  id: 'M3', x: 240, y: 140,
  title: 'Mission 3 — Remote Uplink',
  levels: {
    M3L1: mission3level1,
    M3L2: mission3level2,
    M3L3: mission3level3,
  }
}
