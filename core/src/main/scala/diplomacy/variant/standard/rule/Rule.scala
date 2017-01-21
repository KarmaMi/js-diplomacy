package diplomacy.variant.standard.rule

import diplomacy.board.Power
import diplomacy.rule.{ Rule => BaseRule, InvalidOrderMessage }
import diplomacy.variant.standard.rule

final class Rule[Turn_ <: Turn, Power_ <: Power](nextTurn: Turn_ => Turn_)
  extends BaseRule[rule.State[Turn_], Power_, MilitaryBranch, UnitStatus, ProvinceStatus, Order.Order[Power_], Result]
    with BaseRule.TypeHelper {
  final type Turn = Turn_
  private[this] case class PhaseRule(
    resolver: (Turn => Turn, Board, Set[Order]) => Either[InvalidOrderMessage, ResolvedResult],
    generator: OrderGenerator[Turn, Power],
    validator: Validator[Turn, Power]
  )

  private[this] val rules = {
    val movementResolver = new MovementResolver {
      type Turn = Turn_
      type Power = Power_
    }
    val retreatResolver = new RetreatResolver {
      type Turn = Turn_
      type Power = Power_
    }
    val buildResolver = new BuildResolver {
      type Turn = Turn_
      type Power = Power_
    }

    Map(
      Movement -> PhaseRule(
        (x, y, z) => movementResolver(y, z collect { case o: Order.MovementOrder[Power] => o }),
        new MovementOrderGenerator[Turn, Power],
        new MovementValidator[Turn, Power]
      ),
      Retreat -> PhaseRule(
        (x, y, z) => retreatResolver(x)(y, z),
        new RetreatOrderGenerator[Turn, Power],
        new RetreatValidator[Turn, Power]
      ),
      Build -> PhaseRule(
        (x, y, z) => buildResolver(x)(y, z),
        new BuildOrderGenerator[Turn, Power],
        new BuildValidator[Turn, Power]
      )
    )
  }

  protected[this] def resolveProcedure(
    board: Board, orders: Set[Order]
  ): Either[InvalidOrderMessage, ResolvedResult] = {
    val PhaseRule(resolver, generator, validator) =
      this.rules(board.state.phase)

    for {
      result <- resolver(nextTurn, board, orders).right
      result2 <-
        (this.rules(result.board.state.phase).generator.ordersToSkipPhase(result.board) map {
          orders => this.resolve(result.board, orders)
        } getOrElse (Right(result))).right
    } yield {
      new ResolvedResult(result2.board, result.result ++ result2.result)
    }
  }

  protected[this] def unitsRequiringOrder(board: Board): Set[DiplomacyUnit] = {
    this.rules(board.state.phase).validator.unitsRequiringOrder(board)
  }

  protected[this] def errorMessageOfOrder(board: Board)(
    order: Order
  ): Option[InvalidOrderMessage] = {
    this.rules(board.state.phase).validator.errorMessageOfOrder(board)(order)
  }
  protected[this] def errorMessageOfOrders(board: Board)(
    orders: Set[Order]
  ): Option[InvalidOrderMessage] = {
    this.rules(board.state.phase).validator.errorMessageOfOrders(board)(orders)
  }

  protected[this] def defaultOrderOf(board: Board)(unit: DiplomacyUnit): Order = {
    this.rules(board.state.phase).generator.defaultOrder(board)(unit)
  }
}

object Rule {
  trait TypeHelper extends BaseRule.TypeHelper {
    type Turn <: diplomacy.variant.standard.rule.Turn

    type State = diplomacy.variant.standard.rule.State[Turn]
    type MilitaryBranch = diplomacy.variant.standard.rule.MilitaryBranch
    type UnitStatus = diplomacy.variant.standard.rule.UnitStatus
    type ProvinceStatus = diplomacy.variant.standard.rule.ProvinceStatus
    type Order = Order.Order[Power]
    type Result = diplomacy.variant.standard.rule.Result
  }
}
