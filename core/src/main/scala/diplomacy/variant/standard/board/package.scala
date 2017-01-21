package diplomacy.variant.standard

package object board {
  /* Season */
  val Spring = Season.Spring
  val Autumn = Season.Autumn

  /* Turn */
  implicit class Year2Turn(year: Int) {
    val Spring = Turn(year, Season.Spring)
    val Autumn = Turn(year, Season.Autumn)
  }
}
