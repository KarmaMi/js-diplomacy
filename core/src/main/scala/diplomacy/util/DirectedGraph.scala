package diplomacy.util

import scala.util.control.Breaks

import scala.collection.mutable

case class DirectedGraph[V](nodes: Set[V], edges: Set[(V, V)]) {
  def cycle: Option[Seq[V]] = {
    def visit(node: V, path: Seq[V], visited: mutable.Set[V]): Option[Seq[V]] = {
      visited += node

      var retval: Option[Seq[V]] = None

      val b = new Breaks
      b.breakable {
        for { (n0, n1) <- this.edges if n0 == node } {
          if (visited contains n1) {
            retval = Option(path.slice(path.indexOf(n1), path.length))
            b.break
          } else {
            visit(n1, path :+ n1, visited) match {
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

    for (node <- this.nodes) {
      val visited = mutable.Set[V]()
      visit(node, Seq(node), visited) match {
        case Some(cycle) => return Option(cycle)
        case _ =>
      }
    }
    None
  }

  def -(node: V): DirectedGraph[V] = this.remove(node)
  def remove(node: V): DirectedGraph[V] = {
    this.copy(
      this.nodes - node,
      this.edges filterNot { case (n1, n2) => n1 == node || n2 == node }
    )
  }

  def merge[K](
    mergeTargets: Set[V]
  )(implicit toSet: V => Set[K], fromSet: Set[K] => V): DirectedGraph[V] = {
    val mergedNode = fromSet(mergeTargets flatMap { toSet(_) })
    val newNodes = this.nodes -- mergeTargets + mergedNode

    val newEdges = this.edges flatMap { case (n0, n1) =>
      if ((mergeTargets contains n0) && (mergeTargets contains n1)) {
        None
      } else if (mergeTargets contains n0) {
        Option(mergedNode -> n1)
      } else if (mergeTargets contains n1) {
        Option(n0 -> mergedNode)
      } else {
        Option(n0 -> n1)
      }
    }

    DirectedGraph(newNodes, newEdges)
  }
}
