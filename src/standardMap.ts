import { board } from "./board"
import { standardRule } from "./standardRule"
import { Location } from "./standardRule/types"
import { MilitaryBranch } from "./standardRule/data"

import * as PowerModule from "./standardMap/power"
import { locations as locationsVar } from "./standardMap/location"
import { map as mapVar } from "./standardMap/map"

export namespace standardMap {
  export declare type Power = PowerModule.Power
  export const Power = PowerModule.Power

  export const locations = locationsVar
  export const map = mapVar
}
