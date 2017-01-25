package diplomacy.variant.standard.rule

import diplomacy.board.Power

trait MovementOrderWithResult[Power_ <: Power] {
  def order: MovementOrder[Power_]
  def result: Option[Result]
}
