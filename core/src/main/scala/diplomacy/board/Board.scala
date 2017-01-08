package diplomacy.board

import scala.language.dynamics

final case class Board[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_](
  map: DiplomacyMap[Power_, MilitaryBranch_],
  state: State_, units: Set[DiplomacyUnit[Power_, MilitaryBranch_]],
  occupation: Map[Power_, Set[Province[Power_]]],
  unitStatuses: Map[DiplomacyUnit[Power_, MilitaryBranch_], UnitStatus_],
  provinceStatuses: Map[Province[Power_], ProvinceStatus_]
) {
  val numberOfSupplyCenters: Map[Power_, Int] = this.occupation map {
    case (power, provinces) => power -> provinces.count(province => province.isSupplyCenter)
  }

  override def toString: String = this.state.toString
}

object Board {
  trait TypeHelper extends DiplomacyMap.TypeHelper {
    type State
    type UnitStatus
    type ProvinceStatus
    type Board = diplomacy.board.Board[State, Power, MilitaryBranch, UnitStatus, ProvinceStatus]
  }

  class Helper[P <: Power, MB <: MilitaryBranch](board: Board[_, P, MB, _, _]) extends Dynamic {
    def selectDynamic(key: String): MB = this.militaryBranches(key)
    def applyDynamic(key: String)(location: String): DiplomacyUnit[P, MB] = {
      val mb = this.selectDynamic(key)
      val unitFromLocation = this.locations.get(location) flatMap { location =>
        board.units find { unit => unit.militaryBranch == mb && unit.location == location }
      }

      unitFromLocation match {
        case Some(unit) => unit
        case _ =>
          val province = this.provinces(location)
          (board.units find {
            unit => unit.militaryBranch == mb && unit.location.province == province
          }).get
      }
    }

    private[this] val provinces: Map[String, Province[P]] = (board.map.provinces map { x =>
      x.name.toString -> x
    }).toMap
    private[this] val locations: Map[String, Location[P, MB]] = (board.map.locations map { x =>
      x.toString -> x
    }).toMap
    private[this] val militaryBranches: Map[String, MB] = (board.map.militaryBranches map { x =>
      x.toString -> x
    }).toMap
  }
}
