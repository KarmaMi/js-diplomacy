import { LabeledEdge } from "./labeled-edge"

/**
 * Undirected graph with labeled edges
 * {@link board.MapEdge} is an example.
 */
export class LabeledUndirectedGraph<Node, Label> {
  /**
   * The set of nodes.
   */
  nodes: Set<Node>
  /**
   * The set of edges.
   */
  edges: Set<LabeledEdge<Node, Label>>

  /**
   * @param edges The set of edges.
   * @param nodes The set of nodles.
   */
  constructor (
    edges: Set<LabeledEdge<Node, Label>> | Array<LabeledEdge<Node, Label>>,
    nodes?: Set<Node> | Array<Node>
  ) {
    this.edges = new Set([...edges])
    if (!nodes) {
      this.nodes = new Set()
      this.edges.forEach(edge => {
        this.nodes.add(edge.n0)
        this.nodes.add(edge.n1)
      })
    } else {
      this.nodes = new Set([...nodes])
    }
  }
  /**
   * @param node - The target node
   * @return he set of nodes that are neighbors of the node.
   */
  neighborsOf (node: Node): Set<[Node, Label]> {
    const ns = new Set()
    this.edges.forEach(edge => {
      if (edge.n0 === node) {
        ns.add([edge.n1, edge.label])
      } else if (edge.n1 === node) {
        ns.add([edge.n0, edge.label])
      }
    })

    return ns
  }
}
