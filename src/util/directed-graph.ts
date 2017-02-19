import { IEdge, Edge } from "./edge"

/**
 * Directed graph
 */
export class DirectedGraph<Value> {
  /**
   * The set of nodes.
   */
  nodes: Set<Set<Value>>
  /**
   * The set of edges.
   */
  edges: Set<IEdge<Set<Value>>>
  /**
   * @param nodes The set of nodes.
   * @param edges The set of edges.
   */
  constructor (
    edges: Set<IEdge<Set<Value>>> | Array<IEdge<Set<Value>>>,
    nodes?: Set<Set<Value>> | Array<Set<Value>>
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
   * @return The cycle that is contained this graph. If there are no cycles, returns null.
   */
  getCycle (): Array<Set<Value>> | null {
    const visit =
      (node: Set<Value>, path: Array<Set<Value>>, state: Map<Set<Value>, boolean>): Array<Set<Value>> | null => {
        state.set(node, true)
        let cycle: Array<Set<Value>> | null = null
        for (let edge of [...this.edges].filter(edge => edge.n0 === node)) {
          const v = edge.n1
          if (!state.get(v)) {
            const p = [...path]
            p.push(v)
            const c = visit(v, p, state)
            if (c) {
              cycle = c
              break
            }
          } else {
            cycle = path.slice(path.indexOf(v))
            break
          }
        }
        return cycle
      }

    let cycle = null
    for (let node of [...this.nodes]) {
      const state = new Map([...this.nodes].map(node => <[Set<Value>, boolean]>[node, false]))

      if (!state.get(node)) {
        const c = visit(node, [node], state)
        if (c) {
          cycle = c
          break
        }
      }
    }
    return cycle
  }

  /**
   * Deletes a node.
   * @param node The node to be deleted.
   * @return The directed graph that deletes the node.
   */
  deleteNode (node: Set<Value>): DirectedGraph<Value> {
    const nodes = new Set([...this.nodes].filter(n => n !== node))
    const edges = [...this.edges].filter(edge => edge.n0 !== node && edge.n1 !== node)
    return new DirectedGraph(edges, nodes)
  }

  /**
   * Merges nodes into one node.
   * @param nodes The nodes to be merged.
   * @return The directed graph that merges the nodes into one node.
   */
  mergeNodes (target: Set<Set<Value>>): DirectedGraph<Value> {
    const nodes = new Set<Set<Value>>([...this.nodes])

    let mergedValue: Array<Value> = []
    target.forEach(node => {
      if (!this.nodes.has(node)) return

      mergedValue = mergedValue.concat([...node])
      nodes.delete(node)
    })

    const mergedNode = new Set(mergedValue)
    nodes.add(mergedNode)

    const edges = new Set<Edge<Set<Value>>>()
    this.edges.forEach(edge => {
      const { n0, n1 } = edge
      if (target.has(n0) && target.has(n1)) {
        return
      } else if (target.has(n0)) {
        edges.add(new Edge(mergedNode, n1))
        return
      } else if (target.has(n1)) {
        edges.add(new Edge(n0, mergedNode))
      } else {
        edges.add(edge)
      }
    })

    return new DirectedGraph(edges, nodes)
  }
}
