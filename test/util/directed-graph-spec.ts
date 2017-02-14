import * as chai from "chai"
import { DirectedGraph } from "./../../src/util/directed-graph"

const should = chai.should()

describe("DirectedGraph", () => {
  it("can merge the nodes.", () => {
    const g1 = new DirectedGraph<number, string>(
      [[1, new Set(["a"])], [2, new Set(["b"])], [3, new Set(["c"])], [4, new Set(["d"])]],
      [[1, 2], [2, 3], [3, 2], [3, 4]]
    )
    const g2 = g1.mergeNodes(new Set([2, 3]))

    g2.nodes.should.deep.equal(
      new Map([[2, new Set(["b", "c"])], [1, new Set(["a"])], [4, new Set(["d"])]])
    )
    g2.edges.should.deep.equal(new Set([[1, 2], [2, 4]]))

    const g3 = g2.mergeNodes(new Set([1, 2, 4]))
    g3.nodes.should.deep.equal(new Map([[1, new Set(["a", "b", "c", "d"])]]))
  })
  it("can delete a node.", () => {
    const g1 = new DirectedGraph<number, string>(
      [[1, new Set(["a"])], [2, new Set(["b"])], [3, new Set(["c"])], [4, new Set(["d"])]],
      [[1, 2], [2, 3], [3, 2], [3, 4]]
    )
    const g2 = g1.deleteNode(2)

    g2.nodes.should.deep.equal(
      new Map([[1, new Set(["a"])], [3, new Set(["c"])], [4, new Set(["d"])]])
    )
    g2.edges.should.deep.equal(new Set([[3, 4]]))
  })
  describe("#getCycle", () => {
    it("returns a cycle (1)", () => {
      const g = new DirectedGraph<number, string>(
        [[1, new Set(["a"])], [2, new Set(["b"])], [3, new Set(["c"])], [4, new Set(["d"])]],
        [[1, 2], [2, 3], [3, 2], [3, 4]]
      )
      const cycle = g.getCycle()
      should.not.equal(cycle, null)
      if (cycle) {
        cycle.should.deep.equal([2, 3])
      }
    })
    it("returns a cycle (2)", () => {
      const g = new DirectedGraph<number, string>(
        [[1, new Set(["a"])], [2, new Set(["b"])], [3, new Set(["c"])], [4, new Set(["d"])]],
        [[2, 1], [2, 3], [3, 2], [4, 2]]
      )
      const cycle = g.getCycle()
      should.not.equal(cycle, null)
      if (cycle) {
        cycle.should.deep.equal([2, 3])
      }
    })
    it("returns null if there are no cycles", () => {
      const g = new DirectedGraph<number, string>(
        [[1, new Set(["a"])], [2, new Set(["b"])], [4, new Set(["d"])]],
        [[1, 2], [2, 4]]
      )
      const cycle = g.getCycle()
      should.equal(cycle, null)
    })
  })
})
