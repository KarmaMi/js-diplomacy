package diplomacy.variant.standard.rule

import diplomacy.board._

object StandardRuleUtils {
  def numberOfSupplyCenters[Power_ <: Power](board: Board[_, Power_]): Map[Power, Int] = {
    Map()
    board.provinceStatuses groupBy { _._2.occupied } collect {
      case (Some(power), elem) =>
        val provinces = elem map { _._1 }
        power -> (provinces.count { province => province.isSupplyCenter })
    }
  }
  def locationsToRetreat[Power_ <: Power](board: Board[_, Power_])(
    unit: DiplomacyUnit[Power_],
    attackedFrom: Province[Power_]
  ): Set[Location[Power_]] = {
    board.map.movableLocationsOf(unit) filter {
      case Location(_, province, _) =>
        val existsUnit = board.units exists { unit =>
          unit.location.province == province
        }
        board.provinceStatuses.get(province) match {
          case Some(ProvinceStatus(_, true)) => false
          case _ if (province == attackedFrom) || existsUnit => false
          case _ => true
        }
    }
  }
}
