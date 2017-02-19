import { Order, Hold, Move, Support, Convoy } from "./order"
import { Result } from "./result"
import { MovementOrderWithResult } from "./movement-order-with-result"
import { DirectedGraph, Edge } from "../../../util/module"
import { Province } from "../../../board/module"

export class OrderDependency<Power> {
  graph: DirectedGraph<Province<Power>>
  constructor (
    ordersWithResult: Set<MovementOrderWithResult<Power>> | Array<MovementOrderWithResult<Power>>
  ) {
    const nodeMap = new Map<Province<Power>, Set<Province<Power>>>()
    const nodes = new Set<Set<Province<Power>>>()
    const edges = new Set<Edge<Set<Province<Power>>>>()

    function addNode(p1: Province<Power>) {
      if (nodeMap.has(p1)) {
        return
      }

      const n1 = new Set([p1])
      nodeMap.set(p1, n1)
      nodes.add(n1)
    }

    function addEdge(p1: Province<Power>, p2: Province<Power>) {
      const n1 = nodeMap.get(p1)
      const n2 = nodeMap.get(p2)
      if (n1 && n2) {
        edges.add(new Edge(n1, n2))
      }
    }

    const os = [...ordersWithResult]
    os.forEach(orderWithResult => {
      const order = orderWithResult.order
      addNode(order.unit.location.province)
      if (order instanceof Hold) {
      } else if (order instanceof Move) {
        const o: Move<Power> = order
        addNode(o.destination.province)
        addEdge(o.destination.province, o.unit.location.province)
      } else if (order instanceof Support) {
        const o: Support<Power> = order
        if (orderWithResult.getResult() !== Result.NoCorrespondingOrder) {
          addNode(o.destination.province)
          addEdge(o.unit.location.province, o.destination.province)
        }
      } else if (order instanceof Convoy) {
        const o: Convoy<Power> = order
        if (orderWithResult.getResult() !== Result.NoCorrespondingOrder) {
          addNode(o.target.destination.province)
          addEdge(o.unit.location.province, o.target.destination.province)
        }
      }
    })

    let graph = new DirectedGraph<Province<Power>>(edges, nodes)
    while (true) {
      const c = graph.getCycle()
      if (c && c.length > 1) {
        graph = graph.mergeNodes(new Set([...c]))
      } else {
        break
      }
    }

    this.graph = graph
  }
}
