module.exports = class Helper {
  constructor (map) {
    /* Define helpers functions */
    // Define a helper for phases
    this.$f = {}
    map.forces.forEach(force => {
      this.$f[force.toString()] = force
      this[force.toString()] = force
    })

    // Define a helper for locations
    this.$l = {}
    map.locations.forEach(location => {
      this.$l[location.toString()] = location
      this[location.toString()] = location
    })
  }
}
