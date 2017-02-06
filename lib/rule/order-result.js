class Executed {
  constructor (target, result) {
    this.target = target
    this.result = result
  }
}
class Replaced {
  constructor (target, invalidReason, replacedBy, result) {
    this.target = target
    this.result = result
    this.invalidReason = invalidReason
    this.replacedBy = replacedBy
  }
}

module.exports = { Executed: Executed, Replaced: Replaced }
