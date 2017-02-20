import * as chai from "chai"
import { Edge, DirectedGraph } from "./../../src/util/module"

const should = chai.should()

describe("DirectedGraph", () => {
  const nodes = [new Set(["a"]), new Set(["b"]), new Set(["c"]), new Set(["d"])]
  it("can merge the nodes.", () => {
    const g1 = new DirectedGraph<string>(
      [
        new Edge(nodes[0], nodes[1]), new Edge(nodes[1], nodes[2]),
        new Edge(nodes[2], nodes[1]), new Edge(nodes[2], nodes[3])
      ]
    )
    const g2 = g1.mergeNodes(new Set([nodes[1], nodes[2]]))

    Array.from(g2.nodes).should.have.deep.members(
      [new Set(["a"]), new Set(["b", "c"]), new Set(["d"])]
    )
    Array.from(g2.edges).should.have.deep.members(
      [new Edge(new Set(["a"]), new Set(["b", "c"])), new Edge(new Set(["b", "c"]), new Set(["d"]))]
    )

    const g3 = g2.mergeNodes(g2.nodes)
    Array.from(g3.nodes).should.have.deep.members([new Set(["a", "d", "b", "c"])])
  })
  it("can delete a node.", () => {
    const g1 = new DirectedGraph<string>(
      [
        new Edge(nodes[0], nodes[1]), new Edge(nodes[1], nodes[2]),
        new Edge(nodes[2], nodes[1]), new Edge(nodes[2], nodes[3])
      ]
    )
    const g2 = g1.deleteNode(nodes[1])

    Array.from(g2.nodes).should.have.deep.members([new Set(["a"]), new Set(["c"]), new Set(["d"])])
    Array.from(g2.edges).should.have.deep.members([new Edge(new Set(["c"]), new Set(["d"]))])
  })
  describe("#getCycle", () => {
    it("returns a cycle (1)", () => {
      const g = new DirectedGraph<string>(
        [
          new Edge(nodes[0], nodes[1]), new Edge(nodes[1], nodes[2]),
          new Edge(nodes[2], nodes[1]), new Edge(nodes[2], nodes[3])
        ]
      )
      const cycle = g.getCycle()
      should.not.equal(cycle, null)
      if (cycle) {
        cycle.should.have.deep.members([nodes[1], nodes[2]])
      }
    })
    it("returns a cycle (2)", () => {
      const g = new DirectedGraph<string>(
        [
          new Edge(nodes[0], nodes[1]), new Edge(nodes[1], nodes[2]),
          new Edge(nodes[2], nodes[1]), new Edge(nodes[2], nodes[3])
        ]
      )
      const cycle = g.getCycle()
      should.not.equal(cycle, null)
      if (cycle) {
        cycle.should.have.deep.members([nodes[1], nodes[2]])
      }
    })
    it("returns null if there are no cycles", () => {
      const g = new DirectedGraph<string>(
        [new Edge(nodes[0], nodes[1]), new Edge(nodes[1], nodes[3])]
      )
      const cycle = g.getCycle()
      should.equal(cycle, null)
    })
  })
})
