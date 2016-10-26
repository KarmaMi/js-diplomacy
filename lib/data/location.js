module.exports = class Location {
  constructor (province, militaryBranches) {
    this.province = province
    this.militaryBranches = new Set([...militaryBranches])
  }
  toString () {
    return `${this.province}`
  }
}
