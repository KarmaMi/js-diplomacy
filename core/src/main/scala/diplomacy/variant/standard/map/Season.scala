package diplomacy.variant.standard.map

object Season {
  sealed class Season(name: String) {
    override def toString: String = name
  }
  object Spring extends Season("Spring")
  object Autumn extends Season("Autumn")
}
