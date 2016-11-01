module.exports = class Rule {
  constructor (season, phases, militaryBranches, orders) {
    this.season = new Set([...season])
    this.phases = new Set([...phases])
    this.militaryBranches = new Set([...militaryBranches])
    this.orders = new Map([...orders])
  }
}
