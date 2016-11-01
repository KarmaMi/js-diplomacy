const Name = require('./../../data/name')
const Province = require('./../../data/province')
const Location = require('./../../data/location')
const State = require('./../../data/state')
const Board = require('./../../data/board')
const Edge = require('./../../map/edge')
const DiplomacyMap = require('./../../map/diplomacy-map')
const Rule = require('./../../rule/rule')
const Order = require('./order')
const Helper = require('./../helper')
const Variant = require('./../variant')

// Military Branches
const Army = new Name('Army', 'A')
const Fleet = new Name('Fleet', 'F')

// Forces
const Austria = 'Austria'
const England = 'England'
const France = 'France'
const Germany = 'Germany'
const Italy = 'Italy'
const Russia = 'Russia'
const Turkey = 'Turkey'

// Provinces
const land = {}
const sea = {}
land.Boh = new Province(new Name('Bohemia', 'Boh'), Austria)
land.Bud = new Province(new Name('Budapest', 'Bud'), Austria, true)
land.Gal = new Province(new Name('Galicia', 'Gal'), Austria)
land.Tri = new Province(new Name('Trieste', 'Tri'), Austria, true)
land.Tyr = new Province(new Name('Tyrolia', 'Tyr'), Austria)
land.Vie = new Province(new Name('Vienna', 'Vie'), Austria, true)
land.Cly = new Province(new Name('Clyde', 'Cly'), England)
land.Edi = new Province(new Name('Edinburgh', 'Edi'), England, true)
land.Lvp = new Province(new Name('Liverpool', 'Lvp'), England, true)
land.Lon = new Province(new Name('London', 'Lon'), England, true)
land.Wal = new Province(new Name('Wales', 'Wal'), England)
land.Yor = new Province(new Name('Yorkshire', 'Yor'), England)
land.Bre = new Province(new Name('Brest', 'Bre'), France, true)
land.Bur = new Province(new Name('Burgundy', 'Bur'), France)
land.Gas = new Province(new Name('Gascony', 'Gas'), France)
land.Mar = new Province(new Name('Marseilles', 'Mar'), France, true)
land.Par = new Province(new Name('Paris', 'Par'), France, true)
land.Pic = new Province(new Name('Picardy', 'Pic'), France)
land.Ber = new Province(new Name('Berlin', 'Ber'), Germany, true)
land.Kie = new Province(new Name('Kiel', 'Kie'), Germany, true)
land.Mun = new Province(new Name('Munich', 'Mun'), Germany, true)
land.Pru = new Province(new Name('Prussia', 'Pru'), Germany)
land.Ruh = new Province(new Name('Ruhr', 'Ruh'), Germany)
land.Sil = new Province(new Name('Silesia', 'Sil'), Germany)
land.Apu = new Province(new Name('Apulia', 'Apu'), Italy)
land.Nap = new Province(new Name('Naples', 'Nap'), Italy, true)
land.Pie = new Province(new Name('Piedmont', 'Pie'), Italy)
land.Rom = new Province(new Name('Rome', 'Rom'), Italy, true)
land.Tus = new Province(new Name('Tuscany', 'Tus'), Italy)
land.Ven = new Province(new Name('Venice', 'Ven'), Italy, true)
land.Fin = new Province(new Name('Finland', 'Fin'), Russia)
land.Lvn = new Province(new Name('Livonia', 'Lvn'), Russia)
land.Mos = new Province(new Name('Moscow', 'Mos'), Russia, true)
land.Sev = new Province(new Name('Sevastopol', 'Sev'), Russia, true)
land.StP = new Province(new Name('St. Petersburg', 'StP'), Russia, true)
land.Ukr = new Province(new Name('Ukraine', 'Ukr'), Russia)
land.War = new Province(new Name('Warsaw', 'War'), Russia, true)
land.Ank = new Province(new Name('Ankara', 'Ank'), Turkey, true)
land.Arm = new Province(new Name('Armenia', 'Arm'), Turkey)
land.Con = new Province(new Name('Constantinople', 'Con'), Turkey, true)
land.Smy = new Province(new Name('Smyrna', 'Smy'), Turkey, true)
land.Syr = new Province(new Name('Syria', 'Syr'), Turkey)
land.Alb = new Province(new Name('Albania', 'Alb'), null)
land.Bel = new Province(new Name('Belgium', 'Bel'), null, true)
land.Bul = new Province(new Name('Bulgaria', 'Bul'), null, true)
land.Den = new Province(new Name('Denmark', 'Den'), null, true)
land.Gre = new Province(new Name('Greece', 'Gre'), null, true)
land.Hol = new Province(new Name('Holland', 'Hol'), null, true)
land.Nwy = new Province(new Name('Norway', 'Nwy'), null, true)
land.Por = new Province(new Name('Portugal', 'Por'), null, true)
land.Rum = new Province(new Name('Rumania', 'Rum'), null, true)
land.Ser = new Province(new Name('Serbia', 'Ser'), null, true)
land.Spa = new Province(new Name('Spain', 'Spa'), null, true)
land.Swe = new Province(new Name('Sweden', 'Swe'), null, true)
land.Tun = new Province(new Name('Tunis', 'Tun'), null, true)
land.NAf = new Province(new Name('North Africa', 'NAf'), null)

sea.Adr = new Province(new Name('Adriatic Sea', 'Adr'), null)
sea.Aeg = new Province(new Name('Aegean Sea', 'Aeg'), null)
sea.Bal = new Province(new Name('Baltic Sea', 'Bal'), null)
sea.Bar = new Province(new Name('Barents Sea', 'Bar'), null)
sea.Bla = new Province(new Name('Black Sea', 'Bla'), null)
sea.Eas = new Province(new Name('Eastern Mediterranean', 'Eas'), null)
sea.Eng = new Province(new Name('English Channel', 'Eng'), null)
sea.Bot = new Province(new Name('Gulf of Bothnia', 'Bot'), null)
sea.GoL = new Province(new Name('Gulf of Lyon', 'GoL'), null)
sea.Hel = new Province(new Name('Helgoland Bight', 'Hel'), null)
sea.Ion = new Province(new Name('Ionian Sea', 'Ion'), null)
sea.Iri = new Province(new Name('Irish Sea', 'Iri'), null)
sea.Mid = new Province(new Name('Mid-Atlantic Ocean', 'Mid'), null)
sea.NAt = new Province(new Name('North Atlantic Ocean', 'NAt'), null)
sea.Nth = new Province(new Name('North Sea', 'Nth'), null)
sea.Nrg = new Province(new Name('Norwegian Sea', 'Nrg'), null)
sea.Ska = new Province(new Name('Skagerrak', 'Ska'), null)
sea.Tyn = new Province(new Name('Tyrrhenian Sea', 'Tyn'), null)
sea.Wes = new Province(new Name('Western Mediterranean', 'Wes'), null)

// Location
const locations = {}
// Land
for (const key in land) {
  locations[key] = new Location(land[key], [Army, Fleet])
}
// Land with coasts
{
  // Coasts
  const SC = new Name('South Coast', 'SC')
  const NC = new Name('North Coast', 'NC')
  const EC = new Name('East Coast', 'EC')

  class LocationWithCoast extends Location {
    constructor (province, coast) {
      super(province, [Army, Fleet])
      this.coast = coast
    }
    toString () {
      return `${this.province.name}/${this.coast}`
    }
  }

  locations['Spa/NC'] = new LocationWithCoast(land.Spa, NC)
  locations['Spa/SC'] = new LocationWithCoast(land.Spa, SC)
  locations['StP/NC'] = new LocationWithCoast(land.StP, NC)
  locations['StP/SC'] = new LocationWithCoast(land.StP, SC)
  locations['Bul/EC'] = new LocationWithCoast(land.Bul, EC)
  locations['Bul/SC'] = new LocationWithCoast(land.Bul, SC)
}
// Sea
for (const key in sea) {
  locations[key] = new Location(sea[key], [Fleet])
}

// Orders
const orders = []
for (const name in Order) {
  orders.push([name.toLowerCase(), Order[name]])
}

// Map
const $$ = locations
const map = new DiplomacyMap([
  // Boh
  new Edge($$.Boh, $$.Mun, [Army]),
  new Edge($$.Boh, $$.Sil, [Army]),
  new Edge($$.Boh, $$.Gal, [Army]),
  new Edge($$.Boh, $$.Vie, [Army]),
  new Edge($$.Boh, $$.Tyr, [Army]),
  // Bud
  new Edge($$.Bud, $$.Vie, [Army]),
  new Edge($$.Bud, $$.Gal, [Army]),
  new Edge($$.Bud, $$.Rum, [Army]),
  new Edge($$.Bud, $$.Ser, [Army]),
  new Edge($$.Bud, $$.Tri, [Army]),
  // Gal
  new Edge($$.Gal, $$.War, [Army]),
  new Edge($$.Gal, $$.Ukr, [Army]),
  new Edge($$.Gal, $$.Rum, [Army]),
  new Edge($$.Gal, $$.Vie, [Army]),
  // Tri
  new Edge($$.Tri, $$.Tyr, [Army]),
  new Edge($$.Tri, $$.Vie, [Army]),
  new Edge($$.Tri, $$.Ser, [Army]),
  new Edge($$.Tri, $$.Alb, [Army, Fleet]),
  new Edge($$.Tri, $$.Adr, [Army, Fleet]),
  new Edge($$.Tri, $$.Ven, [Army, Fleet]),
  // Tyr
  new Edge($$.Tyr, $$.Mun, [Army]),
  new Edge($$.Tyr, $$.Vie, [Army]),
  new Edge($$.Tyr, $$.Ven, [Army]),
  new Edge($$.Tyr, $$.Pie, [Army]),
  // Vie
  // Cly
  new Edge($$.Cly, $$.NAt, [Fleet]),
  new Edge($$.Cly, $$.Nrg, [Fleet]),
  new Edge($$.Cly, $$.Edi, [Army, Fleet]),
  new Edge($$.Cly, $$.Lvp, [Army, Fleet]),
  // Edi
  new Edge($$.Edi, $$.Nrg, [Fleet]),
  new Edge($$.Edi, $$.Nth, [Fleet]),
  new Edge($$.Edi, $$.Yor, [Army, Fleet]),
  new Edge($$.Edi, $$.Lvp, [Army]),
  // Lvp
  new Edge($$.Lvp, $$.Iri, [Fleet]),
  new Edge($$.Lvp, $$.Yor, [Army]),
  new Edge($$.Lvp, $$.Wal, [Army, Fleet]),
  // Lon
  new Edge($$.Lon, $$.Wal, [Army, Fleet]),
  new Edge($$.Lon, $$.Yor, [Army, Fleet]),
  new Edge($$.Lon, $$.Nth, [Fleet]),
  new Edge($$.Lon, $$.Eng, [Fleet]),
  // Wal
  new Edge($$.Wal, $$.Iri, [Fleet]),
  new Edge($$.Wal, $$.Yor, [Army]),
  new Edge($$.Wal, $$.Eng, [Fleet]),
  // Yor
  new Edge($$.Yor, $$.Nth, [Fleet]),
  // Bre
  new Edge($$.Bre, $$.Eng, [Fleet]),
  new Edge($$.Bre, $$.Pic, [Army, Fleet]),
  new Edge($$.Bre, $$.Par, [Army]),
  new Edge($$.Bre, $$.Gas, [Army, Fleet]),
  new Edge($$.Bre, $$.Mid, [Fleet]),
  // Bur
  new Edge($$.Bur, $$.Par, [Army]),
  new Edge($$.Bur, $$.Pic, [Army]),
  new Edge($$.Bur, $$.Bel, [Army]),
  new Edge($$.Bur, $$.Ruh, [Army]),
  new Edge($$.Bur, $$.Mun, [Army]),
  new Edge($$.Bur, $$.Mar, [Army]),
  new Edge($$.Bur, $$.Gas, [Army]),
  // Gas
  new Edge($$.Gas, $$.Mid, [Fleet]),
  new Edge($$.Gas, $$.Par, [Army]),
  new Edge($$.Gas, $$.Mar, [Army]),
  new Edge($$.Gas, $$.Spa, [Army]),
  new Edge($$.Gas, $$['Spa/NC'], [Fleet]),
  // Mar
  new Edge($$.Mar, $$.Spa, [Army]),
  new Edge($$.Mar, $$['Spa/SC'], [Fleet]),
  new Edge($$.Mar, $$.GoL, [Fleet]),
  new Edge($$.Mar, $$.Pic, [Army, Fleet]),
  // Par
  new Edge($$.Par, $$.Pic, [Army]),
  // Pic
  new Edge($$.Pic, $$.Eng, [Fleet]),
  new Edge($$.Pic, $$.Bel, [Army, Fleet]),
  // Ber
  new Edge($$.Ber, $$.Kie, [Army, Fleet]),
  new Edge($$.Ber, $$.Bal, [Fleet]),
  new Edge($$.Ber, $$.Pru, [Army, Fleet]),
  new Edge($$.Ber, $$.Sil, [Army]),
  new Edge($$.Ber, $$.Mun, [Army]),
  // Kie
  new Edge($$.Kie, $$.Hel, [Fleet]),
  new Edge($$.Kie, $$.Den, [Army, Fleet]),
  new Edge($$.Kie, $$.Mun, [Army]),
  new Edge($$.Kie, $$.Ruh, [Army]),
  new Edge($$.Kie, $$.Hol, [Army, Fleet]),
  // Mun
  new Edge($$.Mun, $$.Ruh, [Army]),
  new Edge($$.Mun, $$.Sil, [Army]),
  // Pru
  new Edge($$.Pru, $$.Bal, [Fleet]),
  new Edge($$.Pru, $$.Lvn, [Army, Fleet]),
  new Edge($$.Pru, $$.War, [Army]),
  new Edge($$.Pru, $$.Sil, [Army]),
  // Ruh
  new Edge($$.Ruh, $$.Bel, [Army]),
  new Edge($$.Ruh, $$.Hol, [Army]),
  // Sil
  new Edge($$.Sil, $$.War, [Army]),
  // Apu
  new Edge($$.Apu, $$.Ven, [Army, Fleet]),
  new Edge($$.Apu, $$.Adr, [Fleet]),
  new Edge($$.Apu, $$.Ion, [Fleet]),
  new Edge($$.Apu, $$.Nap, [Army, Fleet]),
  new Edge($$.Apu, $$.Rom, [Army]),
  // Nap
  new Edge($$.Nap, $$.Rom, [Army, Fleet]),
  new Edge($$.Nap, $$.Ion, [Fleet]),
  new Edge($$.Nap, $$.Tyn, [Fleet]),
  // Pie
  new Edge($$.Pie, $$.Ven, [Army]),
  new Edge($$.Pie, $$.Tus, [Army, Fleet]),
  new Edge($$.Pie, $$.GoL, [Fleet]),
  // Rom
  new Edge($$.Rom, $$.Tus, [Army, Fleet]),
  new Edge($$.Rom, $$.Ven, [Army]),
  new Edge($$.Rom, $$.Tyn, [Fleet]),
  // Tus
  new Edge($$.Tus, $$.GoL, [Fleet]),
  new Edge($$.Tus, $$.Ven, [Army]),
  new Edge($$.Tus, $$.Tyn, [Fleet]),
  // Ven
  new Edge($$.Ven, $$.Adr, [Fleet]),
  // Fin
  new Edge($$.Fin, $$.Nwy, [Army]),
  new Edge($$.Fin, $$.Swe, [Army, Fleet]),
  new Edge($$.Fin, $$.Bot, [Fleet]),
  new Edge($$.Fin, $$.StP, [Army]),
  new Edge($$.Fin, $$['StP/SC'], [Fleet]),
  // Lvn
  new Edge($$.Lvn, $$.Bot, [Fleet]),
  new Edge($$.Lvn, $$.StP, [Army]),
  new Edge($$.Lvn, $$['StP/SC'], [Fleet]),
  new Edge($$.Lvn, $$.Mos, [Army]),
  new Edge($$.Lvn, $$.War, [Army]),
  new Edge($$.Lvn, $$.Bal, [Fleet]),
  // Mos
  new Edge($$.Mos, $$.StP, [Army]),
  new Edge($$.Mos, $$.Sev, [Army]),
  new Edge($$.Mos, $$.Ukr, [Army]),
  new Edge($$.Mos, $$.War, [Army]),
  // Sev
  new Edge($$.Sev, $$.Ukr, [Army]),
  new Edge($$.Sev, $$.Arm, [Army, Fleet]),
  new Edge($$.Sev, $$.Bla, [Fleet]),
  new Edge($$.Sev, $$.Rum, [Army, Fleet]),
  // StP
  new Edge($$.StP, $$.Nwy, [Army]),
  // StP/NC
  new Edge($$['StP/NC'], $$.Nwy, [Fleet]),
  new Edge($$['StP/NC'], $$.Bar, [Fleet]),
  // StP/SC
  new Edge($$['StP/SC'], $$.Bot, [Fleet]),
  // Ukr
  new Edge($$.Ukr, $$.War, [Army]),
  new Edge($$.Ukr, $$.Rum, [Army]),
  // War
  // Ank
  new Edge($$.Ank, $$.Bla, [Fleet]),
  new Edge($$.Ank, $$.Arm, [Army, Fleet]),
  new Edge($$.Ank, $$.Smy, [Army]),
  new Edge($$.Ank, $$.Con, [Army, Fleet]),
  // Arm
  new Edge($$.Arm, $$.Bla, [Fleet]),
  new Edge($$.Arm, $$.Syr, [Army]),
  new Edge($$.Arm, $$.Smy, [Army]),
  // Con
  new Edge($$.Con, $$.Bul, [Army]),
  new Edge($$.Con, $$['Bul/EC'], [Fleet]),
  new Edge($$.Con, $$['Bul/SC'], [Fleet]),
  new Edge($$.Con, $$.Bla, [Fleet]),
  new Edge($$.Con, $$.Smy, [Army, Fleet]),
  new Edge($$.Con, $$.Aeg, [Fleet]),
  // Smy
  new Edge($$.Smy, $$.Syr, [Army, Fleet]),
  new Edge($$.Smy, $$.Eas, [Fleet]),
  new Edge($$.Smy, $$.Aeg, [Fleet]),
  // Syr
  new Edge($$.Syr, $$.Eas, [Fleet]),
  // Alb
  new Edge($$.Alb, $$.Ser, [Army]),
  new Edge($$.Alb, $$.Gre, [Army, Fleet]),
  new Edge($$.Alb, $$.Ion, [Fleet]),
  // Bel
  new Edge($$.Bel, $$.Eng, [Fleet]),
  new Edge($$.Bel, $$.Nth, [Fleet]),
  new Edge($$.Bel, $$.Hol, [Army, Fleet]),
  // Bul
  new Edge($$.Bul, $$.Ser, [Army]),
  new Edge($$.Bul, $$.Rum, [Army]),
  new Edge($$.Bul, $$.Gre, [Army]),
  // Bul/EC
  new Edge($$['Bul/EC'], $$.Rum, [Fleet]),
  new Edge($$['Bul/EC'], $$.Bla, [Fleet]),
  // Bul/SC
  new Edge($$['Bul/SC'], $$.Gre, [Fleet]),
  new Edge($$['Bul/SC'], $$.Aeg, [Fleet]),
  // Den
  new Edge($$.Den, $$.Nth, [Fleet]),
  new Edge($$.Den, $$.Ska, [Fleet]),
  new Edge($$.Den, $$.Bal, [Fleet]),
  new Edge($$.Den, $$.Hel, [Fleet]),
  // Gre
  new Edge($$.Gre, $$.Ser, [Army]),
  new Edge($$.Gre, $$.Aeg, [Fleet]),
  new Edge($$.Gre, $$.Ion, [Fleet]),
  // Hol
  new Edge($$.Hol, $$.Nth, [Fleet]),
  new Edge($$.Hol, $$.Hel, [Fleet]),
  // Nwy
  new Edge($$.Nwy, $$.Nrg, [Fleet]),
  new Edge($$.Nwy, $$.Bar, [Fleet]),
  new Edge($$.Nwy, $$.Swe, [Army, Fleet]),
  new Edge($$.Nwy, $$.Ska, [Fleet]),
  new Edge($$.Nwy, $$.Nth, [Fleet]),
  // Por
  new Edge($$.Por, $$.Mid, [Fleet]),
  new Edge($$.Por, $$.Spa, [Army]),
  new Edge($$.Por, $$['Spa/NC'], [Fleet]),
  new Edge($$.Por, $$['Spa/SC'], [Fleet]),
  // Rum
  new Edge($$.Rum, $$.Ser, [Army]),
  new Edge($$.Rum, $$.Bla, [Fleet]),
  // Ser
  // Spa
  // Spa/NC
  new Edge($$['Spa/NC'], $$.Mid, [Fleet]),
  // Spa/SC
  new Edge($$['Spa/SC'], $$.Mid, [Fleet]),
  new Edge($$['Spa/SC'], $$.GoL, [Fleet]),
  new Edge($$['Spa/SC'], $$.Wes, [Fleet]),
  // Swe
  new Edge($$.Swe, $$.Ska, [Fleet]),
  new Edge($$.Swe, $$.Bal, [Fleet]),
  new Edge($$.Swe, $$.Bot, [Fleet]),
  new Edge($$.Swe, $$.Den, [Army, Fleet]),
  // Tun
  new Edge($$.Tun, $$.Wes, [Fleet]),
  new Edge($$.Tun, $$.Tyn, [Fleet]),
  new Edge($$.Tun, $$.Ion, [Fleet]),
  new Edge($$.Tun, $$.NAf, [Army, Fleet]),
  // NAf
  new Edge($$.NAf, $$.Wes, [Fleet]),
  new Edge($$.NAf, $$.Mid, [Fleet]),
  // Adr
  new Edge($$.Adr, $$.Ion, [Fleet]),
  // Aeg
  new Edge($$.Aeg, $$.Eas, [Fleet]),
  new Edge($$.Aeg, $$.Ion, [Fleet]),
  // Bal
  new Edge($$.Bal, $$.Bot, [Fleet]),
  // Bar
  new Edge($$.Bar, $$.Nrg, [Fleet]),
  // Bla
  // Eas
  new Edge($$.Eas, $$.Ion, [Fleet]),
  // Eng
  new Edge($$.Eng, $$.Iri, [Fleet]),
  new Edge($$.Eng, $$.Nth, [Fleet]),
  new Edge($$.Eng, $$.Mid, [Fleet]),
  // Bot
  // GoL
  new Edge($$.GoL, $$.Tyn, [Fleet]),
  new Edge($$.GoL, $$.Wes, [Fleet]),
  // Hel
  new Edge($$.Hel, $$.Nth, [Fleet]),
  // Ion
  new Edge($$.Ion, $$.Tyn, [Fleet]),
  // Iri
  new Edge($$.Iri, $$.NAt, [Fleet]),
  new Edge($$.Iri, $$.Mid, [Fleet]),
  // Mid
  new Edge($$.Mid, $$.NAf, [Fleet]),
  new Edge($$.Mid, $$.Wes, [Fleet]),
  // NAt
  new Edge($$.NAt, $$.Nrg, [Fleet]),
  // Nth
  new Edge($$.Nth, $$.Nrg, [Fleet]),
  // Nrg
  // Ska
  // Tyn
  new Edge($$.Tyn, $$.Wes, [Fleet])
  // Wes
])

const rule = new Rule(
  ['Spring', 'Autumn'], ['Movement', 'Retreat', 'Build'], [Army, Fleet], orders
)

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

class StandardVariant extends Variant {
  constructor () {
    super(rule, map, board)
  }
}

module.exports = new StandardVariant()
