'use strict'

const chai = require('chai')

chai.should()

const diplomacy = require('../index.js')
const variant = diplomacy.variant.standard.Variant().variant
const Helper = diplomacy.variant.standard.rule.JsStandardRuleHelper
const Converter = diplomacy.util.JsConverters()

describe('The libdiplomacy module', () => {
  it('resolve the Diplomacy game', () => {
    const $ = diplomacy.variant.standard.map.Keywords()

    const spring = variant.initialBoard
    const $1 = new Helper(spring)
    const orders1 = [
      $1.A($.Lvp).move($.Yor), $1.F($.Lon).move($.Nth), $1.F($.Edi).move($.Nrg),
      $1.A($.Par).move($.Bur), $1.A($.Mar).move($.Spa), $1.F($.Bre).move($.Mid),
      $1.A($.Ber).move($.Kie), $1.A($.Mun).move($.Bur), $1.F($.Kie).move($.Den),
      $1.A($.Vie).move($.Bud), $1.A($.Bud).move($.Ser), $1.F($.Tri).move($.Alb),
      $1.A($.Ven).move($.Apu), $1.A($.Rom).hold(),       $1.F($.Nap).move($.Ion),
      $1.F($.StP_SC).move($.Bot),
      $1.A($.Mos).move($.Sev), $1.A($.War).move($.Ukr), $1.F($.Sev).move($.Bla),
      $1.F($.Ank).move($.Bla), $1.A($.Con).move($.Bul), $1.A($.Smy).move($.Con)
    ]

    const result1 =
      Converter.fromEither(variant.rule.resolve(spring, Converter.toSet(orders1))).result

    const autumn = result1.board
    const $2 = new Helper(autumn)
    const orders2 = [
      $2.A($.Yor).move($.Bel), $2.F($.Nth).convoy($2.A($.Yor).move($.Bel)), $2.F($.Nrg).move($.Nwy),
      $2.A($.Par).move($.Bur), $2.A($.Spa).move($.Por), $2.F($.Mid).move($.Spa_SC),
      $2.A($.Kie).move($.Hol), $2.A($.Mun).move($.Bur), $2.F($.Den).hold(),
      $2.A($.Bud).hold(), $2.A($.Ser).support($2.F($.Alb).move($.Gre)), $2.F($.Alb).move($.Gre),
      $2.A($.Apu).move($.Tun), $2.A($.Rom).hold(), $2.F($.Ion).convoy($2.A($.Apu).move($.Tun)),
      $2.F($.Bot).move($.Swe), $2.A($.Mos).move($.StP),
      $2.A($.Ukr).move($.Rum), $2.F($.Sev).move($.Bla),
      $2.F($.Ank).move($.Bla), $2.A($.Bul).hold(), $2.A($.Con).hold()
    ]

    const result2 =
      Converter.fromEither(variant.rule.resolve(autumn, Converter.toSet(orders2))).result

    const build = result2.board
    const $3 = new Helper(build)
    const orders3 = [
      $3.F($.Lon).build(), $3.A($.Edi).build(),
      $3.F($.Bre).build(), $3.F($.Mar).build(),
      $3.F($.Kie).build(), $3.A($.Ber).build(),
      $3.A($.Vie).build(), $3.F($.Tri).build(),
      $3.F($.Nap).build(),
      $3.A($.War).build(), $3.A($.Mos).build(),
      $3.F($.Smy).build()
    ]

    const result3 =
      Converter.fromEither(variant.rule.resolve(build, Converter.toSet(orders3))).result

    result3.board.state.toString().should.equal('State(1902-Spring,Movement)')
  })
})
