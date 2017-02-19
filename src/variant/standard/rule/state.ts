import { Turn } from "./turn"
import { Phase } from "./phase"

export class State {
  constructor (public turn: Turn, public phase: Phase) {}
}
