'use strict'

const chai = require('chai')

const LabeledUndirectedGraph = require('./../../lib/util/labeled-undirected-graph')

class LabeledEdge {
  constructor (v1, v2, label) {
    this.edge = [v1, v2]
    this.label = label
  }
}

chai.should()

describe('LabeledUndirectedGraph', () => {
  it('returns neighbor nodes.', () => {
    const g = new LabeledUndirectedGraph(
      [1, 2, 3],
      [new LabeledEdge(1, 2, 'a'), new LabeledEdge(2, 3, 'b')]
    )
    g.neighborsOf(1).should.deep.equal(new Set([[2, 'a']]))
    g.neighborsOf(2).should.deep.equal(new Set([[1, 'a'], [3, 'b']]))
  })
})
