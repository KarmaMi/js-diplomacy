'use strict'

const chai = require('chai')

const DirectedGraph = require('./../../lib/util/directed-graph')

chai.should()

describe('DirectedGraph', () => {
  it('can merge the nodes.', () => {
    const g1 = new DirectedGraph(
      [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']],
      [[1, 2], [2, 3], [3, 2], [3, 4]]
    )
    const g2 = g1.mergeNodes([2, 3])

    g2.nodes.should.deep.equal(new Map([[2, ['b', 'c']], [1, 'a'], [4, 'd']]))
    g2.edges.should.deep.equal(new Set([[1, 2], [2, 4]]))

    const g3 = g2.mergeNodes([1, 2, 4])
    g3.nodes.should.deep.equal(new Map([[1, ['a', 'b', 'c', 'd']]]))
  })
  it('can delete a node.', () => {
    const g1 = new DirectedGraph(
      [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']],
      [[1, 2], [2, 3], [3, 2], [3, 4]]
    )
    const g2 = g1.deleteNode(2)

    g2.nodes.should.deep.equal(new Map([[1, 'a'], [3, 'c'], [4, 'd']]))
    g2.edges.should.deep.equal(new Set([[3, 4]]))
  })
  describe('#getCycle', () => {
    it('returns a cycle (1)', () => {
      const g = new DirectedGraph(
        [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']],
        [[1, 2], [2, 3], [3, 2], [3, 4]]
      )
      const cycle = g.getCycle()
      cycle.should.deep.equal([2, 3])
    })
    it('returns a cycle (2)', () => {
      const g = new DirectedGraph(
        [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']],
        [[2, 1], [2, 3], [3, 2], [4, 2]]
      )
      const cycle = g.getCycle()
      cycle.should.deep.equal([2, 3])
    })
    it('returns null if there are no cycles', () => {
      const g = new DirectedGraph(
        [[1, 'a'], [2, 'b'], [4, 'd']],
        [[1, 2], [2, 4]]
      )
      const cycle = g.getCycle();
      (cycle === null).should.equal(true)
    })
  })
})
