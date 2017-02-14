import * as chai from "chai"
import { LabeledUndirectedGraph } from "./../../src/util/labeled-undirected-graph"

chai.should()

class LabeledEdge {
  constructor (public n0: number, public n1: number, public label: string) {
  }
}

describe("LabeledUndirectedGraph", () => {
  it("returns neighbor nodes.", () => {
    const g = new LabeledUndirectedGraph<number, string>(
      [new LabeledEdge(1, 2, "a"), new LabeledEdge(2, 3, "b")], [1, 2, 3]
    )
    g.neighborsOf(1).should.deep.equal(new Set([[2, "a"]]))
    g.neighborsOf(2).should.deep.equal(new Set([[1, "a"], [3, "b"]]))
  })
})