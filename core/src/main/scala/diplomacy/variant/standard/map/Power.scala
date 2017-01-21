package diplomacy.variant.standard.map

import diplomacy.board.{ Power => BasePower }

sealed class Power(val name: String) extends BasePower

object Power {
  object Austria extends Power("Austria")
  object England extends Power("England")
  object France extends Power("France")
  object Germany extends Power("Germany")
  object Italy extends Power("Italy")
  object Russia extends Power("Russia")
  object Turkey extends Power("Turkey")
}
