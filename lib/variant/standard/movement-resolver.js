const DirectedGraph = require('../../util/directed-graph')
const Unit = require('../../data/unit')
const State = require('../../data/state')
const Board = require('../../data/board')
const RuleHelper = require('../../rule/rule-helper')
const StandardRuleUtil = require('./standard-rule-util')

module.exports = class MovementResolver {
  constructor (rule) {
    this.rule = rule

    this.Fleet = [...this.rule.militaryBranches].find(elem => {
      return elem.name === 'Fleet' && elem.abbreviatedName === 'F'
    })
  }
  resolve (map, board, orders) {
    // Generate the dependency graph
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
          edges.push(
            [nodeMap.get(order.unit.location.province), nodeMap.get(destination.province)]
          )
          break
        case 'Convoy':
          addNode(order.unit.location.province)
          addNode(order.target.destination.province)
          edges.push(
            [
              nodeMap.get(order.unit.location.province),
              nodeMap.get(order.target.destination.province)
            ]
          )
          break
      }
    })
    const nodes = new Map([...nodeMap].map(elem => [elem[1], [elem[0]]]))
    let graph = new DirectedGraph(nodes, edges)

    // Find cycles and merge nodes
    while (true) {
      const cycle = graph.getCycle()
      if (!cycle) break
      if (cycle.length <= 1) break

      graph = graph.mergeNodes(cycle)
    }

    // Resolve each province
    function resolvableProvinces () {
      return [...graph.nodes].find(node => {
        return graph.edges.every(edge => edge[1] !== node[0])
      })
    }

    const $ = new RuleHelper(this.rule)

    const orderResult = new Map()
    const provinceResult = new Map()
    while (graph.nodes.size !== 0) {
      const node = resolvableProvinces()
      if (!node) return `Internal Error: ${orders}`

      const key = node[0]
      const provinces = [...node[1]]
      graph = graph.deleteNode(key)

      for (const province of provinces) {
        // 1. Get all orders related to the province
        const offense = new Set()
        let defense = null
        const supports = new Map()
        orders.forEach(order => {
          switch (order.type) {
            case 'Hold':
              if (order.unit.location.province === province) {
                defense = order
              }
              break
            case 'Move':
              if (order.unit.location.province === province) {
                if (!(orderResult.has(order) && orderResult.get(order) === $.Success)) {
                  defense = order
                }
              } else if (order.destination.province === province) {
                offense.add(order)
              }
              break
            case 'Support':
              if (StandardRuleUtil.getDestinationOfSupportOrder(order).province === province) {
                if (orderResult.get(order) !== $.Cut && orderResult.get(order) !== $.Dislodged) {
                  const key = order.target.unit.location
                  const ss = supports.has(key) ? supports.get(key) : []
                  ss.push(order)
                  supports.set(key, ss)
                }
                break
              } else if (order.unit.location.province === province) {
                defense = order
              }
              break
          }
        })

        // 2. Calculate power for each order
        let maxPower = 0
        let maxOrders = []
        if (defense) {
          if (defense.type === 'Move') {
            maxPower = 1
            maxOrders.push(defense)
          } else {
            const ss =
              supports.has(defense.unit.location) ? supports.get(defense.unit.location) : []
            maxPower = 1 + ss.length
            maxOrders.push(defense)
            supports.delete(defense.unit.location)
          }
        }

        offense.forEach(target => {
          const p = supports.has(target.unit.location)
            ? 1 + supports.get(target.unit.location).length
            : 1
          if (maxPower < p) {
            maxPower = p
            maxOrders = [target]
          } else if (maxPower === p) {
            maxOrders.push(target)
          }
          supports.delete(target.unit.location)
        })

        // 3. Resolve orders
        const isSo = (maxOrders.length > 1) && maxOrders.every(order => {
          return order.type === 'Move' && order.destination.province === province
        })
        maxOrders = new Set(maxOrders)
        if (defense) {
          if (maxOrders.has(defense)) {
            switch (defense.type) {
              case 'Move': break
              case 'Support':
                orderResult.set(defense, $.Cut)
                break
              case 'Hold':
                orderResult.set(defense, $.Success)
                break
              case 'Convoy':
                orderResult.set(defense, $.Hold)
                break
            }
          } else {
            orderResult.set(defense, $.Dislodged)
          }
        }
        offense.forEach(target => {
          if (maxOrders.has(target)) {
            if (maxOrders.length === 1) {
              orderResult.set(target, $.Success)
            } else {
              orderResult.set(target, isSo ? $.Standoff : $.Fail)
            }
          } else {
            orderResult.set(target, $.Fail)
          }
        })
        supports.forEach(support => {
          orderResult.set(support, $.NoCorrespondingOrder)
        })

        if (isSo) {
          provinceResult.set(province, $.Standoff)
        }
      }
    }

    // Geneate a new board
    const { state, units, occupation } = board
    let nextState = null
    let nextOccupation = occupation

    const nextUnits = new Map()
    const nextUnitsStatuses = new Map()

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
      nextUnits.set(force, us)
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
      new Board(nextState, nextUnits, nextOccupation, nextUnitsStatuses, provinceResult)

    return { board: nextBoard, orderResult: orderResult }
  }
}
