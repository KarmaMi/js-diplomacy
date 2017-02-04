module.exports = class Location {
  constructor (name, province, militaryBranches) {
    this.name = name
    this.province = province
    this.militaryBranches = new Set([...militaryBranches])
  }
  toString () {
    return `${this.name}`
  }
}
