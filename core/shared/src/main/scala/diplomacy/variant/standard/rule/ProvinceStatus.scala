package diplomacy.variant.standard.rule

sealed abstract class ProvinceStatus(name: String) {
  override def toString: String = name
}

object ProvinceStatus {
  object Standoff extends ProvinceStatus("Standoff")
}
