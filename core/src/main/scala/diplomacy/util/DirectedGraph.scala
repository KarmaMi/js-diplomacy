package diplomacy.util

import scala.util.control.Breaks

import scala.collection.mutable

case class DirectedGraph[V](vertices: Set[V], edges: Set[(V, V)]) {
  require(edges forall { case (v0, v1) => (vertices contains v0) && (vertices contains v1)})

  def cycle: Option[Seq[V]] = {
    def visit(vertex: V, path: Seq[V], visited: mutable.Set[V]): Option[Seq[V]] = {
      visited += vertex

      var retval: Option[Seq[V]] = None

      val b = new Breaks
      b.breakable {
        for { (v0, v1) <- this.edges if v0 == vertex } {
          if (visited contains v1) {
            retval = Option(path.slice(path.indexOf(v1), path.length))
            b.break
          } else {
            visit(v1, path :+ v1, visited) match {
              case Some(cycle) =>
                retval = Option(cycle)
                b.break
              case None =>
            }
          }
        }
      }

      retval
    }

    for (vertex <- this.vertices) {
      val visited = mutable.Set[V]()
      visit(vertex, Seq(vertex), visited) match {
        case Some(cycle) => return Option(cycle)
        case _ =>
      }
    }
    None
  }

  def -(vertex: V): DirectedGraph[V] = this.remove(vertex)
  def remove(vertex: V): DirectedGraph[V] = {
    this.copy(
      this.vertices - vertex,
      this.edges filterNot { case (v0, v1) => v0 == vertex || v1 == vertex }
    )
  }

  def merge[K](
    mergeTargets: Set[V]
  )(implicit toSet: V => Set[K], fromSet: Set[K] => V): DirectedGraph[V] = {
    val mergedVertex = fromSet(mergeTargets flatMap { toSet(_) })
    val newVertices = this.vertices -- mergeTargets + mergedVertex

    val newEdges = this.edges flatMap { case (v0, v1) =>
      if ((mergeTargets contains v0) && (mergeTargets contains v1)) {
        None
      } else if (mergeTargets contains v0) {
        Option(mergedVertex -> v1)
      } else if (mergeTargets contains v1) {
        Option(v0 -> mergedVertex)
      } else {
        Option(v0 -> v1)
      }
    }

    DirectedGraph(newVertices, newEdges)
  }
}
