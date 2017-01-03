package diplomacy.board

import scala.language.dynamics

final case class Board[State, P <: Power, MB <: MilitaryBranch, UnitStatus, ProvinceStatus](
  map: DiplomacyMap[P, MB],
  state: State, units: Set[DiplomacyUnit[P, MB]], occupation: Map[P, Set[Province[P]]],
  unitStatuses: Map[DiplomacyUnit[P, MB], UnitStatus],
  provinceStatuses: Map[Province[P], ProvinceStatus]
) {
  val numberOfSupplyCenters: Map[P, Int] = this.occupation map {
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
