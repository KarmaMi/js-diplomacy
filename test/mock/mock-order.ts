import { Order } from "../../src/rule/order"
import { Name, Unit } from "../../src/board/module"

export class MockOrder implements Order<string, Name> {
  constructor (public unit: Unit<string, Name>) {}
}
