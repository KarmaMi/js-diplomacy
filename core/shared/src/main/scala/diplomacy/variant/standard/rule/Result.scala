package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExportDescendentObjects, JSExportAll }

import diplomacy.board.{ Power, Province }

@JSExportDescendentObjects @JSExportAll
sealed abstract class Result(name: String) {
  override def toString: String = name
}

object Result {
  object Success extends Result("Success")
  object Failed extends Result("Failed")
  object Dislodged extends Result("Dislodged")
  object Bounced extends Result("Bounced")
  object Cut extends Result("Cut")
  object Standoff extends Result("Standoff")
  object NoCorrespondingOrder extends Result("NoCorrespoindgOrder")
}
