const { Board } = require('../../../board/package')
const { OrderResult, ResolvedResult } = require('../../../rule/package')
const State = require('./state')
const ProvinceStatus = require('./province-status')
const { Movement } = require('./phase')
const { Success } = require('./result')

module.exports = class BuildResolver {
  resolve (board, orders) {
    const disbands = [...orders].filter(order => order.tpe === 'Disband')
    const builds = [...orders].filter(order => order.tpe === 'Build')

    const newUnits = new Set([...board.units])
    disbands.forEach(d => newUnits.delete(d.unit))
    builds.forEach(b => newUnits.add(b.unit))

    const newState = new State(board.state.turn.nextTurn(), Movement)
    const occupationStatuses = [...board.provinceStatuses]
      .filter(elem => elem[1].occupied)
      .map(elem => {
        if (elem[1].standoff) {
          return [elem[0], new ProvinceStatus(elem[1].occupied, false)]
        } else {
          return elem
        }
      })
    const newBoard = new Board(board.map, newState, newUnits, [], occupationStatuses)
    const orderResults = [...orders].map(order => new OrderResult.Executed(order, Success))

    return { result: new ResolvedResult(newBoard, orderResults, false) }
  }
}
