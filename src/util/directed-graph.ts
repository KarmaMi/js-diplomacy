/**
 * Directed graph
 */
export default class DirectedGraph<Key, Node> {
  /**
   * The set of nodes.
   */
  nodes: Map<Key, Set<Node>>
  /**
   * The set of edges.
   */
  edges: Set<Array<Key>> // TODO type of edges
  /**
   * @param nodes The set of nodes.
   * @param edges The set of edges.
   */
  constructor (
    nodes: Map<Key, Set<Node>> | Array<[Key, Set<Node>]>,
    edges: Set<Array<Key>> | Array<Array<Key>>
  ) {
    this.nodes = new Map([...nodes])
    this.edges = new Set([...edges])

  }

  /**
   * @return The cycle that is contained this graph. If there are no cycles, returns null.
   */
  getCycle (): Array<Key> | null {
    const visit = (key: Key, path: Array<Key>, state: Map<Key, boolean>): Array<Key> | null => {
      state.set(key, true)
      let cycle: Array<Key> | null = null
      for (let edge of [...this.edges].filter(edge => edge[0] === key)) {
        const v = edge[1]
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
    for (let elem of [...this.nodes]) {
      const state = new Map([...this.nodes].map(elem => <[Key, boolean]>[elem[0], false]))

      const key = elem[0]
      if (!state.get(key)) {
        const c = visit(key, [key], state)
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
   * @param key The node (key) to be deleted.
   * @return The directed graph that deletes the key.
   */
  deleteNode (key: Key): DirectedGraph<Key, Node> {
    const nodes = new Map([...this.nodes].filter(elem => elem[0] !== key))
    const edges = [...this.edges].filter(edge => edge[0] !== key && edge[1] !== key)
    return new DirectedGraph(nodes, new Set([...edges]))
  }

  /**
   * Merges nodes into one node.
   * @param keys The nodes (keys) to be merged.
   * @return The directed graph that merges the nodes into one node.
   */
  mergeNodes (keys: Set<Key>): DirectedGraph<Key, Node> {
    const nodes = new Map<Key, Set<Node>>()
    let mergedKeyOpt: Key | null = null
    let mergedValue: Array<Node> = []
    keys.forEach(key => {
      if (!this.nodes.has(key)) return

      if (!mergedKeyOpt) {
        mergedKeyOpt = key
      }
      const value: Array<Node> = [...(this.nodes.get(key) || new Set())]
      this.nodes.delete(key)
      mergedValue = mergedValue.concat(value)
    })

    // No nodes are merged.
    if (!mergedKeyOpt) return this

    const mergedKey: Key = mergedKeyOpt

    nodes.set(mergedKey, new Set(mergedValue))
    this.nodes.forEach((value, key) => nodes.set(key, value))

    const edges: Array<Array<Key>> = []
    this.edges.forEach(edge => {
      const [n1, n2] = edge
      if (keys.has(n1) && keys.has(n2)) {
        return
      } else if (keys.has(n1)) {
        edges.push([mergedKey, n2])
        return
      } else if (keys.has(n2)) {
        edges.push([n1, mergedKey])
      } else {
        edges.push([n1, n2])
      }
    })

    return new DirectedGraph(nodes, new Set(edges))
  }
}
