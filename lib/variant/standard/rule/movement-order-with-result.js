const Result = require('./result')

const resultS = Symbol('result')
module.exports = class MovementOrderWithResult {
  constructor (order) {
    this.order = order
    this[resultS] = null
  }
  getResult () {
    return this[resultS]
  }
  setResult (result) {
    switch (this.order.tpe) {
      case 'Hold':
        if (result === Result.Dislodged || result === Result.Success) {
          this[resultS] = result
        }
        break
      case 'Move':
        if (result === Result.Dislodged || result === Result.Success) {
          if (this[resultS] !== Result.Success) {
            this[resultS] = result
          }
        } else if (result === Result.Failed || result === Result.Bounced) {
          if (this[resultS] !== Result.Dislodged) {
            this[resultS] = result
          }
        }
        break
      case 'Support':
        if (result === Result.Dislodged) {
          this[resultS] = result
        } else if (result === Result.Failed || result === Result.Success) {
          if (
            this[resultS] !== Result.Dislodged && this[resultS] !== Result.Cut && this[resultS] !== Result.NoCorrespondingOrder
          ) {
            this[resultS] = result
          }
        } else if (result === Result.Cut) {
          if (this[resultS] !== Result.Dislodged) {
            this[resultS] = result
          }
        } else if (result === Result.NoCorrespondingOrder) {
          this[resultS] = result
        }
        break
      case 'Convoy':
        if (result === Result.Dislodged) {
          this[resultS] = result
        } else if (result === Result.Failed || result === Result.Success) {
          if (
            this[resultS] !== Result.Dislodged && this[resultS] !== Result.NoCorrespondingOrder
          ) {
            this[resultS] = result
          }
        } else if (result === Result.NoCorrespondingOrder) {
          this[resultS] = result
        }
        break
      default:
        throw { err: `Invalid order: ${this.order}` }
    }
  }
}
