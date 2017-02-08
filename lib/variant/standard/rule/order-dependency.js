const Result = require('./result')
const { DirectedGraph } = require('../../../util/package')

module.exports = class OrderDependency {
  constructor (ordersWithResult) {
    const nodeMap = new Map()
    const nodes = new Map()
    const edges = []

    function addNode (node) {
      if (!nodeMap.has(node)) {
        const key = nodeMap.size
        nodeMap.set(node, key)
        nodes.set(key, node)
      }
    }

    ordersWithResult.forEach(orderWithResult => {
      addNode(orderWithResult.order.unit.location.province)
      switch (orderWithResult.order.tpe) {
        case 'Hold':
          break
        case 'Move':
          addNode(orderWithResult.order.destination.province)
          edges.push(
            [
              nodeMap.get(orderWithResult.order.destination.province),
              nodeMap.get(orderWithResult.order.unit.location.province)
            ]
          )
          break
        case 'Support':
          if (orderWithResult.getResult() !== Result.NoCorrespondingOrder) {
            addNode(orderWithResult.order.destination.province)
            edges.push(
              [
                nodeMap.get(orderWithResult.order.unit.location.province),
                nodeMap.get(orderWithResult.order.destination.province)
              ]
            )
          }
          break
        case 'Convoy':
          if (orderWithResult.getResult() !== Result.NoCorrespondingOrder) {
            addNode(orderWithResult.order.target.destination.province)
            edges.push(
              [
                nodeMap.get(orderWithResult.order.unit.location.province),
                nodeMap.get(orderWithResult.order.target.destination.province)
              ]
            )
          }
          break
        default:
      }
    })

    let graph = new DirectedGraph([...nodes].map(e => [e[0], [e[1]]]), edges)
    while (true) {
      const c = graph.getCycle()
      if (c && c.length > 1) {
        graph = graph.mergeNodes(c)
      } else {
        break
      }
    }

    this.graph = graph
  }
}
