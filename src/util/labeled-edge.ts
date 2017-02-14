import { Edge } from './edge'

export interface LabeledEdge<Node, Label> extends Edge<Node> {
  label: Label
}
