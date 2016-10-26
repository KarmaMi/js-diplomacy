module.exports = class Unit {
  constructor (militaryBranch, location) {
    this.militaryBranch = militaryBranch
    this.location = location

    console.assert(this.location.militaryBranches.has(militaryBranch))
  }

  toString () {
    return `${this.militaryBranch} ${this.location}`
  }
}
