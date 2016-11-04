module.exports = class ResolverSpecUtil {
  static checkBoard (actual, expected) {
    actual.state.should.deep.equal(expected.state)

    actual.units = [...actual.units].map(x => [x[0], x[1].map(e => e.toString())])
    expected.units = [...expected.units].map(x => [x[0], x[1].map(e => e.toString())])
    actual.units.should.deep.equal(expected.units);

    ([...actual.occupation]).should.deep.equal([...expected.occupation]);

    ([...actual.provincesStatus]).should.deep.equal([...expected.provincesStatus])

    actual.unitsStatus = [...actual.unitsStatus].map(x => [x[0].toString(), x[1]])
    expected.unitsStatus = [...expected.unitsStatus].map(x => [x[0].toString(), x[1]])
    actual.unitsStatus.should.deep.equal(expected.unitsStatus)
  }
  static checkOrderResult (actual, expected) {
    actual = [...actual].map(elem => [elem[0].toString(), elem[1]])
    expected = [...expected].map(elem => [elem[0].toString(), elem[1]])

    actual.should.deep.equal(expected)
  }
}
