module.exports = class RuleKeywords {
  constructor (seasons, phases, statuses, militaryBranches, orders) {
    this.seasons = new Set([...seasons])
    this.phases = new Set([...phases])
    this.statuses = new Set([...statuses])
    this.militaryBranches = new Set([...militaryBranches])
    this.orders = new Map([...orders])
  }
}
