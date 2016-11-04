module.exports = class StandardRuleUtil {
  static getDestinationOfSupportOrder (support) {
    return (support.target.type === 'Hold')
      ? support.target.unit.location
      : support.target.destination
  }
  static updateOccupation (units, occupation) {
    const provinceToForce = new Map()
    occupation.forEach((provinces, force) => {
      provinces.forEach(province => provinceToForce.set(province, force))
    })

    const newOccupation = new Map([...occupation])

    function addProvince (p, f) {
      if (newOccupation.has(f)) {
        newOccupation.get(f).push(p)
      } else {
        newOccupation.set(f, [p])
      }
    }
    function deleteProvince (p) {
      if (provinceToForce.has(p)) {
        const force = provinceToForce.get(p)
        const ps = new Set([...newOccupation.get(force)] || [])
        ps.delete(p)
        newOccupation.set(force, ps)
      }
    }
    units.forEach((units, force) => {
      units.forEach(unit => {
        deleteProvince(unit.location.province)
        addProvince(unit.location.province, force)
      })
    })

    return newOccupation
  }
  static isBuildPhaseRequired (units, occupation) {
    let required = false
    units.forEach((units, force) => {
      const numOfUnit = [...units].length
      const numOfSupply = occupation.has(force) ? [...occupation.get(force)].length : 0

      if (numOfUnit !== numOfSupply) required = true
    })
    return required
  }
}
