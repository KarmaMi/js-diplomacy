package diplomacy.board

final case class Province[P <: Power](name: Name, homeOf: Option[P], isSupplyCenter: Boolean) {
  override def toString: String = this.isSupplyCenter match {
    case true => s"${this.name}*"
    case false => this.name.toString
  }
}

object Province {
  trait TypeHelper {
    type Power <: diplomacy.board.Power
    type Province = diplomacy.board.Province[Power]
  }
}
