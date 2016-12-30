package diplomacy.util

import scala.util.control.Breaks

import scala.collection.mutable

case class LabeledUndirectedGraph[V, L](vertices: Set[V], edges: Set[((V, V), L)]) {
  def neighborsOf(v: V): Map[V, L] = (edges collect {
    case ((v0, v1), l) if v0 == v => v1 -> l
    case ((v0, v1), l) if v1 == v => v0 -> l
  })(collection.breakOut)
}
