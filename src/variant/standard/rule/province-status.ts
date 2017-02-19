/**
 * Status of the province
 */
export class ProvinceStatus<Power> {
  /**
   * @param occupied
   *    The power that occupies the province. The province is neutral if this property is null
   * @param standoff The flag whether standoff is occurred or not
   */
  constructor (public occupied: Power | null, public standoff: boolean) {}
}
