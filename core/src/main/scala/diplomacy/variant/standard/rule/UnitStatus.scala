package diplomacy.variant.standard.rule

import diplomacy.board.{ Power, Province }

object UnitStatus {
  sealed class UnitStatus(name: String) {
    override def toString: String = name
  }
  final case class Dislodged[Power_ <: Power](attackedFrom: Province[Power_])
    extends UnitStatus(s"Dislodged from ${attackedFrom.name}")
}
