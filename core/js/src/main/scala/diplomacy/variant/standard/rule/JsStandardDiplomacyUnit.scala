package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board.Power

@JSExport @JSExportAll
case class JsStandardDiplomacyUnit[Power_ <: Power](unit: DiplomacyUnit[Power_]) {
  def hold() = Order.Hold(unit)
  def move(destination: Location[Power_]) = Order.Move(unit, destination, false)
  def moveViaConvoy(destination: Location[Power_]) = Order.Move(unit, destination, true)
  def support(target: Order[Power_]) = target match {
    case target@ Order.Hold(_) => Order.Support(unit, Left(target))
    case target@ Order.Move(_, _, _) => Order.Support(unit, Right(target))
    case _ => ???
  }
  def convoy(target: Order.Move[Power_]) = Order.Convoy(unit, target)

  def disband() = Order.Disband(unit)
  def retreat(destination: Location[Power_]) = Order.Retreat(unit, destination)
  def build() = Order.Build(unit)
}
