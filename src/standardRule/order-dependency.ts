import { Order, Hold, Move, Support, Convoy } from "./order"
import { Result } from "./data"
import { MovementOrderWithResult } from "./movement-order-with-result"
import { graph } from "./../graph"
import { board } from "./../board"

const { DirectedGraph, Edge } = graph
const { Province } = board

export class OrderDependency<Power> {
  graph: graph.DirectedGraph<board.Province<Power>>
  constructor (
    ordersWithResult: Set<MovementOrderWithResult<Power>> | Array<MovementOrderWithResult<Power>>
  ) {
    const nodeMap = new Map<board.Province<Power>, Set<board.Province<Power>>>()
    const nodes = new Set<Set<board.Province<Power>>>()
    const edges = new Set<graph.Edge<Set<board.Province<Power>>>>()

    function addNode(p1: board.Province<Power>) {
      if (nodeMap.has(p1)) {
        return
      }

      const n1 = new Set([p1])
      nodeMap.set(p1, n1)
      nodes.add(n1)
    }

    function addEdge(p1: board.Province<Power>, p2: board.Province<Power>) {
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

    let graph = new DirectedGraph<board.Province<Power>>(edges, nodes)
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
