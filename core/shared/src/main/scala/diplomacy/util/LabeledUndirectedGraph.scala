package diplomacy.util

import scala.util.control.Breaks

import scala.collection.mutable

case class LabeledUndirectedGraph[V, L](vertices: Set[V], edges: Set[((V, V), L)]) {
  require(edges forall { case ((v0, v1), _) => (vertices contains v0) && (vertices contains v1)})

  def this(edges: Set[((V, V), L)]) = {
    this(
      edges flatMap { case ((v1, v2), _) => Set(v1, v2) },
      edges
    )
  }

  def neighborsOf(v: V): Map[V, L] = (edges collect {
    case ((v0, v1), l) if v0 == v => v1 -> l
    case ((v0, v1), l) if v1 == v => v0 -> l
  })(collection.breakOut)
}

object LabeledUndirectedGraph {
  def apply[V, L](edges: Set[((V, V), L)]): LabeledUndirectedGraph[V, L] = {
    LabeledUndirectedGraph(edges flatMap { case ((v1, v2), _) => Set(v1, v2) }, edges)
  }
}
