package diplomacy.variant.standard

import diplomacy.UnitSpec
import diplomacy.variant.standard.map._

class VariantSpec extends UnitSpec {
  "The variant" should {
    "define the initial board." in {
      for { power <- variant.initialBoard.map.powers } {
        val numOfSupplys = variant.initialBoard.numberOfSupplyCenters(power)
        val numOfUnits = variant.initialBoard.units count { _.power == power }
        power match {
          case Russia =>
            numOfSupplys should be(4)
            numOfUnits should be(4)
          case _ =>
            numOfSupplys should be(3)
            numOfUnits should be(3)
        }
      }
    }
  }
}
