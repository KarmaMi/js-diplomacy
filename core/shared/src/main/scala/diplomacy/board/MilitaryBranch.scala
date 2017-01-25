package diplomacy.board

trait MilitaryBranch {
  val name: Name
  override def toString: String = this.name.toString
}
