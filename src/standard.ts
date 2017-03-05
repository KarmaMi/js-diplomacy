import { variant as variantModule } from "./variant"
import { standardRule } from "./standardRule"
import { Dislodged, ProvinceStatus, MilitaryBranch, Result, State } from "./standardRule/data"
import { Error } from "./standardRule/error"
import { standardMap } from "./standardMap"
import { standardBoard } from "./standardBoard"
import { board } from "./board"
import { Power } from "./standardMap/power"

const { map, locations: $ } = standardMap
const { Turn, Season } = standardBoard
const { Army, Fleet } = standardRule.MilitaryBranch
const { Unit, Board, Rule, Phase } = standardRule

const initialBoard = new Board<Power>(
  map, new State(new Turn(1901, Season.Spring), Phase.Movement),
  [
    new Unit(Army, $.Vie, Power.Austria), new Unit(Army, $.Bud, Power.Austria),
    new Unit(Fleet, $.Tri, Power.Austria),
    new Unit(Fleet, $.Edi, Power.England), new Unit(Fleet, $.Lon, Power.England),
    new Unit(Army, $.Lvp, Power.England),
    new Unit(Fleet, $.Bre, Power.France), new Unit(Army, $.Mar, Power.France),
    new Unit(Army, $.Par, Power.France),
    new Unit(Fleet, $.Kie, Power.Germany), new Unit(Army, $.Ber, Power.Germany),
    new Unit(Army, $.Mun, Power.Germany),
    new Unit(Army, $.Ven, Power.Italy), new Unit(Army, $.Rom, Power.Italy),
    new Unit(Fleet, $.Nap, Power.Italy),
    new Unit(Fleet, $.Sev, Power.Russia), new Unit(Army, $.Mos, Power.Russia),
    new Unit(Army, $.War, Power.Russia), new Unit(Fleet, $.StP_SC, Power.Russia),
    new Unit(Army, $.Smy, Power.Turkey), new Unit(Army, $.Con, Power.Turkey),
    new Unit(Fleet, $.Ank, Power.Turkey)
  ],
  [],
  <Array<[board.Province<Power>, standardRule.ProvinceStatus<Power>]>>([...map.provinces].map(p => {
    if (p.homeOf !== null) {
      return [p, new ProvinceStatus(p.homeOf, false)]
    } else {
      return null
    }
  }).filter(x => x))
)

const rule = new Rule<Power>()

export namespace standard {
  export const variant = new variantModule.Variant(rule, initialBoard)
}
