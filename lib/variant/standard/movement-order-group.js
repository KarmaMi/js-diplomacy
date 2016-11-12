const RuleHelper = require('../../rule/rule-helper')
const Unit = require('../../data/unit')

const AbleToConvoy = 'AbleToConvoy' // TODO

module.exports = class MovementOrderGroup {
  constructor (rule, orderResultMap) {
    this.target = null
    this.supports = []
    this.convoy = []

    this.rule = rule
    this.orderResultMap = orderResultMap
    this.Fleet = [...this.rule.militaryBranches].find(elem => {
      return elem.name === 'Fleet' && elem.abbreviatedName === 'F'
    })
  }

  addTargetOrder (target) {
    this.target = target
  }

  addRelatedOrder (order) {
    switch (order.type) {
      case 'Support':
        this.supports.push(order)
        break
      case 'Convoy':
        this.convoy.push(order)
        break
    }
  }

  updateResult (targetResult) {
    const $ = RuleHelper(this.rule)

    if (targetResult === $.NoCorrespondingOrder) {
      if (this.supports) {
        this.supports.forEach(o => this.orderResultMap.set(o, $.NoCorrespondingOrder))
      }
      if (this.convoy) {
        this.convoy.forEach(o => this.orderResultMap.set(o, $.NoCorrespondingOrder))
      }
      return
    }

    const updateSupport = (r) => {
      this.supports.forEach(support => {
        const result = this.orderResultMap.get(support) !== $.Dislodged
        if (result !== $.Dislodged || result !== $.Cut) {
          this.orderResultMap.set(support, r)
        }
      })
    }
    const updateConvoy = (r) => {
      this.convoy.forEach(convoy => {
        if (this.orderResultMap.get(convoy) !== $.Dislodged) this.orderResultMap.set(convoy, r)
      })
    }

    if (targetResult) this.orderResultMap.set(this.target, targetResult)
    switch (this.target.type) {
      case 'Move':
        const result =
          (targetResult === $.Failed || targetResult === $.Bounced || targetResult === $.Dislodged)
            ? $.Failed : $.Success
        updateSupport(result)
        updateConvoy(result)
        break
      default:
        updateSupport((targetResult === $.Dislodged) ? $.Failed : $.Success)
        break
    }
  }

  findRoute (map) {
    if (!this.target) return
    if (this.target.type !== 'Move') return

    const canMoveViaConvoy = (unit, destination, provinces) => {
      provinces = new Set([...provinces])
      const dfs = (current) => {
        for (const next of [...map.locationsFromProvince(this.Fleet, current.province)]) {
          if (next.province === destination.province) {
            return true
          } else if (provinces.has(next.province)) {
            provinces.delete(next.province)
            return dfs(next)
          }
        }
      }

      for (const next of [...map.locationsFromProvince(this.Fleet, unit.location.province)]) {
        if (provinces.has(next.province)) {
          provinces.delete(next.province)
          if (dfs(next)) {
            return true
          }
        }
      }
      return false
    }

    const ps = [...this.convoy]
      .filter(e => this.orderResultMap.get(e) === AbleToConvoy)
      .map(e => e.unit.location.province)
    if (canMoveViaConvoy(this.target.unit, this.target.destination, ps)) {
      return {
        useConvoy: true
      }
    }

    if (map.canMoveTo(this.target.unit).has(this.target.destination)) {
      return {
        useConvoy: false
      }
    }
    return
  }

  removeUnavailableSupports () {
    const $ = RuleHelper(this.rule)

    this.supports = [...this.supports].filter(order => {
      const result = this.orderResultMap.get(order)
      return result !== $.Cut && result !== $.Dislodged
    })
  }

  getPower () {
    return 1 + this.supports.length
  }
}
