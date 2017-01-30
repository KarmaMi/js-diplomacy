package diplomacy.variant.standard.rule

object Implicits {
  /* State */
  implicit class Turn2State[Turn_ <: Turn](turn: Turn_) {
    def -(phase: Phase): State[Turn_] = State(turn, phase)
  }
}
