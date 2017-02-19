/**
 * Edge of a graph
 */
export interface IEdge<Node> {
  n0: Node
  n1: Node
}

/**
 * Implementation of IEdge
 */
export class Edge<Node> implements IEdge<Node> {
  constructor (public n0: Node, public n1: Node) {}
}
