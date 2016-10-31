'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Province = require('./../../lib/data/province')
const Location = require('./../../lib/data/location')
const Edge = require('./../../lib/data/edge')
const DiplomacyMap = require('./../../lib/data/diplomacy-map')
const Board = require('./../../lib/data/board')
const State = require('./../../lib/data/state')

const Helper = require('./../../lib/variant/helper')

chai.should()

describe('Board', () => {
  it('calculates the number of supply centers that a force has.', () => {
    const fleet = new Name('Fleet', 'F')
    const army = new Name('Army', 'A')

    const mar_ = new Province(new Name('Mar'), null, true)
    const mar = new Location(mar_, [army, fleet])

    const spain = new Province(new Name('Spa'), null, true)
    const spa = new Location(spain, [army])

    const map = new DiplomacyMap([new Edge(mar, spa, [army, fleet])])

    const $ = new Helper([], [], [fleet, army], [], map)
    const board = new Board(
      new State(1901, 'Spring', 'Moving'),
      [['France', [$.A($.Mar), $.A($.Spa)]]],
      [['France', [mar_, spain]]],
      []
    )

    board.numberOfsupplyCenters('France').should.equal(2)
  })
})
