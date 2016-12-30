package diplomacy.board

case class Province[P <: Power](name: Name, homeOf: Option[P], isSupplyCenter: Boolean) {
  override def toString: String = this.isSupplyCenter match {
    case true => s"${this.name}*"
    case false => this.name.toString
  }
}
