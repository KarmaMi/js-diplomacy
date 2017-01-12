package diplomacy.variant.standard.rule.immutable

import diplomacy.board.Power
import diplomacy.variant.standard.rule.{ MovementOrderWithResult => BaseMovementOrderWithResult }
import diplomacy.variant.standard.rule.{ Order, Result }

final case class MovementOrderWithResult[Power_ <: Power](
  order: Order.MovementOrder[Power_],
  result: Option[Result.Result]
) extends BaseMovementOrderWithResult[Power_]
