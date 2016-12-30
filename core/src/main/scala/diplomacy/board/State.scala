package diplomacy.board

trait State[Phase] {
  val phase: Phase
  override def toString: String
}
