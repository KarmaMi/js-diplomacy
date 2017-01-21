package diplomacy.variant.standard.rule

import diplomacy.board.Power

trait MovementOrderWithResult[Power_ <: Power] {
  def order: Order.MovementOrder[Power_]
  def result: Option[Result]
}
