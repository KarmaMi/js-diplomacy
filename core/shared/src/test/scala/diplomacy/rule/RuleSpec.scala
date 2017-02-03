package diplomacy.rule

import diplomacy.UnitSpec
import diplomacy.board.{ Board => BaseBoard, BoardHelper }
import diplomacy.mock.board._
import diplomacy.mock.rule._

class RuleSpec extends UnitSpec {
  "A rule" when {
    "one unit has several orders" should {
      "not resolve the orders." in {
        val board = new Board(
          map, "State", Set(new DiplomacyUnit(france, army, mar)),
          Map(), Map()
        )
        val $ = BoardHelper(board)

        val rule = new MockRule() {}
        rule.resolve(board, Set(Move($.A($.Mar), $.Spa), Hold($.A($.Mar)))) should be(
          Left(InvalidOrderMessage("A Mar: several orders."))
        )
      }
    }
    "resolving an invalid order" should {
      "uses a default order." in {
        val board = new Board(
          map, "State",
          Set(new DiplomacyUnit(france, army, mar), new DiplomacyUnit(france, fleet, wes)),
          Map(), Map()
        )
        val $ = BoardHelper(board)

        val rule = new MockRule() {
          override def errorMessageOfOrder(board: Board)(order: Order) = order match {
            case _: Hold => None
            case _ => Option(InvalidOrderMessage(""))
          }
          override def defaultOrderOf(board: Board)(unit: DiplomacyUnit) = Hold(unit)
          override def resolveProcedure(board: Board, orders: Set[Order]) = {
            Right(new ResolvedResult(
              board,
              orders map { order =>
                OrderResult.Executed[Power, MilitaryBranch, Order, String](order, "resolved")
              },
              false
            ))
          }
        }

        val Right(result) = rule.resolve(board, Set(Move($.A($.Mar), $.Spa), Hold($.F($.Wes))))
        result.result should be (Set(
          OrderResult.Executed[Power, MilitaryBranch, rule.Order, String](
            Hold($.F($.Wes)), "resolved"
          ),
          OrderResult.Replaced[Power, MilitaryBranch, rule.Order, String](
            Move($.A($.Mar), $.Spa), InvalidOrderMessage(""), Hold($.A($.Mar)), "resolved"
          )
        ))
      }
    }
    "the set or orders are invalid" should {
      "not resolve the orders." in {
        val board = new Board(
          map, "State",
          Set(new DiplomacyUnit(france, army, mar), new DiplomacyUnit(france, fleet, wes)),
          Map(), Map()
        )

        val rule = new MockRule() {
          override def errorMessageOfOrders(board: Board)(orders: Set[Order]) = {
            Option(InvalidOrderMessage(""))
          }
        }
        rule.resolve(board, Set()) should be(Left(InvalidOrderMessage("")))
      }
    }
    "several unit that requre an order do not have orders" should {
      "uses a default order." in {
        val board = new Board(
          map, "State",
          Set(new DiplomacyUnit(france, army, mar), new DiplomacyUnit(france, fleet, wes)),
          Map(), Map()
        )
        val $ = BoardHelper(board)

        val rule = new MockRule() {
          override def defaultOrderOf(board: Board)(unit: DiplomacyUnit) = Hold(unit)
          override def resolveProcedure(board: Board, orders: Set[Order]) = {
            Right(new ResolvedResult(
              board,
              orders map { order =>
                OrderResult.Executed[Power, MilitaryBranch, Order, String](order, "resolved")
              },
              false
            ))
          }
          override def unitsRequiringOrder(board: Board) = Set($.A($.Mar))
        }

        val Right(result) = rule.resolve(board, Set())
        result.result should be (Set(
          OrderResult.Executed[Power, MilitaryBranch, rule.Order, String](
            Hold($.A($.Mar)), "resolved"
          )
        ))
      }
    }
  }
}
