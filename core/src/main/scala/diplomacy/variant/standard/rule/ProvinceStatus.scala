package diplomacy.variant.standard.rule

object ProvinceStatus {
  sealed class ProvinceStatus(name: String) {
    override def toString: String = name
  }
  object Standoff extends ProvinceStatus("Standoff")
}
