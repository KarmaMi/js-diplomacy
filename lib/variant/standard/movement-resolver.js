const DirectedGraph = require('../../util/directed-graph')
const Unit = require('../../data/unit')
const State = require('../../data/state')
const Board = require('../../data/board')
const RuleHelper = require('../../rule/rule-helper')
const StandardRuleUtil = require('./standard-rule-util')

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
          const g = gs.get(order.unit.location) || {}
          g.target = order
          gs.set(order.unit.location, g)
          break
        case 'Move':
          {
            const gs1 = getGroups(order.destination.province)
            const g1 = gs1.get(order.unit.location) || {}
            g1.target = order
            gs1.set(order.unit.location, g1)

            const gs2 = getGroups(order.unit.location.province)
            gs2.set(order.unit.location, { target: order })
          }
          break
        case 'Support':
          {
            const destination = StandardRuleUtil.getDestinationOfSupportOrder(order)
            const gs1 = getGroups(destination.province)
            const g1 = gs1.get(order.target.unit.location) || { target: null }
            g1.supports = g1.supports || []
            g1.supports.push(order)
            gs1.set(order.target.unit.location, g1)

            const gs2 = getGroups(order.unit.location.province)
            const g2 = gs2.get(order.unit.location) || {}
            g2.target = order
            gs2.set(order.unit.location, g2)
          }
          break
        case 'Convoy':
          {
            const gs1 = getGroups(order.target.destination.province)
            const g1 = gs1.get(order.target.unit.location) || { target: null }
            g1.convoy = g1.convoy || []
            g1.convoy.push(order)
            gs1.set(order.target.unit.location, g1)

            const gs2 = getGroups(order.unit.location.province)
            const g2 = gs2.get(order.unit.location) || {}
            g2.target = order
            gs2.set(order.unit.location, g2)
          }
          break
      }
    })

    const orderResult = new Map()
    const updateGroupResult = (group, result) => {
      if (result === $.NoCorrespondingOrder) {
        if (group.supports) {
          group.supports.forEach(o => orderResult.set(o, $.NoCorrespondingOrder))
        }
        if (group.convoy) {
          group.convoy.forEach(o => orderResult.set(o, $.NoCorrespondingOrder))
        }
        return
      }

      function updateSupport (r) {
        group.supports.forEach(support => {
          const result = orderResult.get(support) !== $.Dislodged
          if (result !== $.Dislodged || result !== $.Cut) {
            orderResult.set(support, r)
          }
        })
      }
      function updateConvoy (r) {
        if (group.convoy) {
          group.convoy.forEach(convoy => {
            if (orderResult.get(convoy) !== $.Dislodged) orderResult.set(convoy, r)
          })
        }
      }

      if (result) orderResult.set(group.target, result)
      switch (group.target.type) {
        case 'Move':
          if (result === $.Failed || result === $.Bounced || result === $.Dislodged) {
            updateSupport($.Failed)
            updateConvoy($.Failed)
          } else {
            updateSupport($.Success)
            updateConvoy($.Success)
          }
          break
        default:
          if (result === $.Dislodged) {
            updateSupport($.Failed)
          } else {
            updateSupport($.Success)
          }
          break
      }
    }
    const getRoute = (group) => {
      if (group.target.type !== 'Move') return
      const ps = [...(group.convoy || [])]
        .filter(e => orderResult.get(e) === AbleToConvoy)
        .map(e => e.unit.location.province)
      if (this.canMoveTo(map, group.target.unit, group.target.destination, ps)) {
        return {
          useConvoy: true
        }
      }

      if (map.canMoveTo(group.target.unit).has(group.target.destination)) {
        return {
          useConvoy: false
        }
      }
      return
    }

    // 2. Exclude support or convoy orders that have no corresponding orders
    provinceToOrderGroups.forEach(groups => {
      groups.forEach((group, key) => {
        if (!group.target) {
          updateGroupResult(group, $.NoCorrespondingOrder)
          groups.delete(key)
        }
      })
    })

    // 3. Generate the dependency graph
    const nodeMap = new Map()
    const edges = []

    function addNode (province) {
      if (!nodeMap.has(province)) {
        nodeMap.set(province, nodeMap.size)
      }
    }

    orders.forEach(order => {
      switch (order.type) {
        case 'Hold':
          addNode(order.unit.location.province)
          break
        case 'Move':
          addNode(order.unit.location.province)
          addNode(order.destination.province)
          edges.push(
            [nodeMap.get(order.destination.province), nodeMap.get(order.unit.location.province)]
          )

          break
        case 'Support':
          const destination = StandardRuleUtil.getDestinationOfSupportOrder(order)
          addNode(order.unit.location.province)
          addNode(destination.province)
          if (orderResult.get(order) !== $.NoCorrespondingOrder) {
            edges.push(
              [nodeMap.get(order.unit.location.province), nodeMap.get(destination.province)]
            )
          }
          break
        case 'Convoy':
          addNode(order.unit.location.province)
          addNode(order.target.destination.province)
          if (orderResult.get(order) !== $.NoCorrespondingOrder) {
            edges.push(
              [
                nodeMap.get(order.unit.location.province),
                nodeMap.get(order.target.destination.province)
              ]
            )
          }
          break
      }
    })
    const nodes = new Map([...nodeMap].map(elem => [elem[1], [elem[0]]]))
    let graph = new DirectedGraph(nodes, edges)

    // 4. Find cycles and merge nodes
    while (true) {
      const cycle = graph.getCycle()
      if (!cycle) break
      if (cycle.length <= 1) break

      graph = graph.mergeNodes(cycle)
    }

    // 5. Resolve each province
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
            group.target.unit.location.province !== destination.province && getRoute(group)
        })) {
          orderResult.set(support.target, $.Cut)
        }
      })

      // 3. Exclude support order that is cut
      groups.forEach(elem => {
        const gs = elem[1]
        gs.forEach(group => {
          group.supports = [...(group.supports || [])].filter(order => {
            const result = orderResult.get(order)
            return result !== $.Cut && result !== $.Dislodged
          })
        })
      })

      // 4. Sort provinces by related units
      groups.sort((p1, p2) => {
        if (p1[1].some(g => g.target.type === 'Convoy')) return -1
        if (p2[1].some(g => g.target.type === 'Convoy')) return 1
        const n1 = p1[1].reduce((sum, g) => sum + 1 + (g.support || []).length, 0)
        const n2 = p2[1].reduce((sum, g) => sum + 1 + (g.support || []).length, 0)
        return (n1 < n2) ? -1 : (n1 === n2) ? 0 : 1
      })

      // 5. Resolve each province
      while (groups.length !== 0) {
        const [province, g] = groups.shift()

        // a. Exclude dislodged moves if #provinces <= 2
        const dislodegedMoves = new Set([...g].filter(group => {
          return (
            provinces.length <= 2 &&
            group.target.type === 'Move' &&
            orderResult.get(group.target) === $.Dislodged
          )
        }))
        let gs = [...g].filter(group => !dislodegedMoves.has(group))

        // b. Check whether move orders can be conducted or not
        const failedMoves = new Set()
        gs.forEach(group => {
          if (group.target.type !== 'Move' || group.target.destination.province !== province) return

          const route = getRoute(group)

          if (!route) {
            failedMoves.add(group)
          } else {
            group.target.useConvoy = route.useConvoy
          }
        })
        gs = [...gs].filter(g => !failedMoves.has(g))

        // c. Calculate power for each order
        let maxPower = 0
        let maxOrders = []
        gs.forEach(group => {
          group.power = group.supports.length + 1
          if (maxPower < group.power) {
            maxPower = group.power
            maxOrders = [group.target]
          } else if (maxPower === group.power) {
            maxOrders.push(group.target)
          }
        })

        // d. Resolve dislodged move orders
        dislodegedMoves.forEach(group => updateGroupResult(group, $.Dislodged))

        // e. Resolve failed move orders
        failedMoves.forEach(group => updateGroupResult(group, $.Failed))

        const orders = [...gs]
        const defence = [...orders].find(g => g.target.unit.location.province === province)
        const offence = [...orders].filter(g => g !== defence)
        maxOrders = new Set(maxOrders)
        // f. Resolve the defence order
        if (defence) {
          const order = defence.target
          if (maxOrders.has(order)) {
            switch (order.type) {
              case 'Move': break
              case 'Convoy':
                updateGroupResult(defence, AbleToConvoy)
                break
              case 'Support':
                if (maxOrders.size === 1) {
                  updateGroupResult(defence)
                  break
                }

                if (maxOrders.size === 2) {
                  const move = [...maxOrders].find(elem => elem.type === 'Move')
                  if (move) {
                    const p1 = move.unit.location.province
                    const p2 = StandardRuleUtil.getDestinationOfSupportOrder(order).province

                    if (p1 === p2) {
                      updateGroupResult(defence)
                      break
                    }
                  }
                }
                updateGroupResult(defence, $.Cut)

                break
              default:
                updateGroupResult(defence, $.Success)
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
              const supports = [...(o.supports || [])].filter(support => {
                return StandardRuleUtil.getForceOfUnit(board, support.unit) !== defensiveForce
              })
              offensivePower += supports.length

              if (defence.power < offensivePower) {
                updateGroupResult(defence, $.Dislodged)
              } else {
                if (order.type !== 'Move') {
                  updateGroupResult(defence, (order.type === 'Support') ? $.Cut : $.Success)
                }
              }
            } else {
              if (order.type !== 'Move') {
                updateGroupResult(defence, (order.type === 'Support') ? $.Cut : $.Success)
              }
            }
          }
        }

        // g. Resolve the offence orders
        offence.forEach(group => {
          const order = group.target
          if (maxOrders.has(order)) {
            if (maxOrders.size === 1) {
              if (defence && orderResult.get(defence.target) !== $.Dislodged) {
                updateGroupResult(group, $.Bounced)
              } else {
                updateGroupResult(group, $.Success)
              }
            } else if (maxOrders.size === 2) {
              const order2 = [...maxOrders].find(x => x !== order)
              const result = orderResult.get(order2)
              if (
                order2.type === 'Move' && result !== $.Bounced &&
                order.unit.location.province !== order2.destination.province &&
                order.destination.province !== order2.destination.province
              ) {
                updateGroupResult(group, $.Success)
              } else {
                if (order.useConvoy || order2.useConvoy) {
                  updateGroupResult(group, $.Success)
                } else {
                  updateGroupResult(group, $.Bounced)
                }
              }
            } else {
              updateGroupResult(group, $.Bounced)
            }
          } else {
            updateGroupResult(group, $.Bounced)
          }
        })
      }
    }

    // Geneate a new board
    const { state, units, occupation } = board
    let nextState = null
    let nextOccupation = occupation

    const nextUnits = new Map()
    const nextUnitsStatuses = new Map()
    const nextProvinceSatuses = new Map()
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
            nextUnitsStatuses.set(unit, $.Dislodged)
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
        nextProvinceSatuses.set(province, $.Standoff)
      }
    })

    const existsDislodgedUnits = [...orderResult].some(elem => elem[1] === $.Dislodged)
    if (state.season === $.Autumn) {
      nextOccupation = StandardRuleUtil.updateOccupation(nextUnits, occupation)
      nextState =
        (existsDislodgedUnits)
          ? new State(state.year, state.season, $.Retreat)
          : (StandardRuleUtil.isBuildPhaseRequired(nextUnits, nextOccupation))
            ? new State(state.year, state.season, $.Build)
            : new State(state.year, $.Autumn, $.Movement)
    } else {
      nextState = (existsDislodgedUnits)
        ? new State(state.year, state.season, $.Retreat)
        : new State(state.year, $.Autumn, $.Movement)
    }

    const nextBoard =
      new Board(nextState, nextUnits, nextOccupation, nextUnitsStatuses, nextProvinceSatuses)

    return { board: nextBoard, orderResult: orderResult }
  }

  canMoveTo (map, unit, destination, provinces) {
    provinces = new Set([...provinces])
    const dfs = (current) => {
      const u = new Unit(this.Fleet, current)
      for (const next of [...map.canMoveTo(u)]) {
        if (next.province === destination.province) {
          return true
        } else if (provinces.has(next.province)) {
          provinces.delete(next.province)
          return dfs(next)
        }
      }
    }

    const u = new Unit(this.Fleet, unit.location)
    for (const next of [...map.canMoveTo(u)]) {
      if (provinces.has(next.province)) {
        provinces.delete(next.province)
        if (dfs(next)) {
          return true
        }
      }
    }
    return false
  }
}
