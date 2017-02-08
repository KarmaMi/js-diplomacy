'use strict'

/**
 * @classdesc Directed graph
 * @memberof util
 * @prop {!Map.<Key,Value>} nodes - The set of nodes.
 * @prop {!Set.<Key>} edges - The set of edges.
 */
class DirectedGraph {
  /**
   * @constructor
   * @param {!Map.<Key,Value>} nodes - The set of nodes.
   * @param {!Set.<Key>} edges - the set of edges.
   */
  constructor (nodes, edges) {
    this.nodes = new Map([...nodes])
    this.edges = new Set([...edges])
  }

  /**
   * @return {?Array.<Key>} -
   *   The cycle that is contained this graph. If there are no cycles, returns null.
   */
  getCycle () {
    const visit = (key, path, state) => {
      state.set(key, true)
      let cycle = null
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
      const state = new Map([...this.nodes].map(elem => {
        return [elem[0], false]
      }))

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
   * @param {!Key} key - The node (key) to be deleted.
   * @return {!util.DirectedGraph} - The directed graph that deletes the key.
   */
  deleteNode (key) {
    const nodes = new Map([...this.nodes].filter(elem => elem[0] !== key))
    const edges = [...this.edges].filter(edge => edge[0] !== key && edge[1] !== key)
    return new DirectedGraph(nodes, edges)
  }

  /**
   * Merges nodes into one node.
   * @param {!Array.<Key>} keys - The nodes (keys) to be merged.
   * @return {!util.DirectedGraph} - The directed graph that merges the nodes into one node.
   */
  mergeNodes (keys) {
    keys = new Set([...keys])

    const nodes = new Map()
    let mergedKey = null
    let mergedValue = []
    keys.forEach(key => {
      if (!this.nodes.has(key)) return

      if (!mergedKey) {
        mergedKey = key
      }
      const value = this.nodes.get(key)
      this.nodes.delete(key)
      if (Array.isArray(value)) {
        mergedValue = mergedValue.concat(value)
      } else {
        mergedValue.push(value)
      }
    })

    // No nodes are merged.
    if (!mergedKey) return this

    nodes.set(mergedKey, mergedValue)
    this.nodes.forEach((value, key) => nodes.set(key, value))

    const edges = []
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

    return new DirectedGraph(nodes, edges)
  }
}

module.exports = DirectedGraph
