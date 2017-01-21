package diplomacy.rule

import diplomacy.board.{ Power, MilitaryBranch }

sealed trait OrderResult[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, Order_ <: Order[Power_, MilitaryBranch_], Result_] {
  val target: Order_
  val result: Result_
}

object OrderResult {
  final case class Executed[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, Order_ <: Order[Power_, MilitaryBranch_], Result_](
    target: Order_, result: Result_
  ) extends OrderResult[Power_, MilitaryBranch_, Order_, Result_]

  final case class Replaced[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, Order_ <: Order[Power_, MilitaryBranch_], Result_](
    target: Order_, invalidReason: InvalidOrderMessage, replacedBy: Order_, result: Result_
  ) extends OrderResult[Power_, MilitaryBranch_, Order_, Result_]
}
