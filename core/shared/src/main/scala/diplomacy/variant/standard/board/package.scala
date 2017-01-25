package diplomacy.variant.standard

package object board {
  object Keywords {
    /* Season */
    val Spring = Season.Spring
    val Autumn = Season.Autumn
  }

  object Implicits {
    /* Turn */
    implicit class Year2Turn(year: Int) {
      val Spring = Turn(year, Season.Spring)
      val Autumn = Turn(year, Season.Autumn)
    }
  }
}
