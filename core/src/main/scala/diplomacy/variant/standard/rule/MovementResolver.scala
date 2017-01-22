package diplomacy.variant.standard.rule

import scala.collection.{ mutable => cmutable }

import diplomacy.rule.{ ResolvedResult, OrderResult, InvalidOrderMessage }

class MovementResolver extends Rule.TypeHelper {
  def apply(
    board: Board, orders: Set[MovementOrder[Power]]
  ): Either[InvalidOrderMessage, ResolvedResult] = {
    val ordersWithResult = orders map { order => new mutable.MovementOrderWithResult[Power](order) }
    val movesViaConvoy = cmutable.Set[Order.Move[Power]]()
    val dislodgedFrom = cmutable.Map[DiplomacyUnit, Province]()

    def canBounce(
      order1: mutable.MovementOrderWithResult[Power],
      order2: mutable.MovementOrderWithResult[Power]
    ): Boolean = {
      (order1.order, order2.order) match {
        case (m1@ Order.Move(_, _, _), m2@ Order.Move(_, _, _)) =>
          if (m1.destination.province == m2.destination.province) {
            true
          } else if (
            (m1.destination.province == m2.unit.location.province) &&
            (m2.destination.province == m1.unit.location.province)
          ) {
            if ((movesViaConvoy contains m1) || (movesViaConvoy contains m2)) {
              order1.result == Some(Result.Bounced) || order2.result == Some(Result.Bounced)
            } else {
              true
            }
          } else if (m1.destination.province == m2.unit.location.province) {
            order2.result == Some(Result.Bounced)
          } else if (m2.destination.province == m1.unit.location.province) {
            order1.result == Some(Result.Bounced)
          } else {
            false
          }
        case (m1@ Order.Move(_, _, _), _) =>
          m1.destination.province == order2.order.unit.location.province
        case (_, m2@ Order.Move(_, _, _)) =>
          m2.destination.province == order1.order.unit.location.province
        case (_, _) =>
          false
      }
    }

    // 1. Divide orders into groups
    final class TmpMovementOrderGroup {
      type MovementOrderWithResult =
        diplomacy.variant.standard.rule.mutable.MovementOrderWithResult[Power]

      var target: Option[MovementOrderWithResult] = None
      val relatedOrders = cmutable.Set[MovementOrderWithResult]()
    }

    val province2TmpOrderGroups =
      cmutable.Map[Province, cmutable.Map[Location, TmpMovementOrderGroup]]()
    ordersWithResult foreach { order =>
      order.order match {
        case Order.Hold(unit) =>
          val groups =
            province2TmpOrderGroups.getOrElseUpdate(unit.location.province, cmutable.Map())
          val group =
            groups.getOrElseUpdate(unit.location, new TmpMovementOrderGroup())
          group.target = Option(order)
        case Order.Move(unit, destination, _) =>
          val groups1 =
            province2TmpOrderGroups.getOrElseUpdate(destination.province, cmutable.Map())
          val group1 =
            groups1.getOrElseUpdate(unit.location, new TmpMovementOrderGroup())
          group1.target = Option(order)

          val groups2 =
            province2TmpOrderGroups.getOrElseUpdate(unit.location.province, cmutable.Map())
          val group2 =
            groups2.getOrElseUpdate(unit.location, new TmpMovementOrderGroup())
          group2.target = Option(order)
        case s@ Order.Support(unit, target) =>
          val groups1 = province2TmpOrderGroups.getOrElseUpdate(
            s.destinationLocation.province, cmutable.Map()
          )
          val group1 = groups1.getOrElseUpdate(
            s.targetOrder.unit.location, new TmpMovementOrderGroup()
          )
          group1.relatedOrders += order

          val groups2 =
            province2TmpOrderGroups.getOrElseUpdate(unit.location.province, cmutable.Map())
          val group2 =
            groups2.getOrElseUpdate(unit.location, new TmpMovementOrderGroup())
          group2.target = Option(order)
        case Order.Convoy(unit, target) =>
          val groups1 = province2TmpOrderGroups.getOrElseUpdate(
            target.destination.province, cmutable.Map()
          )
          val group1 = groups1.getOrElseUpdate(
            target.unit.location, new TmpMovementOrderGroup()
          )
          group1.relatedOrders += order

          val groups2 =
            province2TmpOrderGroups.getOrElseUpdate(unit.location.province, cmutable.Map())
          val group2 =
            groups2.getOrElseUpdate(unit.location, new TmpMovementOrderGroup())
          group2.target = Option(order)
        case _ =>
      }
    }

    // 2. Exclude support or convoy orders that have no corresponding orders
    for {
      (province, groups) <- province2TmpOrderGroups
      (location, group) <- groups if group.target.isEmpty
    } {
      group.relatedOrders.foreach { order => order.result = Result.NoCorrespondingOrder }
      groups -= location
    }
    val province2OrderGroups = (province2TmpOrderGroups map {
      case (province, tmpGroups) =>
        val groups = tmpGroups flatMap {
          case (location, tmpGroup) =>
            tmpGroup.target map { targetOrder =>
              location -> new mutable.MovementOrderGroup(targetOrder, tmpGroup.relatedOrders.toSet)
            }
        }
        province -> groups
    }).toMap

    // 3. Generate the dependency graph
    var graph = new OrderDependency[Power](ordersWithResult map { _.toImmutable }).graph

    // 4. Resolve orders following dependency
    while (graph.vertices.size != 0) {
      val target =
        graph.vertices.find {
          node => graph.edges.forall { case (_, p1) => node != p1 }
        }

      // TODO
      target foreach { provinces =>
        graph = graph.remove(provinces)

        // Get all related order groups
        val relatedGroups = cmutable.Map() ++ (provinces map { province =>
          val groups =
            province2OrderGroups.getOrElse(province, cmutable.Map()) map { _._2 }

          province -> (cmutable.Set() ++ groups)
        })

        // Resolve each province
        while (relatedGroups.size != 0) {
          // 1. Resolve cutting support
          for {
            (_, groups) <- relatedGroups
            group <- groups
          } {
            group.target.order match {
              case s@ Order.Support(unit, target) =>
                val destination = s.destinationLocation
                val isCut = groups exists { group =>
                  group.target.order match {
                    case m@ Order.Move(unit, dest, _) =>
                      (unit.location.province != destination.province) &&
                      (group.route(board.map).isDefined) &&
                      (s.unit.power != m.unit.power)
                    case _ => false
                  }
                }

                if (isCut) {
                  group.target.result = Result.Cut
                }
              case _ =>
            }
          }

          // 2. Sort provinces by related units
          val sortedGroups =
            relatedGroups.toSeq sortWith {
              case ((_, g1), (_, g2)) =>
                val hasG1Convoy = g1 exists { _.target.order match {
                  case Order.Convoy(_, _) => true
                  case _ => false
                }}
                val hasG2Convoy = g2 exists { _.target.order match {
                  case Order.Convoy(_, _) => true
                  case _ => false
                }}

                if (hasG1Convoy) {
                  true
                } else if (hasG2Convoy) {
                  false
                } else {
                  val pow1 = (g1 map { group => group.power }).sum
                  val pow2 = (g2 map { group => group.power }).sum
                  pow1 > pow2
                }
              }

            // 3. Check whether move orders can be conducted or not
            val failedMoves = cmutable.Set[mutable.MovementOrderGroup[Power]]()
            for {
              (province, groups) <- sortedGroups
              group <- groups
            } {
              group.target.order match {
                case m@ Order.Move(_, destination, _) if province == destination.province =>
                  group.route(board.map) match {
                    case Some(route) =>
                      if (route.useConvoy) {
                        movesViaConvoy += m
                      }
                    case None =>
                      failedMoves += group
                  }
                case _ =>
              }
            }

          // 4. Resolve the province, and delete it from the buffer
          sortedGroups.headOption foreach {
            case (province, groups) =>
              relatedGroups -= province

              // 5. Resolve and exclude failed move orders
              groups foreach { group =>
                if (failedMoves contains group) {
                  group.target.result = Result.Failed
                  group.relatedOrders foreach { o => o.result = Result.Failed }
                  groups -= group
                }
              }

              val defenceOpt = groups find { group =>
                group.target.order.unit.location.province == province
              }
              val offence = groups -- defenceOpt

              // 5. Resolve and exclude dislodged moves if #provinces <= 2
              if (provinces.size <= 2) {
                defenceOpt foreach { defence =>
                  offence foreach { group =>
                    group.target.order match {
                      case m @Order.Move(unit, location, _) =>
                        val isDislodged = group.target.result map {
                          case Result.Dislodged(_) => true
                          case _ => false
                        } getOrElse false
                        if (isDislodged && canBounce(group.target, defence.target)) {
                          groups -= group
                          offence -= group
                          group.relatedOrders foreach { o => o.result = Result.Failed }
                        }
                      case _ =>
                    }
                  }
                }
              }

              if (groups.nonEmpty) {
                // 6. Find orders that have the highest power
                val maxPower = (groups maxBy { _.power }).power
                val maxOrders = groups withFilter { _.power >= maxPower } map { _.target }

                // 7. Resolve the defence order
                defenceOpt foreach { defence =>
                  if (maxOrders contains defence.target) {
                    defence.target.order match {
                      case Order.Move(_, _, _) =>
                      case Order.Hold(_) =>
                        defence.target.result = Result.Success
                        defence.relatedOrders foreach { _.result = Result.Success }
                      case Order.Convoy(_, _) =>
                        defence.target.result match {
                          case Some(Result.NoCorrespondingOrder) =>
                          case _ =>
                            defence.target.result = Result.Failed // This convoy order is available.
                        }
                        defence.relatedOrders foreach { _.result = Result.Success }
                      case _ =>
                        defence.relatedOrders foreach { _.result = Result.Success }
                    }
                  } else {
                    var isDislodged = false
                    val offenceGroup =
                      offence find { group => maxOrders contains group.target }
                    if (maxOrders.size == 1) {
                      // Check self dislodgement
                      offenceGroup foreach { group =>
                        var offensivePower = 0
                        if (group.target.order.unit.power != defence.target.order.unit.power) {
                          offensivePower += 1
                        }

                        val validSupports = group.validSupports filter {
                          _.unit.power != defence.target.order.unit.power
                        }
                        offensivePower += validSupports.size

                        isDislodged = defence.power < offensivePower
                      }
                    }

                    if (isDislodged) {
                      offenceGroup foreach { group =>
                        defence.target.result =
                          Result.Dislodged(group.target.order.unit.location.province)
                        dislodgedFrom(defence.target.order.unit) =
                          group.target.order.unit.location.province
                        defence.relatedOrders foreach { o => o.result = Result.Failed }
                      }
                    } else {
                      defence.target.order match {
                        case h@ Order.Hold(_) =>
                          defence.target.result = Result.Success
                          defence.relatedOrders foreach { o => o.result = Result.Success }
                        case _ =>
                      }
                    }
                  }
                }

                // 8. Resolve the offence orders
                offence foreach { group =>
                  var isBounced = true
                  if (maxOrders contains group.target) {
                    if (maxOrders.size == 1) {
                      defenceOpt match {
                        case Some(defence) =>
                          isBounced =
                            defence.target.result map {
                              case Result.Dislodged(_) => false
                              case _ => true
                            } getOrElse true
                        case None => isBounced = false
                      }
                    } else if (maxOrders.size == 2){
                      val order2 = (maxOrders find { _ != group.target }).get
                      isBounced = canBounce(group.target, order2)
                    }
                  }

                  if (isBounced) {
                    group.target.result = Result.Bounced
                    group.relatedOrders foreach { o => o.result = Result.Failed }
                  } else {
                    group.target.result = Result.Success
                    group.relatedOrders foreach { o => o.result = Result.Success }
                  }
                }
              }
          }
        }
      }
    }

    // Generate a new board
    val unit2Result = (ordersWithResult map { order =>
      order.order.unit -> (order.order, order.result)
    }).toMap

    val newUnits: Set[DiplomacyUnit] =
      board.units map { unit =>
        unit2Result.get(unit) match {
          case Some((order, result)) =>
            order match {
              case m@ Order.Move(_, _, _) if result == Option(Result.Success) =>
                unit.copy(location = m.destination)
              case _ => unit
            }
          case None => unit
        }
      }

    val newUnitStatuses: Map[DiplomacyUnit, UnitStatus] =
      (ordersWithResult flatMap { order =>
        order.result match {
          case Some(Result.Dislodged(_)) =>
            dislodgedFrom.get(order.order.unit) map { province =>
              order.order.unit -> UnitStatus.Dislodged(province)
            }
          case _ => None
        }
      }).toMap

    val provincesContainingUnit = newUnits map { _.location.province }
    val newProvinceStatuses: Map[Province, ProvinceStatus] =
      province2OrderGroups flatMap {
        case (province, groups) =>
          val wasBounced =
            groups exists { case (_, g) => g.target.result == Option(Result.Bounced) }
          if (
            !(provincesContainingUnit contains province) &&
            wasBounced
          ) {
            Option(province -> ProvinceStatus.Standoff)
          } else {
            None
          }
      }

    val newState = board.state.copy(phase = Retreat)

    val newBoard = board.copy(
      state = newState,
      units = newUnits.toSet,
      unitStatuses = newUnitStatuses,
      provinceStatuses = newProvinceStatuses
    )

    val orderResults: Set[OrderResult] =
      ordersWithResult flatMap { order =>
        order.result map { result =>
          OrderResult.Executed[Power, MilitaryBranch, Order, Result](order.order, result)
        }
      }
    Right(ResolvedResult(newBoard, orderResults))
  }
}
