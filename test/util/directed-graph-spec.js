'use strict'

const chai = require('chai')
const assert = require('assert')

const DirectedGraph = require('./../../lib/util/directed-graph')

chai.should()

describe('DirectedGraph', () => {
  it('can merge the nodes.', () => {
    const g1 = new DirectedGraph(
      [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']],
      [[1, 2], [2, 3], [3, 2], [3, 4]]
    )
    const g2 = g1.mergeNodes([2, 3]);

    ([...g2.nodes]).should.deep.equal([[2, ['b', 'c']], [1, 'a'], [4, 'd']]);
    ([...g2.edges]).should.deep.equal([[1, 2], [2, 4]])

    const g3 = g2.mergeNodes([1, 2, 4]);
    ([...g3.nodes]).should.deep.equal([[1, ['a', 'b', 'c', 'd']]])
  })
  it('can delete a node.', () => {
    const g1 = new DirectedGraph(
      [[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']],
      [[1, 2], [2, 3], [3, 2], [3, 4]]
    )
    const g2 = g1.deleteNode(2);

    ([...g2.nodes]).should.deep.equal([[1, 'a'], [3, 'c'], [4, 'd']]);
    ([...g2.edges]).should.deep.equal([[3, 4]])
  })
})
