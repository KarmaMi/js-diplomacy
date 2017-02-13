export interface LabeledEdge<Node, Label> {
  edge: Array<Node> // TODO
  label: Label
}

/**
 * Undirected graph with labeled edges
 * {@link board.MapEdge} is an example.
 */
export default class LabeledUndirectedGraph<Node, Label> {
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
        this.nodes.add(edge.edge[0])
        this.nodes.add(edge.edge[1])
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
      if (edge.edge[0] === node) {
        ns.add([edge.edge[1], edge.label])
      } else if (edge.edge[1] === node) {
        ns.add([edge.edge[0], edge.label])
      }
    })

    return ns
  }
}
