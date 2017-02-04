module.exports = class MapEdge {
  constructor (location1, location2, militaryBranches) {
    this.edge = [location1, location2]
    this.label = new Set([...militaryBranches])
  }
}
