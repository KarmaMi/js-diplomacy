package diplomacy.util

import diplomacy.UnitSpec

class LabeledUndirectedGraphSpec extends UnitSpec {
  "A labeled undirected graph" can {
    "return neighbor vertices." in {
      val g = LabeledUndirectedGraph(Set(1, 2, 3), Set((1 -> 2, 'a'), (2 -> 3, 'b')))
      g.neighborsOf(1) should be(Map(2 -> 'a'))
      g.neighborsOf(2) should be(Map(1 -> 'a', 3 -> 'b'))
    }
  }
}
