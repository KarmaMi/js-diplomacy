import { Name } from "./name"

/**
 * Province in Diplomacy map
 */
export class Province<Power> {
  /**
   * @param name The name of this province
   * @param homeOf
   *   The power that has this province as a home country.
   *   This is a neutral province if null is set.
   * @param isSupplyCenter The flag whether this is a supply center or not.
   */
  constructor (public name: Name, public homeOf: Power | null, public isSupplyCenter?: boolean) {
    this.isSupplyCenter = isSupplyCenter || false
  }

  toString () {
    if (this.isSupplyCenter) {
      return `${this.name}*`
    } else {
      return this.name.toString()
    }
  }
}
