package diplomacy.board

import scala.language.dynamics

trait MilitaryBranchHelper[MilitaryBranch_ <: MilitaryBranch] extends Dynamic {
  def selectDynamic(name: String): MilitaryBranch_ = this.name2MilitaryBranch(name)

  protected[this] val militaryBranches: Set[MilitaryBranch_]
  private[this] lazy val name2MilitaryBranch =
    (militaryBranches map { m => m.toString -> m }).toMap
}

object MilitaryBranchHelper {
  def apply[MilitaryBranch_ <: MilitaryBranch](
    militaryBranchSet: Set[MilitaryBranch_]
  ): MilitaryBranchHelper[MilitaryBranch_] = new MilitaryBranchHelper[MilitaryBranch_] {
    protected[this] lazy val militaryBranches = militaryBranchSet
  }
}
