package diplomacy.board

final case class Province[Power_ <: Power](
  name: Name, homeOf: Option[Power_], isSupplyCenter: Boolean
) {
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
