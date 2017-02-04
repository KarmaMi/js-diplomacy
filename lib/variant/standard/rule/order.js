const BaseOrder = require('../../../rule/package').Order

class Order extends BaseOrder {
  constructor (unit, tpe) {
    super(unit)
    this.unit = unit
    this.tpe = tpe
  }
}

class Hold extends Order {
  constructor (unit) {
    super(unit, 'Hold')
  }
  toString () {
    return `${this.unit} H`
  }
}
class Move extends Order {
  constructor (unit, destination, useConvoy) {
    super(unit, 'Move')
    this.destination = destination
    this.useConvoy = useConvoy || false
  }
  toString () {
    if (this.useConvoy) {
      return `${this.unit}-${this.destination} via Convoy`
    } else {
      return `${this.unit}-${this.destination}`
    }
  }
}
class Support extends Order {
  constructor (unit, target) {
    super(unit, 'Support')
    console.assert(target.tpe === 'Move' || target.tpe === 'Hold')

    this.target = target
    if (target.tpe === 'Move') {
      this.destination = target.destination
    } else {
      this.destination = target.unit.location
    }
  }
  toString () {
    return `${this.unit} S ${this.target}`
  }
}
class Convoy extends Order {
  constructor (unit, target) {
    super(unit, 'Convoy')
    console.assert(target.tpe === 'Move')

    this.target = target
  }
  toString () {
    return `${this.unit} C ${this.target}`
  }
}

class Retreat extends Order {
  constructor (unit, destination) {
    super(unit, 'Retreat')
    this.destination = destination
  }
  toString () {
    return `${this.unit} R ${this.destination}`
  }
}
class Disband extends Order {
  constructor (unit) {
    super(unit, 'Disband')
  }
  toString () {
    return `Disband ${this.unit}`
  }
}
class Build extends Order {
  constructor (unit) {
    super(unit, 'Build')
  }
  toString () {
    return `Build ${this.unit}`
  }
}

module.exports = {
  Hold: Hold,
  Move: Move,
  Support: Support,
  Convoy: Convoy,
  Retreat: Retreat,
  Disband: Disband,
  Build: Build
}
