/**
 * Name of atomic components (e.g., provinces)
 */
export class Name {
  abbreviatedName: string
  /**
   * @param name The name
   * @param abbreviatedName The abbreviated name. name is used if this param is not specified.
   */
  constructor (public name: string, abbreviatedName?: string) {
    this.abbreviatedName = abbreviatedName || name
  }
  toString () {
    return this.abbreviatedName
  }
}
