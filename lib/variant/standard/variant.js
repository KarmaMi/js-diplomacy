const State = require('./../../data/state')
const Board = require('./../../data/board')
const Helper = require('./../helper')
const Variant = require('./../variant')

const rule = require('./rule')
const map = require('./map')

const $ = new Helper(rule, map)

const occupation = []
for (const f in $.$f) {
  const force = $.$f[f]
  const ls = [...map.provinces].filter(province => province.homeOf === force)
  occupation.push([force, ls])
}

const board = new Board(
  new State(1901, $.Spring, $.Movement),
  [
    [$.Austria, [$.A($.Vie), $.A($.Bud), $.F($.Tri)]],
    [$.England, [$.F($.Edi), $.F($.Lon), $.A($.Lvp)]],
    [$.France, [$.F($.Bre), $.A($.Mar), $.A($.Par)]],
    [$.Germany, [$.F($.Kie), $.A($.Ber), $.A($.Mun)]],
    [$.Italy, [$.A($.Ven), $.A($.Rom), $.F($.Nap)]],
    [$.Russia, [$.F($.Sev), $.A($.Mos), $.A($.War), $.F($['StP/SC'])]],
    [$.Turkey, [$.A($.Smy), $.A($.Con), $.F($.Ank)]]
  ],
  occupation,
  []
)

module.exports = new Variant(rule, map, board)
