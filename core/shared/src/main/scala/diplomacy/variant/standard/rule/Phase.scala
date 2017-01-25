package diplomacy.variant.standard.rule

object Phase {
  sealed abstract class Phase(name: String) {
    override def toString: String = name
  }
  object Movement extends Phase("Movement")
  object Retreat extends Phase("Retreat")
  object Build extends Phase("Build")
}
