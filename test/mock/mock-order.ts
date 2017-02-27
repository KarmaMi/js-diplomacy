import { rule } from "../../src/rule"
import { board } from "../../src/board"

export class MockOrder implements rule.Order<string, board.Name> {
  constructor (public unit: board.Unit<string, board.Name>) {}
}
