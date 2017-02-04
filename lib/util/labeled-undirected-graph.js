module.exports = class LabeledUndirectedGraph {
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
