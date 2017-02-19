import { IEdge, Edge } from './edge'

/**
 * Labeled edge of a graph
 */
export interface ILabeledEdge<Node, Label> extends IEdge<Node> {
  label: Label
}

/**
 * Implementation of ILabeledEdge
 */
export class LabeledEdge<Node, Label> extends Edge<Node> {
  constructor (n0: Node, n1: Node, public label: Label) {
    super(n0, n1)
  }
}
