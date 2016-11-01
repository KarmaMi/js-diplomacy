const BaseOrder = require('../../rule/order')

module.exports.Hold = class Hold extends BaseOrder {
  constructor (unit) {
    super(unit)
  }
  toString () {
    return `${this.unit} H`
  }
}

module.exports.Move = class Move extends BaseOrder {
  constructor (unit, destination, viaConvoy) {
    super(unit)
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
    this.target = target
  }
  toString () {
    return `${this.unit} S ${this.target}`
  }
}

module.exports.Convoy = class Convoy extends BaseOrder {
  constructor (unit, targetMove) {
    super(unit)
    this.target = targetMove
  }
  toString () {
    return `${this.unit} C ${this.target}`
  }
}

module.exports.Retreat = class Retreat extends BaseOrder {
  constructor (unit, destination) {
    super(unit)
    this.destination = destination
  }
  toString () {
    return `${this.unit} R ${this.destination}`
  }
}

module.exports.Disband = class Disband extends BaseOrder {
  constructor (unit) {
    super(unit)
  }
  toString () {
    return `Dispand ${this.unit}`
  }
}

module.exports.Build = class Build extends BaseOrder {
  constructor (unit) {
    super(unit)
  }
  toString () {
    return `Build ${this.unit}`
  }
}
