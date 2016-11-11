const provinceToLocation = Symbol('provinceToLocation')

module.exports = class DiplomacyMap {
  constructor (edges) {
    this.edges = new Set([...edges])

    this.locations = new Set()
    this.edges.forEach(elem => {
      this.locations.add(elem.location1)
      this.locations.add(elem.location2)
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

    this.forces = new Set()
    this.provinces.forEach(province => {
      if (province.homeOf) {
        this.forces.add(province.homeOf)
      }
    })
  }

  canMoveTo (unit) {
    const candidates = new Set()

    this.edges.forEach(elem => {
      if (elem.location1 === unit.location && elem.militaryBranches.has(unit.militaryBranch)) {
        candidates.add(elem.location2)
      }
    })
    this.edges.forEach(elem => {
      if (elem.location2 === unit.location && elem.militaryBranches.has(unit.militaryBranch)) {
        candidates.add(elem.location1)
      }
    })

    return candidates
  }

  locationsOf (province) {
    return this[provinceToLocation].get(province)
  }

  locationsFromProvince (militaryBranch, province) {
    const candidates = new Set()

    this.edges.forEach(elem => {
      if (elem.location1.province === province && elem.militaryBranches.has(militaryBranch)) {
        candidates.add(elem.location2)
      }
    })
    this.edges.forEach(elem => {
      if (elem.location2.province === province && elem.militaryBranches.has(militaryBranch)) {
        candidates.add(elem.location1)
      }
    })

    return candidates
  }
}
