const LabeledUndirectedGraph = require('../util/labeled-undirected-graph')
const provinceToLocation = Symbol('provinceToLocation')

module.exports = class DiplomacyMap {
  constructor (a1) {
    if (Array.isArray(a1)) {
      this.map = new LabeledUndirectedGraph(a1)
    } else {
      this.map = a1
    }

    this.locations = new Set()
    this.map.edges.forEach(elem => {
      this.locations.add(elem.edge[0])
      this.locations.add(elem.edge[1])
    })

    this.provinces = new Set()
    this[provinceToLocation] = new Map()
    this.locations.forEach(elem => {
      this.provinces.add(elem.province)

      if (!this[provinceToLocation].has(elem.province)) {
        this[provinceToLocation].set(elem.province, new Set())
      }
      this[provinceToLocation].get(elem.province).add(elem)
    })

    this.powers = new Set()
    this.provinces.forEach(province => {
      if (province.homeOf) {
        this.powers.add(province.homeOf)
      }
    })
  }

  locationsOf (province) {
    return this[provinceToLocation].get(province)
  }
  movableProvincesOf (province, militaryBranch) {
    const retval = new Set()
    this.locationsOf(province).forEach(location => {
      this.movableLocationsOf(location, militaryBranch).forEach(location => {
        retval.add(location.province)
      })
    })
    return retval
  }
  movableLocationsOf (location, militaryBranch) {
    return new Set(
      [...this.map.neighborsOf(location)]
        .filter(elem => elem[1].has(militaryBranch)).map(elem => elem[0])
    )
  }
}
