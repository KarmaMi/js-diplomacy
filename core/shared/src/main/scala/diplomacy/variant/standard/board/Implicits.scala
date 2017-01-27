package diplomacy.variant.standard.board

object Implicits {
  /* Turn */
  implicit class Year2Turn(year: Int) {
    val Spring = Turn(year, Season.Spring)
    val Autumn = Turn(year, Season.Autumn)
  }
}
