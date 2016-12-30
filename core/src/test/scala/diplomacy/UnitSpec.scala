package diplomacy

import org.scalatest._

/**
 * The base class of test cases
 */
abstract class UnitSpec extends WordSpec with Matchers with OptionValues
  with Inside with Inspectors
