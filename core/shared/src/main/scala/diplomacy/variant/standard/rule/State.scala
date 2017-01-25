package diplomacy.variant.standard.rule

final case class State [Turn_ <: Turn](turn: Turn_, phase: Phase.Phase)
