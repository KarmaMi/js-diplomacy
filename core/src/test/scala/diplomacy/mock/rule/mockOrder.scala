package diplomacy.mock.rule

final case class Hold(unit: DiplomacyUnit) extends Order

final case class Move(unit: DiplomacyUnit, destination: Location) extends Order
