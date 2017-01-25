package diplomacy.variant.standard.board

sealed abstract class Season(name: String) {
  override def toString: String = name
}

object Season {
  object Spring extends Season("Spring")
  object Autumn extends Season("Autumn")
}
