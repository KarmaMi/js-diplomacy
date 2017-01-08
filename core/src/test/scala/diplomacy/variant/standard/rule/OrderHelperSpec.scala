package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.variant.standard.map._

class OrderHelperSpec extends UnitSpec {
  val board = {
    val $ = DiplomacyMapHelper(map)
    Board[State[Turn], Power.Power, MilitaryBranch.MilitaryBranch, String, String](
      map,
      State(Turn(1901, Season.Spring), Phase.Movement),
      Set(
        DiplomacyUnit(Power.France, MilitaryBranch.Army, $.Spa),
        DiplomacyUnit(Power.France, MilitaryBranch.Fleet, $.GoL)
      ), Map(), Map(), Map()
    )
  }
  val $ = BoardHelper(board)
  val $$ = new OrderHelper[Power.Power]() {}
  import $$._

  "An OrderHelper" can {
    "generate Hold order." in {
      $.A($.Spa).hold() should be(Order.Hold($.A($.Spa)))
    }
    "generate Move order (1)." in {
      $.A($.Spa).move($.Mar) should be(Order.Move($.A($.Spa), $.Mar, false))
    }
    "generate Move order (2)." in {
      $.A($.Spa).move($.Mar).viaConvoy should be(Order.Move($.A($.Spa), $.Mar, true))
    }
    "generate Support order." in {
      $.A($.Spa).support($.F($.GoL).move($.Mar)) should be(
        Order.Support($.A($.Spa), Right(Order.Move($.F($.GoL), $.Mar, false)))
      )
    }
    "generate Convoy order." in {
      $.F($.GoL).convoy($.A($.Spa).move($.Mar)) should be(
        Order.Convoy($.F($.GoL), Order.Move($.A($.Spa), $.Mar, false))
      )
    }
    "generate Retreat order." in {
      $.F($.GoL).retreat($.Mar) should be(Order.Retreat($.F($.GoL), $.Mar))
    }
    "generate Disband order." in {
      $.F($.GoL).disband() should be(Order.Disband($.F($.GoL)))
    }
    "generate Build order." in {
      $.Mar.build($.m.A) should be(Order.Build(DiplomacyUnit($.p.France, $.m.A, $.Mar)))
    }
  }
}
