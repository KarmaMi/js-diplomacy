package diplomacy.util

import diplomacy.UnitSpec

class DirectedGraphSpec extends UnitSpec {
  "A directed graph" when {
    "the type of vertices is Set" can {
      "merge the vertices." in {
        val g1 = DirectedGraph(
          Set(Set(1), Set(2), Set(3), Set(4)),
          Set(Set(1) -> Set(2), Set(2) -> Set(3), Set(3) -> Set(2), Set(3) -> Set(4))
        )
        val g2 = g1.merge(Set(Set(2), Set(3)))
        g2.vertices should be (Set(Set(1), Set(2, 3), Set(4)))
        g2.edges should be(Set(Set(1) -> Set(2, 3), Set(2, 3) -> Set(4)))
      }
    }
    "it has a cycle" should {
      "return the cycle as a return-value of #cycle (1)." in {
        val g = DirectedGraph(Set(1, 2, 3, 4), Set(1 -> 2, 2 -> 3, 3 -> 2, 3 -> 4))
        g.cycle should be (Option(Seq(2, 3)))
      }
      "return the cycle as a return-value of #cycle (2)." in {
        val g = DirectedGraph(Set(1, 2, 3, 4), Set(2 -> 1, 2 -> 3, 3 -> 2, 4 -> 2))
        g.cycle should be (Option(Seq(2, 3)))
      }
    }
    "there is no cycle" should {
      "return None as a return-value of #cycle." in {
        val g = DirectedGraph(Set(1, 2, 4), Set(1 -> 2, 2 -> 4))
        g.cycle should be(None)
      }
    }
  }
  it can {
    "delete a vertex." in {
      val g1 = DirectedGraph(Set(1, 2, 3, 4), Set(1 -> 2, 2 -> 3, 3 -> 2, 3 -> 4))
      val g2 = g1 - 2

      g2.vertices should be(Set(1, 3, 4))
      g2.edges should be(Set(3 -> 4))
    }
  }
}
