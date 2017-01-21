package diplomacy.variant.standard.rule.mutable

import diplomacy.board.Power
import diplomacy.variant.standard.rule.{ MovementOrderWithResult => BaseMovementOrderWithResult }
import diplomacy.variant.standard.rule._

class MovementOrderWithResult[Power_ <: Power](val order: MovementOrder[Power_])
    extends BaseMovementOrderWithResult[Power_] {
  def result: Option[Result] = this.innerResult
  def result_=(result: Result): Unit = {
    order match {
      case Order.Hold(_) =>
        result match {
          case Result.Dislodged(_) | Result.Success => this.innerResult = Option(result)
          case _ =>
        }
      case Order.Move(_, _, _) =>
        result match {
          case Result.Dislodged(_) | Result.Success =>
            this.innerResult match {
              case Some(Result.Success) =>
              case _ => this.innerResult = Option(result)
            }
          case Result.Failed | Result.Bounced =>
            this.innerResult match {
              case Some(Result.Dislodged(_)) =>
              case _ => this.innerResult = Option(result)
            }
          case _ =>
        }
      case Order.Support(_, _) =>
        result match {
          case Result.Dislodged(_) => this.innerResult = Option(result)
          case Result.Failed | Result.Success =>
            this.innerResult match {
              case Some(Result.Dislodged(_)) | Some(Result.Cut) | Some(Result.NoCorrespondingOrder) =>
              case _ => this.innerResult = Option(result)
            }
          case Result.Cut =>
            this.innerResult match {
              case Some(Result.Dislodged(_)) =>
              case _ => this.innerResult = Option(result)
            }
          case Result.NoCorrespondingOrder => this.innerResult = Option(result)
          case _ =>
        }
      case Order.Convoy(_, _) =>
        result match {
          case Result.Dislodged(_) => this.innerResult = Option(result)
          case Result.Failed | Result.Success =>
            this.innerResult match {
              case Some(Result.Dislodged(_)) | Some(Result.NoCorrespondingOrder) =>
              case _ => this.innerResult = Option(result)
            }
          case Result.NoCorrespondingOrder => this.innerResult = Option(result)
          case _ =>
        }
    }
  }

  def toImmutable: immutable.MovementOrderWithResult[Power_] = {
    immutable.MovementOrderWithResult(this.order, this.innerResult)
  }

  private[this] var innerResult: Option[Result] = None
}
