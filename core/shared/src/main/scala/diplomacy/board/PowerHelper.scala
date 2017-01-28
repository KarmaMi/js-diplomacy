package diplomacy.board

import scala.language.dynamics

trait PowerHelper[Power_ <: Power] extends Dynamic {
  def selectDynamic(name: String): Power_ = this.name2Power(name)

  protected[this] val powers: Set[Power_]
  private[this] lazy val name2Power = (powers map { p => p.toString -> p }).toMap
}

object PowerHelper {
  def apply[Power_ <: Power](powerSet: Set[Power_]): PowerHelper[Power_] = new PowerHelper[Power_] {
    protected[this] lazy val powers = powerSet
  }
}
