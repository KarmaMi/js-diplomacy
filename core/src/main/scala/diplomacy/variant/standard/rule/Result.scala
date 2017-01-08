package diplomacy.variant.standard.rule

object Result {
  sealed class Result(name: String)
  object Success extends Result("Success")
  object Failed extends Result("Failed")
  object Dislodged extends Result("Dislodged")
  object Bounced extends Result("Bounced")
  object Cut extends Result("Cut")
  object Standoff extends Result("Standoff")
  object NoCorrespondingOrder extends Result("NoCorrespoindgOrder")
}
