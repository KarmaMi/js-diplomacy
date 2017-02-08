'use strict'

/**
 * @classdesc Undirected graph with labeled edges
 * @memberof util
 * @prop {!Set.<Node>} nodes - The set of nodes.
 * @prop {!Set.<Edge>} edges -
 *   The set of edges. Edge instances should have 1) edge and 2) label properties.
 *   {@link board.MapEdge} is an example.
 */
class LabeledUndirectedGraph {
/**
 * @constructor
 * @param {!(Set.<Node>|Set.<Edge>)} v1 -
 *   The set of nodes if v2 is not null. The set of edges if v1 is null
 * @param {?Set.<Edge>} v2 - The set of edges. If it is null, v1 is used as a set of edges.
 */
  constructor (v1, v2) {
    if (!v2) {
      this.edges = new Set([...v1])
      this.nodes = new Set()
      this.edges.forEach(edge => {
        this.nodes.add(edge.edge[0])
        this.nodes.add(edge.edge[1])
      })
    } else {
      this.nodes = new Set([...v1])
      this.edges = new Set([...v2])
    }
  }
  /**
   * @param {!Node} node - The target node
   * @return {!Set.<Node>} The set of nodes that are neighbors of the node.
   */
  neighborsOf (node) {
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

module.exports = LabeledUndirectedGraph
