package diplomacy.variant.standard.rule

trait Turn {
  val isBuildable: Boolean
  val isOccupationUpdateable: Boolean
}
