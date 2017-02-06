module.exports = {
  numberOfSupplyCenters: (board) => {
    const retval = new Map()
    board.provinceStatuses.forEach((status, province) => {
      if (!status.occupied) {
        return
      }
      const power = status.occupied
      const numOfSupply = retval.get(power) || 0
      retval.set(power, numOfSupply + ((province.isSupplyCenter) ? 1 : 0))
    })

    return retval
  },
  locationsToRetreat: (board, unit, attackedFrom) => {
    return new Set(
      [...board.map.movableLocationsOf(unit.location, unit.militaryBranch)].filter(location => {
        const existsUnit =
          [...board.units].some(unit => unit.location.province === location.province)

        const status = board.provinceStatuses.get(location.province)
        if (status && status.standoff) {
          return false
        } else if (location.province === attackedFrom) {
          return false
        } else if (existsUnit) {
          return false
        } else {
          return true
        }
      })
    )
  }
}
