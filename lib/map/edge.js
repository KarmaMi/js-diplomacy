module.exports = class Edge {
  constructor (location1, location2, militaryBranches) {
    this.location1 = location1
    this.location2 = location2
    this.militaryBranches = new Set([...militaryBranches])
  }
}
