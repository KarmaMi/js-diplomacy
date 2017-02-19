import { Result } from "./result"
import { Order, Hold, Move, Support, Convoy } from "./order"

export class MovementOrderWithResult<Power> {
  private result: Result | null
  constructor (public order: Order<Power>) {
    this.result = null
  }
  getResult (): Result | null {
    return this.result
  }
  setResult (result: Result) {
    if (this.order instanceof Hold) {
      if (result === Result.Dislodged || result === Result.Success) {
        this.result = result
      }
    } else if (this.order instanceof Move) {
      if (result === Result.Dislodged || result === Result.Success) {
        if (this.result !== Result.Success) {
          this.result = result
        }
      } else if (result === Result.Failed || result === Result.Bounced) {
        if (this.result !== Result.Dislodged) {
          this.result = result
        }
      }
    } else if (this.order instanceof Support) {
      if (result === Result.Dislodged) {
        this.result = result
      } else if (result === Result.Failed || result === Result.Success) {
        if (
          (this.result !== Result.Dislodged) &&
          (this.result !== Result.Cut) &&
          (this.result !== Result.NoCorrespondingOrder)
        ) {
          this.result = result
        }
      } else if (result === Result.Cut) {
        if (this.result !== Result.Dislodged) {
          this.result = result
        }
      } else if (result === Result.NoCorrespondingOrder) {
        this.result = result
      }
    } else if (this.order instanceof Convoy) {
      if (result === Result.Dislodged) {
        this.result = result
      } else if (result === Result.Failed || result === Result.Success) {
        if (
          this.result !== Result.Dislodged && this.result !== Result.NoCorrespondingOrder
        ) {
          this.result = result
        }
      } else if (result === Result.NoCorrespondingOrder) {
        this.result = result
      }
    } else {
      throw { err: `Invalid order: ${this.order}` }
    }
  }
}
