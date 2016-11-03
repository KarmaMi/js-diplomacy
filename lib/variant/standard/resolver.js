module.exports = class Resolver {
  constructor (rule) {
    this.rule = rule
  }

  resolve (map, board, orders) {
    throw 'This method is not implemented yet.'
  }

  getErrorMessageForOrder (map, board, order) {
    throw 'This method is not implemented yet.'
  }

  defaultOrder (map, board, unit) {
    throw 'This method is not implemented yet.'
  }
}
