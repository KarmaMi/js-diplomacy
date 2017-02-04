const { Unit, Board } = require('../../../board/package')
const { ResolvedResult, OrderResult: { Executed } } = require('../../../rule/package')
const OrderDependency = require('./order-dependency')
const MovementOrderWithResult = require('./movement-order-with-result')
const MovementOrderGroup = require('./movement-order-group')
const State = require('./state')
const { Retreat } = require('./phase')
const Dislodged = require('./dislodged')
const Result = require('./result')
const ProvinceStatus = require('./province-status')

module.exports = class MovementResolver {
  resolve (board, orders) {
    const ordersWithResult = [...orders].map(order => new MovementOrderWithResult(order))
    const movesViaConvoy = new Set()
    const dislodgedFrom = new Map()

    function canBounce (order1, order2) {
      if (order1.order.tpe === 'Move' && order2.order.tpe === 'Move') {
        if (order1.order.destination.province === order2.order.destination.province) {
          return true
        } else if (
          (order1.order.destination.province === order2.order.unit.location.province) &&
          (order2.order.destination.province === order1.order.unit.location.province)
        ) {
          if (movesViaConvoy.has(order1.order) || movesViaConvoy.has(order2.order)) {
            return order1.getResult() === Result.Bounced || order2.getResult() === Result.Bounced
          } else {
            return true
          }
        } else if (order1.order.destination.province === order2.order.unit.location.province) {
          return order2.getResult() === Result.Bounced
        } else if (order2.order.destination.province === order1.order.unit.location.province) {
          return order1.getResult() === Result.Bounced
        } else {
          return false
        }
      } else if (order1.order.tpe === 'Move') {
        return order1.order.destination.province === order2.order.unit.location.province
      } else if (order2.order.tpe === 'Move') {
        return order2.order.destination.province === order1.order.unit.location.province
      } else {
        return false
      }
    }

    // 1. Divide orders into groups
    const province2TmpOrderGroup = new Map()
    function getOrderGroup (province, location) {
      const groups = province2TmpOrderGroup.get(province) || new Map()
      const group = groups.get(location) || new MovementOrderGroup(null, [])
      groups.set(location, group)
      province2TmpOrderGroup.set(province, groups)

      return group
    }
    ordersWithResult.forEach(order => {
      const group = getOrderGroup(order.order.unit.location.province, order.order.unit.location)
      group.target = order
      switch (order.order.tpe) {
        case 'Hold':
          break
        case 'Move':
          const group1 = getOrderGroup(order.order.destination.province, order.order.unit.location)
          group1.target = order
          break
        case 'Support':
          const group2 =
            getOrderGroup(order.order.destination.province, order.order.target.unit.location)
          group2.relatedOrders.add(order)
          break
        case 'Convoy':
          const group3 =
            getOrderGroup(order.order.target.destination.province, order.order.target.unit.location)
          group3.relatedOrders.add(order)
          break
        default:
      }
    })
    // 2. Exclude support or convoy orders that have no corresponding orders
    for (let elem of [...province2TmpOrderGroup]) {
      for (let elem2 of [...elem[1]]) {
        if (!elem2[1].target) {
          elem2[1].relatedOrders.forEach(order => { order.setResult(Result.NoCorrespondingOrder) })
          elem[1].delete(elem2[0])
        }
      }
    }
    const province2OrderGroups = new Map()
    province2TmpOrderGroup.forEach((groups, province) => {
      province2OrderGroups.set(province, new Set([...groups.values()]))
    })

    // 3. Generate the dependency graph
    let graph = new OrderDependency(ordersWithResult).graph

    // 4. Resolve orders following dependency
    while (graph.nodes.size > 0) {
      const target = [...graph.nodes].find(node => {
        return [...graph.edges].every(elem => elem[1] !== node[0])
      })

      if (!target) {
        return { err: `Internal Error` }
      }

      graph = graph.deleteNode(target[0])
      const provinces = target[1]

      // Get all related order groups
      const relatedGroups = new Map([...provinces].map(province => {
        const groups = province2OrderGroups.get(province) || new Set()
        return [province, new Set([...groups])]
      }))

      // Resolve each province
      while (relatedGroups.size !== 0) {
        // 1. Resolve cutting support
        relatedGroups.forEach(groups => {
          groups.forEach(group => {
            switch (group.target.order.tpe) {
              case 'Support':
                const support = group.target.order
                const destination = support.destination
                const isCut = [...groups].some(group => {
                  if (group.target.order.tpe === 'Move') {
                    return (group.target.order.unit.location.province !== destination.province) &&
                      (group.route(board.map)) &&
                      (support.unit.power !== group.target.order.unit.power)
                  }
                  return false
                })
                if (isCut) {
                  group.target.setResult(Result.Cut)
                }
                break
            }
          })
        })

        // 2. Sort provinces by related units
        const sortedGroups = [...relatedGroups].sort((a, b) => {
          const hasG1Convoy = [...a[1]].some(group => {
            return group.target.order.tpe === 'Convoy'
          })
          const hasG2Convoy = [...b[1]].some(group => {
            return group.target.order.tpe === 'Convoy'
          })

          if (hasG1Convoy) {
            return -1
          } else if (hasG2Convoy) {
            return 1
          } else {
            const pow1 = Math.max(...[...a[1]].map(group => group.power()))
            const pow2 = Math.max(...[...b[1]].map(group => group.power()))
            return (pow1 > pow2) ? -1 : 1
          }
        })

        // 3. Check whether move orders can be conducted or not
        const failedMoves = new Set()
        sortedGroups.forEach(elem => {
          const [province, groups] = elem
          groups.forEach(group => {
            if (
              (group.target.order.tpe === 'Move') &&
              (province === group.target.order.destination.province)
            ) {
              const route = group.route(board.map)
              if (route) {
                if (route.viaConvoy) {
                  movesViaConvoy.add(group.target.order)
                }
              } else {
                failedMoves.add(group)
              }
            }
          })
        })

        if (sortedGroups.length === 0) {
          continue
        }

        // 4. Resolve the province, and delete it from the buffer
        const [province, groups] = sortedGroups[0]
        relatedGroups.delete(province)

        // 5. Resolve and exclude failed move orders
        groups.forEach(group => {
          if (failedMoves.has(group)) {
            group.target.setResult(Result.Failed)
            group.relatedOrders.forEach(o => { o.setResult(Result.Failed) })
            groups.delete(group)
          }
        })

        const defenceOpt = [...groups].find(group => {
          return group.target.order.unit.location.province === province
        })
        const offence = new Set([...groups])
        if (defenceOpt) offence.delete(defenceOpt)

        // 6. Resolve and exclude dislodged moves if #provinces <= 2
        if ([...provinces].length <= 2) {
          if (defenceOpt) {
            offence.forEach(group => {
              if (group.target.order.tpe === 'Move') {
                const isDislodged =
                  (!group.target.getResult()) ? false : group.target.getResult() === Result.Dislodged
                if (isDislodged && canBounce(group.target, defenceOpt.target)) {
                  groups.delete(group)
                  offence.delete(group)
                  group.relatedOrders.forEach(o => { o.setResult(Result.Failed) })
                }
              }
            })
          }
        }

        if (groups.size === 0) continue

        // 7. Find orders that have the highest power
        const maxPower = Math.max(...[...groups].map(group => group.power()))
        const maxOrders =
          new Set([...groups].filter(g => g.power() >= maxPower).map(g => g.target))

        // 8. Resolve the defence order
        if (defenceOpt) {
          if (maxOrders.has(defenceOpt.target)) {
            switch (defenceOpt.target.order.tpe) {
              case 'Move':
                break
              case 'Hold':
                defenceOpt.target.setResult(Result.Success)
                defenceOpt.relatedOrders.forEach(o => { o.setResult(Result.Success) })
                break
              case 'Convoy':
                if (defenceOpt.target.getResult() !== Result.NoCorrespondingOrder) {
                  defenceOpt.target.setResult(Result.Failed) // This convoy order is available.
                }
                defenceOpt.relatedOrders.forEach(o => { o.setResult(Result.Success) })
                break
              default:
                defenceOpt.relatedOrders.forEach(o => { o.setResult(Result.Success) })
                break
            }
          } else {
            let isDislodged = false
            const offenceGroup = [...offence].find(group => maxOrders.has(group.target))
            if (maxOrders.size === 1) {
              if (offenceGroup) {
                let offensivePower = 0
                if (offenceGroup.target.order.unit.power !== defenceOpt.target.order.unit.power) {
                  offensivePower += 1
                }
                const validSupports = [...offenceGroup.validSupports()].filter(s => {
                  return s.unit.power !== defenceOpt.target.order.unit.power
                })
                offensivePower += validSupports.length

                isDislodged = defenceOpt.power() < offensivePower
              }

              if (isDislodged) {
                if (offenceGroup) {
                  defenceOpt.target.setResult(Result.Dislodged)
                  dislodgedFrom.set(
                    defenceOpt.target.order.unit, offenceGroup.target.order.unit.location.province
                  )
                  defenceOpt.relatedOrders.forEach(order => { order.setResult(Result.Failed) })
                }
              } else {
                if (defenceOpt.target.order.tpe === 'Hold') {
                  defenceOpt.target.setResult(Result.Success)
                  defenceOpt.relatedOrders.forEach(o => { o.setResult(Result.Success) })
                }
              }
            }
          }
        }

        // 9. Resolve the offence orders
        offence.forEach(group => {
          let isBounced = true
          if (maxOrders.has(group.target)) {
            if (maxOrders.size === 1) {
              if (defenceOpt) {
                isBounced = defenceOpt.target.getResult() !== Result.Dislodged
              } else {
                isBounced = false
              }
            } else if (maxOrders.size === 2) {
              const order2 = [...maxOrders].find(o => o !== group.target)
              isBounced = canBounce(group.target, order2)
            }
          }
          if (isBounced) {
            group.target.setResult(Result.Bounced)
            group.relatedOrders.forEach(o => { o.setResult(Result.Failed) })
          } else {
            group.target.setResult(Result.Success)
            group.relatedOrders.forEach(o => { o.setResult(Result.Success) })
          }
        })
      }
    }

    // Generate a new board
    const unit2Result = new Map(ordersWithResult.map(order => {
      return [order.order.unit, [order.order, order.getResult()]]
    }))

    const newUnits = new Set()
    board.units.forEach(unit => {
      const r = [...unit2Result].find(elem => {
        return (elem[0].militaryBranch === unit.militaryBranch) &&
          (elem[0].location === unit.location) &&
          (elem[0].power === unit.power)
      })
      if (r) {
        const [unit, [order, result]] = r
        if (order.tpe === 'Move' && result === Result.Success) {
          newUnits.add(new Unit(unit.militaryBranch, order.destination, unit.power))
        } else {
          newUnits.add(unit)
        }
      } else {
        newUnits.add(unit)
      }
    })
    const newUnitStatuses = new Map()
    ordersWithResult.forEach(order => {
      if (order.getResult() === Result.Dislodged) {
        const x = dislodgedFrom.get(order.order.unit)
        newUnitStatuses.set(order.order.unit, new Dislodged(x))
      }
    })
    const provincesContainingUnit = new Set([...newUnits].map(u => u.location.province))
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
    province2OrderGroups.forEach((groups, province) => {
      const wasBounced = [...groups].some(group => group.target.getResult() === Result.Bounced)
      const standoff = wasBounced && !(provincesContainingUnit.has(province))

      if (standoff) {
        const current = newProvinceStatuses.get(province) || new ProvinceStatus(null, true)
        const x = new ProvinceStatus(current.occupied, true)
        newProvinceStatuses.set(province, x)
      }
    })
    const newState = new State(board.state.turn, Retreat)
    const newBoard = new Board(board.map, newState, newUnits, newUnitStatuses, newProvinceStatuses)

    const orderResults = [...ordersWithResult].map(order => {
      return new Executed(order.order, order.getResult())
    })

    return { result: new ResolvedResult(newBoard, orderResults, false) }
  }
}
