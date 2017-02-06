const { Unit, Board } = require('../../../board/package')
const { OrderResult: { Executed }, ResolvedResult } = require('../../../rule/package')
const { Success, Failed } = require('./result')
const { Movement, Build } = require('./phase')
const State = require('./state')
const ProvinceStatus = require('./province-status')
const StandardRuleUtils = require('./standard-rule-utils')

module.exports = class RetreatResolver {
  resolve (board, orders) {
    const disbands = [...orders].filter(order => order.tpe === 'Disband')
    const retreats = [...orders].filter(order => order.tpe === 'Retreat')

    const retval = new Map()
    disbands.forEach(order => retval.set(order, Success))

    // Create a map from province to retreat order
    const province2RetreatUnits = new Map()
    retreats.forEach(order => {
      const elem = province2RetreatUnits.get(order.destination.province) || []
      elem.push(order)
      province2RetreatUnits.set(order.destination.province, elem)
    })

    // Resolve retreat orders
    province2RetreatUnits.forEach((orders, province) => {
      if (orders.length === 1) {
        orders.forEach(order => retval.set(order, Success))
      } else {
        orders.forEach(order => retval.set(order, Failed))
      }
    })

    // Generate a new board
    const unit2Result = new Map([...retval].map(elem => [elem[0].unit, [elem[0], elem[1]]]))
    const newUnits = new Set()
    board.units.forEach(unit => {
      const result = unit2Result.get(unit)
      if (result) {
        const [order, r] = result
        if (order.tpe === 'Retreat' && r === Success) {
          newUnits.add(new Unit(unit.militaryBranch, order.destination, unit.power))
        }
      } else {
        newUnits.add(unit)
      }
    })

    const newState = (board.state.turn.isBuildable)
      ? new State(board.state.turn, Build)
      : new State(board.state.turn.nextTurn(), Movement)

    // Update occupation if needed
    const occupationStatuses = [...board.provinceStatuses]
      .filter(elem => elem[1].occupied)
      .map(elem => {
        if (elem[1].standoff) {
          return [elem[0], new ProvinceStatus(elem[1].occupied, false)]
        } else {
          return elem
        }
      })
    const newProvinceStatuses = new Map([...occupationStatuses])
    if (board.state.turn.isOccupationUpdateable) {
      newUnits.forEach(unit => {
        newProvinceStatuses.set(unit.location.province, new ProvinceStatus(unit.power, false))
      })
    }

    const newBoard = new Board(board.map, newState, newUnits, [], newProvinceStatuses)
    const orderResults = [...retval].map(elem => {
      const [order, result] = elem
      return new Executed(order, result)
    })

    const numOfCenters = ([...board.map.provinces].filter(p => p.isSupplyCenter)).length
    const numberOfSupplyCenters = StandardRuleUtils.numberOfSupplyCenters(newBoard)
    const isFinished = [...newBoard.map.powers].some(power => {
      return (numberOfSupplyCenters.get(power) || 0) > (numOfCenters / 2)
    })

    return { result: new ResolvedResult(newBoard, orderResults, isFinished) }
  }
}
