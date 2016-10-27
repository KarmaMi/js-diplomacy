module.exports.Hold = class Hold {
  constructor (unit) {
    this.unit = unit
  }
  toString () {
    return `${this.unit} H`
  }
}

module.exports.Move = class Move {
  constructor (unit, destination, viaConvoy) {
    this.unit = unit
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

module.exports.Support = class Support {
  constructor (unit, target) {
    this.unit = unit
    this.target = target
  }
  toString () {
    return `${this.unit} S ${this.target}`
  }
}

module.exports.Convoy = class Convoy {
  constructor (unit, targetMove) {
    this.unit = unit
    this.target = targetMove
  }
  toString () {
    return `${this.unit} C ${this.target}`
  }
}

module.exports.Retreat = class Retreat {
  constructor (unit, destination) {
    this.unit = unit
    this.destination = destination
  }
  toString () {
    return `${this.unit} R ${this.destination}`
  }
}

module.exports.Disband = class Disband {
  constructor (unit) {
    this.unit = unit
  }
  toString () {
    return `Dispand ${this.unit}`
  }
}

module.exports.Build = class Build {
  constructor (unit) {
    this.unit = unit
  }
  toString () {
    return `Build ${this.unit}`
  }
}
