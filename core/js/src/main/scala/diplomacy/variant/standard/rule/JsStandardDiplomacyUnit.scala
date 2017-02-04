package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board.Power

@JSExport @JSExportAll
case class JsStandardDiplomacyUnit[Power_ <: Power](unit: DiplomacyUnit[Power_]) {
  def hold() = JsOrder(Order.Hold(unit))
  def move(destination: Location[Power_]) = JsOrder(Order.Move(unit, destination, false))
  def moveViaConvoy(destination: Location[Power_]) = JsOrder(Order.Move(unit, destination, true))
  def support(target: JsOrder[Power_]) = target.order match {
    case target@ Order.Hold(_) => JsOrder(Order.Support(unit, Left(target)))
    case target@ Order.Move(_, _, _) => JsOrder(Order.Support(unit, Right(target)))
    case _ => ???
  }
  def convoy(target: JsOrder[Power_]) = target.order match {
    case target@ Order.Move(_, _, _) => JsOrder(Order.Convoy(unit, target))
    case _ => ???
  }

  def disband() = JsOrder(Order.Disband(unit))
  def retreat(destination: Location[Power_]) = JsOrder(Order.Retreat(unit, destination))
  def build() = JsOrder(Order.Build(unit))
}
