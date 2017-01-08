package diplomacy.variant.standard.rule

object ProvinceStatus {
  sealed class ProvinceStatus(name: String)
  object Standoff extends ProvinceStatus("Standoff")
}
