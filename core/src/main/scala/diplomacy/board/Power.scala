package diplomacy.board

trait Power {
  val name: String
  override def toString: String = this.name
}
