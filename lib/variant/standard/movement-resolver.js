const Unit = require('../../data/unit')
const Board = require('../../data/board')
const RuleHelper = require('../../rule/rule-helper')
const StandardRuleUtil = require('./standard-rule-util')

const MovementOrderGroup = require('./movement-order-group')
const OrderDependencyGraph = require('./order-dependency-graph')

const AbleToConvoy = 'AbleToConvoy'

module.exports = class MovementResolver {
  constructor (rule) {
    this.rule = rule

    this.Fleet = [...this.rule.militaryBranches].find(elem => {
      return elem.name === 'Fleet' && elem.abbreviatedName === 'F'
    })
  }
  resolve (map, board, orders) {
    const $ = new RuleHelper(this.rule)
    const orderResult = new Map()
    const dislodgedFrom = new Map()

    const canBounce = (order1, order2) => {
      const isUnitMove = (order) => order.type === 'Move'

      if (isUnitMove(order1) && isUnitMove(order2)) {
        if (order1.destination.province === order2.destination.province) {
          return true
        } else if (
          order1.destination.province === order2.unit.location.province &&
          order2.destination.province === order1.unit.location.province
        ) {
          if (order1.useConvoy || order2.useConvoy) {
            return orderResult.get(order1) === $.Bounced && orderResult.get(order2) === $.Bounced
          } else {
            return true
          }
        } else if (order1.destination.province === order2.unit.location.province) {
          return orderResult.get(order2) === $.Bounced
        } else if (order2.destination.province === order1.unit.location.province) {
          return orderResult.get(order1) === $.Bounced
        } else {
          return false
        }
      } else if (isUnitMove(order1)) {
        return order1.destination.province === order2.unit.location.province
      } else if (isUnitMove(order2)) {
        return order2.destination.province === order1.unit.location.province
      } else {
        return false
      }
    }

    // 1. Divide orders into groups
    const provinceToOrderGroups = new Map()
    orders.forEach(order => {
      function getGroups (province) {
        if (!provinceToOrderGroups.has(province)) {
          provinceToOrderGroups.set(province, new Map())
        }
        return provinceToOrderGroups.get(province)
      }
      switch (order.type) {
        case 'Hold':
          const gs = getGroups(order.unit.location.province)
          const g = gs.get(order.unit.location) || new MovementOrderGroup(this.rule, orderResult)
          g.addTargetOrder(order)
          gs.set(order.unit.location, g)
          break
        case 'Move':
          {
            const gs1 = getGroups(order.destination.province)
            const g1 = gs1.get(order.unit.location) || new MovementOrderGroup(this.rule, orderResult)
            g1.target = order
            gs1.set(order.unit.location, g1)

            const gs2 = getGroups(order.unit.location.province)
            const x = new MovementOrderGroup(this.rule, orderResult)
            x.addTargetOrder(order)
            gs2.set(order.unit.location, x)
          }
          break
        case 'Support':
          {
            const destination = StandardRuleUtil.getDestinationOfSupportOrder(order)
            const gs1 = getGroups(destination.province)
            const g1 = gs1.get(order.target.unit.location) || new MovementOrderGroup(this.rule, orderResult)
            g1.addRelatedOrder(order)
            gs1.set(order.target.unit.location, g1)

            const gs2 = getGroups(order.unit.location.province)
            const g2 = gs2.get(order.unit.location) || new MovementOrderGroup(this.rule, orderResult)
            g2.addTargetOrder(order)
            gs2.set(order.unit.location, g2)
          }
          break
        case 'Convoy':
          {
            const gs1 = getGroups(order.target.destination.province)
            const g1 = gs1.get(order.target.unit.location) || new MovementOrderGroup(this.rule, orderResult)
            g1.addRelatedOrder(order)
            gs1.set(order.target.unit.location, g1)

            const gs2 = getGroups(order.unit.location.province)
            const g2 = gs2.get(order.unit.location) || new MovementOrderGroup(this.rule, orderResult)
            g2.addTargetOrder(order)
            gs2.set(order.unit.location, g2)
          }
          break
      }
    })

    // 2. Exclude support or convoy orders that have no corresponding orders
    provinceToOrderGroups.forEach(groups => {
      groups.forEach((group, key) => {
        if (!group.target) {
          group.updateResult($.NoCorrespondingOrder)
          groups.delete(key)
        }
      })
    })

    // 3. Generate the dependency graph
    let graph = new OrderDependencyGraph(this.rule, orders, orderResult)

    // 4. Resolve each province
    while (graph.nodes.size !== 0) {
      const node = [...graph.nodes].find(node => graph.edges.every(edge => edge[1] !== node[0]))
      if (!node) return `Internal Error: ${orders}`

      const key = node[0]
      const provinces = [...node[1]]
      graph = graph.deleteNode(key)

      // 1. Get all related order groups
      const groups = provinces.map(province => {
        const gs = [...provinceToOrderGroups.get(province)] || []
        return [province, gs.filter(g => g[1].target).map(g => g[1])]
      })

      // 2. Resolve cutting support
      groups.forEach(elem => {
        const groups = elem[1]
        const support = [...groups].find(group => group.target.type === 'Support')
        if (!support) return

        const destination = StandardRuleUtil.getDestinationOfSupportOrder(support.target)
        if ([...groups].some(group => {
          return group.target.type === 'Move' &&
            group.target.unit.location.province !== destination.province && group.findRoute(map)
        })) {
          orderResult.set(support.target, $.Cut)
        }
      })

      // 3. Exclude support order that is cut
      groups.forEach(elem => elem[1].forEach(group => group.removeUnavailableSupports()))

      // 4. Sort provinces by related units
      groups.sort((p1, p2) => {
        if (p1[1].some(g => g.target.type === 'Convoy')) return -1
        if (p2[1].some(g => g.target.type === 'Convoy')) return 1
        const n1 = p1[1].reduce((sum, g) => sum + 1 + g.supports.length, 0)
        const n2 = p2[1].reduce((sum, g) => sum + 1 + g.supports.length, 0)
        return (n1 < n2) ? 1 : (n1 === n2) ? 0 : -1
      })

      // 5. Resolve each province
      while (groups.length !== 0) {
        const [province, g] = groups.shift()
        const defence = [...g].find(g => g.target.unit.location.province === province)
        const offence = new Set([...g].filter(g => g !== defence))

        // a. Exclude dislodged moves if #provinces <= 2
        const dislodegedMoves = new Set([...offence].filter(group => {
          if (!defence) return false
          return (
            provinces.length <= 2 &&
            group.target.type === 'Move' &&
            orderResult.get(group.target) === $.Dislodged &&
            canBounce(group.target, defence.target)
          )
        }))
        dislodegedMoves.forEach(group => offence.delete(group))

        // b. Check whether move orders can be conducted or not
        const failedMoves = new Set()
        groups.forEach(gs => {
          gs[1].forEach(group => {
            if (group.target.type !== 'Move' || gs[0] !== group.target.destination.province) {
              return
            }

            const route = group.findRoute(map)

            if (route) {
              group.target.useConvoy = route.useConvoy
            }
          })
        })
        offence.forEach(group => {
          if (group.target.type !== 'Move' || province !== group.target.destination.province) {
            return
          }

          const route = group.findRoute(map)

          if (!route) {
            offence.delete(group)
            failedMoves.add(group)
          } else {
            group.target.useConvoy = route.useConvoy
          }
        })

        const gs = new Set([...offence])
        if (defence) gs.add(defence)

        // c. Calculate power for each order
        gs.forEach(group => {
          group.power = group.getPower()
        })

        // d. Find orders that have the highest power
        let maxPower = 0
        let maxOrders = []
        gs.forEach(group => {
          if (maxPower < group.power) {
            maxPower = group.power
            maxOrders = [group.target]
          } else if (maxPower === group.power) {
            maxOrders.push(group.target)
          }
        })

        // e. Resolve dislodged move orders
        dislodegedMoves.forEach(group => group.updateResult($.Dislodged))

        // f. Resolve failed move orders
        failedMoves.forEach(group => group.updateResult($.Failed))

        maxOrders = new Set(maxOrders)
        // g. Resolve the defence order
        if (defence) {
          const order = defence.target
          if (maxOrders.has(order)) {
            switch (order.type) {
              case 'Move': break
              case 'Convoy':
                if (orderResult.get(order) === $.NoCorrespondingOrder) break
                defence.updateResult(AbleToConvoy)
                break
              case 'Support':
                if (orderResult.get(order) === $.NoCorrespondingOrder) break

                if (maxOrders.size === 1) {
                  defence.updateResult()
                  break
                }

                if (maxOrders.size === 2) {
                  const move = [...maxOrders].find(elem => elem.type === 'Move')
                  if (move) {
                    const p1 = move.unit.location.province
                    const p2 = StandardRuleUtil.getDestinationOfSupportOrder(order).province

                    if (p1 === p2) {
                      defence.updateResult()
                      break
                    }
                  }
                }
                defence.updateResult($.Cut)
                break
              default:
                defence.updateResult($.Success)
                break
            }
          } else {
            if (maxOrders.size === 1) {
              // Check self dislodgement
              const defensiveForce = StandardRuleUtil.getForceOfUnit(board, order.unit)
              const o = [...gs].find(g => maxOrders.has(g.target))
              let offensivePower = 0

              if (StandardRuleUtil.getForceOfUnit(board, o.target.unit) !== defensiveForce) {
                offensivePower += 1
              }
              const supports = [...o.supports].filter(support => {
                return StandardRuleUtil.getForceOfUnit(board, support.unit) !== defensiveForce
              })
              offensivePower += supports.length

              if (defence.power < offensivePower) {
                defence.updateResult($.Dislodged)
                dislodgedFrom.set(
                  defence.target.unit.location.province, o.target.unit.location.province
                )
              } else if (order.type !== 'Move') {
                defence.updateResult((order.type === 'Support') ? $.Cut : $.Success)
              }
            } else if (order.type !== 'Move') {
              defence.updateResult((order.type === 'Support') ? $.Cut : $.Success)
            }
          }
        }

        // h. Resolve the offence orders
        offence.forEach(group => {
          const order = group.target
          if (maxOrders.has(order)) {
            if (maxOrders.size === 1) {
              if (defence && orderResult.get(defence.target) !== $.Dislodged) {
                group.updateResult($.Bounced)
              } else {
                group.updateResult($.Success)
              }
            } else if (maxOrders.size === 2) {
              const order2 = [...maxOrders].find(x => x !== order)
              if (canBounce(order, order2)) {
                group.updateResult($.Bounced)
              } else {
                group.updateResult($.Success)
              }
            } else {
              group.updateResult($.Bounced)
            }
          } else {
            group.updateResult($.Bounced)
          }
        })
      }
    }

    // Geneate a new board
    const { state, units, occupation } = board

    const nextUnits = new Map()
    const nextUnitsStatuses = new Map()
    const nextProvinceStatuses = new Map()
    const provincesContainingUnit = new Set()

    const provinceToOrderResult = new Map([...orderResult].map(elem => {
      const [order, result] = elem
      return [order.unit.location.province, [order, result]]
    }))
    units.forEach((units, force) => {
      const us = []
      units.forEach(unit => {
        if (provinceToOrderResult.has(unit.location.province)) {
          const [order, result] = provinceToOrderResult.get(unit.location.province)
          if (result === $.Dislodged) {
            const force = StandardRuleUtil.getForceOfUnit(board, unit)

            if (!nextUnitsStatuses.has(force)) {
              nextUnitsStatuses.set(force, new Map())
            }
            const xs = nextUnitsStatuses.get(force)
            xs.set(unit, {
              status: $.Dislodged,
              attackedFrom: dislodgedFrom.get(unit.location.province)
            })
          } else if (result === $.Success && order.type === 'Move') {
            us.push(new Unit(unit.militaryBranch, order.destination))
          } else {
            us.push(unit)
          }
        } else {
          us.push(unit)
        }
      })
      us.forEach(unit => provincesContainingUnit.add(unit.location.province))
      nextUnits.set(force, us)
    })
    provinceToOrderGroups.forEach((groups, province) => {
      if (
        !provincesContainingUnit.has(province) &&
        [...groups.values()].some(g => orderResult.get(g.target) === $.Bounced)
      ) {
        nextProvinceStatuses.set(province, $.Standoff)
      }
    })

    const nextOccupation =
      (state.season === $.Autumn)
        ? StandardRuleUtil.updateOccupation(nextUnits, occupation)
        : occupation

    const nextState =
      StandardRuleUtil.getNextState(this.rule, state, nextUnits, nextOccupation, nextUnitsStatuses)

    const nextBoard =
      new Board(nextState, nextUnits, nextOccupation, nextUnitsStatuses, nextProvinceStatuses)

    return { board: nextBoard, orderResult: orderResult }
  }
}
