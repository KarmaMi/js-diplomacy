package diplomacy.variant.standard.rule

object UnitStatus {
  sealed class UnitStatus(name: String)
  object Dislodged extends UnitStatus("Dislodged")
}
