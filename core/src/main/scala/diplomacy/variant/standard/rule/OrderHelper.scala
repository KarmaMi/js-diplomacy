package diplomacy.variant.standard.rule

import diplomacy.board.{ Power, Board, DiplomacyUnit }

trait OrderHelper[Power_ <: Power] extends DiplomacyUnit.TypeHelper {
  final type Power = Power_
  final type MilitaryBranch = MilitaryBranch.MilitaryBranch

  implicit class GenOrderToLocation(location: Location) {
    require(location.province.homeOf.isDefined)
    def build(tpe: MilitaryBranch) = location.province.homeOf match {
      case Some(home) => Order.Build(DiplomacyUnit(home, tpe, location))
      case _ => ???
    }
  }
  implicit class GenOrderToUnit(unit: DiplomacyUnit) {
    def hold() = Order.Hold(unit)
    def move(destination: Location) = Order.Move(unit, destination, false)
    def support(target: Order.Hold[Power]) = Order.Support(unit, Left(target))
    def support(target: Order.Move[Power]) = Order.Support(unit, Right(target))
    def convoy(target: Order.Move[Power]) = Order.Convoy(unit, target)

    def disband() = Order.Disband(unit)
    def retreat(destination: Location) = Order.Retreat(unit, destination)
  }
  implicit class AddViaConvoyToMove(move: Order.Move[Power]) {
    def viaConvoy = move.copy(useConvoy = true)
  }
}
