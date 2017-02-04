package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board.{ Power, JsLocation }
import diplomacy.rule.{ JsOrder => BaseJsOrder }
import diplomacy.util.JsConverters._

@JSExport @JSExportAll
final case class JsOrder[Power_ <: Power](order: Order[Power_]) extends BaseJsOrder[Order[Power_]] {
  val tpe = order match {
    case Order.Hold(_) => "Hold"
    case Order.Move(_, _, _) => "Move"
    case Order.Support(_, _) => "Support"
    case Order.Convoy(_, _) => "Convoy"
    case Order.Retreat(_, _) => "Retreat"
    case Order.Disband(_) => "Disband"
    case Order.Build(_) => "Build"
  }
  val useConvoy = order match {
    case Order.Move(_, _, useConvoy) => fromOption(Option(useConvoy))
    case _ => fromOption(None)
  }
  val destination = order match {
    case Order.Move(_, destination, _) => fromOption(Option(JsLocation(destination)))
    case Order.Retreat(_, destination) => fromOption(Option(JsLocation(destination)))
    case _ => fromOption(None)
  }
  val target = order match {
    case Order.Support(_, Right(move)) => fromOption(Option(JsOrder(move)))
    case Order.Support(_, Left(hold)) => fromOption(Option(JsOrder(hold)))
    case Order.Convoy(_, target) => fromOption(Option(JsOrder(target)))
    case _ => fromOption(None)
  }
}
