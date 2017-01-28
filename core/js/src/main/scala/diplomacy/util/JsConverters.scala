package diplomacy.util

import scala.scalajs.js
import scala.scalajs.js.JSConverters._
import scala.scalajs.js.annotation.{ JSExport, JSExportAll }
import scala.collection.mutable

@JSExport @JSExportAll
object JsConverters {
  def fromEither[V1 <: js.Any, V2 <: js.Any](either: Either[V1, V2]) = either match {
    case Left(v1) => js.Dynamic.literal("err" -> v1)
    case Right(v2) => js.Dynamic.literal("result" -> v2)
  }

  def toOption[V](opt: js.UndefOr[V]): Option[V] = opt.toOption

  def fromOption[V](opt: Option[V]): js.UndefOr[V] = opt.orUndefined

  def toSet[V](arr: js.Array[V]): Set[V] = arr.toSet
  def toSeq[V](arr: js.Array[V]): mutable.Seq[V] = arr
  def toMap[K, V](arr: js.Array[js.Array[js.Any]]): Map[K, V] = {
    (arr flatMap { keyValue =>
      for {
        k <- keyValue.headOption collect { case k: K => k }
        v <- keyValue.lastOption collect { case v: V => v }
      } yield (k -> v)
    }).toMap
  }

  def fromTraversable[V](cs: Traversable[V]): js.Array[V] = cs.toSeq.toJSArray
  def fromMap[K, V](map: Map[K, V]): js.Array[js.Array[Any]] = {
    (map.toSeq map { case (k, v) => Seq(k, v).toJSArray }).toJSArray
  }
}
