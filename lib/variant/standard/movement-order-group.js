module.exports = class MovementOrderGroup {
  constructor () {
    this.target = null
    this.supports = []
    this.convoy = []
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
}
