const DirectedGraph = require('../../util/directed-graph')
const StandardRuleUtil = require('./standard-rule-util')
const RuleKeywordsHelper = require('../../rule/rule-keywords-helper')

module.exports = class OrderDependencyGraph extends DirectedGraph {
  constructor (rule, orders, orderResultMap) {
    const $ = RuleKeywordsHelper(rule)
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
          const destination = order.getDestination()
          addNode(order.unit.location.province)
          addNode(destination.province)
          if (orderResultMap.get(order) !== $.NoCorrespondingOrder) {
            edges.push(
              [nodeMap.get(order.unit.location.province), nodeMap.get(destination.province)]
            )
          }
          break
        case 'Convoy':
          addNode(order.unit.location.province)
          addNode(order.target.destination.province)
          if (orderResultMap.get(order) !== $.NoCorrespondingOrder) {
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

    super(graph.nodes, graph.edges)
  }
}
