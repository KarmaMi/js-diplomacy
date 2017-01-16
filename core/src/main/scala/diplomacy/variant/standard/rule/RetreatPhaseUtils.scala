package diplomacy.variant.standard.rule

import diplomacy.board._

object RetreatPhaseUtils {
  def locationsToRetreat[Power_ <: Power](
    board: Board[_, Power_, MilitaryBranch.MilitaryBranch, _, _]
  )(
    unit: DiplomacyUnit[Power_, MilitaryBranch.MilitaryBranch],
    attackedFrom: Province[Power_]
  ): Set[Location[Power_, MilitaryBranch.MilitaryBranch]] = {
    board.map.movableLocationsOf(unit) filter {
      case Location(_, province, _) =>
        val existsUnit = board.units exists { unit =>
          unit.location.province == province
        }
        if (board.provinceStatuses.get(province) == Some(ProvinceStatus.Standoff)) {
          false
        } else if (province == attackedFrom) {
          false
        } else if (existsUnit) {
          false
        } else {
          true
        }
    }
  }
}
