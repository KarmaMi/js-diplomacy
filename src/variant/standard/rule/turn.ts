export interface Turn {
  /**
   * The flag whether there is a build phase in this turn.
   */
  isBuildable: boolean
  /*
   * The flag whether the occupation status is updated in this turn or not.
   */
  isOccupationUpdateable: boolean
  /**
   * @return The next turn (For example, 1901 Autumn if this instance represents 1901 Spring)
   */
  nextTurn(): Turn
}
