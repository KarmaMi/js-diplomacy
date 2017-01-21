package diplomacy.variant.standard.rule

import diplomacy.board.{ Power, Location, DiplomacyUnit }
import diplomacy.rule.{ Order => BaseOrder }

sealed trait Order[Power_ <: Power] extends BaseOrder[Power_, MilitaryBranch]
sealed trait MovementOrder[Power_ <: Power] extends Order[Power_]

object Order {
  final case class Hold[Power_ <: Power](
    unit: DiplomacyUnit[Power_, MilitaryBranch]
  ) extends MovementOrder[Power_] {
    override def toString: String = s"${this.unit} H"
  }

  final case class Move[Power_ <: Power](
    unit: DiplomacyUnit[Power_, MilitaryBranch],
    destination: Location[Power_, MilitaryBranch],
    useConvoy: Boolean
  ) extends MovementOrder[Power_] {
    override def toString: String = useConvoy match {
      case true => s"${unit}-${destination} via Convoy"
      case false => s"${unit}-${destination}"
    }
  }

  final case class Support[Power_ <: Power](
    unit: DiplomacyUnit[Power_, MilitaryBranch],
    target: Either[Hold[Power_], Move[Power_]]
  ) extends MovementOrder[Power_] with Location.TypeHelper {
    type Power = Power_
    type MilitaryBranch = diplomacy.variant.standard.rule.MilitaryBranch

    val targetOrder: MovementOrder[Power] = target match {
      case Right(m) => m
      case Left(h) => h
    }
    val destinationLocation: Location = target match {
      case Right(m) => m.destination
      case Left(h) => h.unit.location
    }

    override def toString: String = target match {
      case Right(m) => s"${unit} S ${m}"
      case Left(h) => s"${unit} S ${h}"
    }
  }

  final case class Convoy[Power_ <: Power](
    unit: DiplomacyUnit[Power_, MilitaryBranch],
    target: Move[Power_]
  ) extends MovementOrder[Power_] {
    override def toString: String = s"${unit} C ${target}"
  }

  sealed trait NotMovementOrder[Power_ <: Power] extends Order[Power_]

  final case class Retreat[Power_ <: Power](
    unit: DiplomacyUnit[Power_, MilitaryBranch],
    destination: Location[Power_, MilitaryBranch]
  ) extends NotMovementOrder[Power_] {
    override def toString: String = s"${unit} R ${this.destination}"
  }

  final case class Disband[Power_ <: Power](
    unit: DiplomacyUnit[Power_, MilitaryBranch]
  ) extends NotMovementOrder[Power_] {
    override def toString: String = s"Disband: ${unit}"
  }

  final case class Build[Power_ <: Power](
    unit: DiplomacyUnit[Power_, MilitaryBranch]
  ) extends NotMovementOrder[Power_] {
    //require(Option(unit.power) == unit.location.province.homeOf)

    override def toString: String = s"Build: ${unit}"
  }
}
