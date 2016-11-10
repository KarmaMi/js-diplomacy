const BaseOrder = require('../../rule/order')

module.exports.Hold = class Hold extends BaseOrder {
  constructor (unit) {
    super(unit)
    this.type = 'Hold'
  }
  toString () {
    return `${this.unit} H`
  }
}

module.exports.Move = class Move extends BaseOrder {
  constructor (unit, destination, viaConvoy) {
    super(unit)
    this.type = 'Move'
    this.destination = destination
    this.isViaConvoy = viaConvoy || false
  }
  viaConvoy () {
    return new Move(this.unit, this.destination, true)
  }
  toString () {
    if (this.isViaConvoy) {
      return `${this.unit}-${this.destination} via convoy`
    } else {
      return `${this.unit}-${this.destination}`
    }
  }
}

module.exports.Support = class Support extends BaseOrder {
  constructor (unit, target) {
    super(unit)
    this.type = 'Support'
    this.target = target
  }
  toString () {
    return `${this.unit} S ${this.target}`
  }
}

module.exports.Convoy = class Convoy extends BaseOrder {
  constructor (unit, targetMove) {
    super(unit)
    this.type = 'Convoy'
    this.target = targetMove
  }
  toString () {
    return `${this.unit} C ${this.target}`
  }
}

module.exports.Retreat = class Retreat extends BaseOrder {
  constructor (unit, destination) {
    super(unit)
    this.type = 'Retreat'
    this.destination = destination
  }
  toString () {
    return `${this.unit} R ${this.destination}`
  }
}

module.exports.Disband = class Disband extends BaseOrder {
  constructor (unit) {
    super(unit)
    this.type = 'Disband'
  }
  toString () {
    return `Dispand ${this.unit}`
  }
}

module.exports.Build = class Build extends BaseOrder {
  constructor (unit) {
    super(unit)
    this.type = 'Build'
  }
  toString () {
    return `Build ${this.unit}`
  }
}
