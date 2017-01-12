package diplomacy.variant.standard.rule

import scala.collection.{ mutable => cmutable }

import diplomacy.board.{ Power, Province }
import diplomacy.util.DirectedGraph

final class OrderDependency[Power_ <: Power](
  orderWithResult: Set[immutable.MovementOrderWithResult[Power_]]
) extends Province.TypeHelper {
  type Power = Power_

  val graph = {
    type Order = Order.MovementOrder[Power_]

    val nodes = cmutable.Set[Province]()
    val edges = cmutable.Set[(Province, Province)]()

    orderWithResult foreach { order =>
      order.order match {
        case h: Order.Hold[Power_] => nodes += h.unit.location.province
        case m: Order.Move[Power_] =>
          nodes ++= Set(m.unit.location.province, m.destination.province)
          edges += (m.destination.province -> m.unit.location.province)
        case s: Order.Support[Power_] =>
          nodes += s.unit.location.province
          if (order.result != Option(Result.NoCorrespondingOrder)) {
            nodes += s.destinationLocation.province
            edges += (s.unit.location.province -> s.destinationLocation.province)
          }
        case c: Order.Convoy[Power_] =>
          nodes += c.unit.location.province
          if (order.result != Option(Result.NoCorrespondingOrder)) {
            nodes += c.target.destination.province
            edges += (c.unit.location.province -> c.target.destination.province)
          }
      }
    }

    def mergeNodes(graph: DirectedGraph[Set[Province]]): DirectedGraph[Set[Province]] = {
      graph.cycle match {
        case Some(c) if c.size > 1 => graph.merge(c.toSet)
        case _ => graph
      }
    }
    mergeNodes(DirectedGraph(
      (nodes map { n => Set(n) })(collection.breakOut),
      (edges map { case (n1, n2) => (Set(n1) -> Set(n2)) })(collection.breakOut)
    ))
  }
}
