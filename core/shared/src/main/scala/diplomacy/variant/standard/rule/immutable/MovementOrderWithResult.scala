package diplomacy.variant.standard.rule.immutable

import diplomacy.board.Power
import diplomacy.variant.standard.rule.{ MovementOrderWithResult => BaseMovementOrderWithResult }
import diplomacy.variant.standard.rule.{ MovementOrder, Result }

final case class MovementOrderWithResult[Power_ <: Power](
  order: MovementOrder[Power_], result: Option[Result]
) extends BaseMovementOrderWithResult[Power_]
