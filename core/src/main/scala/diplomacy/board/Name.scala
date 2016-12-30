package diplomacy.board

case class Name(name: String, abbreviatedName: String) {
  def this(name: String) = this(name, name)

  override def toString: String = this.abbreviatedName
}

object Name {
  def apply(name: String): Name = Name(name, name)
}
