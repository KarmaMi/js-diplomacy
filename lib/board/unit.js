module.exports = class Unit {
  constructor (militaryBranch, location, power) {
    this.militaryBranch = militaryBranch
    this.location = location
    this.power = power

    console.assert(this.location.militaryBranches.has(militaryBranch))
  }

  toString () {
    return `${this.militaryBranch} ${this.location}`
  }
}
