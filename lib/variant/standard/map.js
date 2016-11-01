const Name = require('./../../data/name')
const Province = require('./../../data/province')
const Location = require('./../../data/location')
const Edge = require('./../../map/edge')
const DiplomacyMap = require('./../../map/diplomacy-map')
const RuleHelper = require('./../../rule/rule-helper')

const $ = new RuleHelper(require('./rule'))

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
  locations[key] = new Location(land[key], [$.A(), $.F()])
}
// Land with coasts
{
  // Coasts
  const SC = new Name('South Coast', 'SC')
  const NC = new Name('North Coast', 'NC')
  const EC = new Name('East Coast', 'EC')

  class LocationWithCoast extends Location {
    constructor (province, coast) {
      super(province, [$.A(), $.F()])
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
  locations[key] = new Location(sea[key], [$.F()])
}
// Map
const $$ = locations
module.exports = new DiplomacyMap([
  // Boh
  new Edge($$.Boh, $$.Mun, [$.A()]),
  new Edge($$.Boh, $$.Sil, [$.A()]),
  new Edge($$.Boh, $$.Gal, [$.A()]),
  new Edge($$.Boh, $$.Vie, [$.A()]),
  new Edge($$.Boh, $$.Tyr, [$.A()]),
  // Bud
  new Edge($$.Bud, $$.Vie, [$.A()]),
  new Edge($$.Bud, $$.Gal, [$.A()]),
  new Edge($$.Bud, $$.Rum, [$.A()]),
  new Edge($$.Bud, $$.Ser, [$.A()]),
  new Edge($$.Bud, $$.Tri, [$.A()]),
  // Gal
  new Edge($$.Gal, $$.War, [$.A()]),
  new Edge($$.Gal, $$.Ukr, [$.A()]),
  new Edge($$.Gal, $$.Rum, [$.A()]),
  new Edge($$.Gal, $$.Vie, [$.A()]),
  // Tri
  new Edge($$.Tri, $$.Tyr, [$.A()]),
  new Edge($$.Tri, $$.Vie, [$.A()]),
  new Edge($$.Tri, $$.Ser, [$.A()]),
  new Edge($$.Tri, $$.Alb, [$.A(), $.F()]),
  new Edge($$.Tri, $$.Adr, [$.A(), $.F()]),
  new Edge($$.Tri, $$.Ven, [$.A(), $.F()]),
  // Tyr
  new Edge($$.Tyr, $$.Mun, [$.A()]),
  new Edge($$.Tyr, $$.Vie, [$.A()]),
  new Edge($$.Tyr, $$.Ven, [$.A()]),
  new Edge($$.Tyr, $$.Pie, [$.A()]),
  // Vie
  // Cly
  new Edge($$.Cly, $$.NAt, [$.F()]),
  new Edge($$.Cly, $$.Nrg, [$.F()]),
  new Edge($$.Cly, $$.Edi, [$.A(), $.F()]),
  new Edge($$.Cly, $$.Lvp, [$.A(), $.F()]),
  // Edi
  new Edge($$.Edi, $$.Nrg, [$.F()]),
  new Edge($$.Edi, $$.Nth, [$.F()]),
  new Edge($$.Edi, $$.Yor, [$.A(), $.F()]),
  new Edge($$.Edi, $$.Lvp, [$.A()]),
  // Lvp
  new Edge($$.Lvp, $$.Iri, [$.F()]),
  new Edge($$.Lvp, $$.Yor, [$.A()]),
  new Edge($$.Lvp, $$.Wal, [$.A(), $.F()]),
  // Lon
  new Edge($$.Lon, $$.Wal, [$.A(), $.F()]),
  new Edge($$.Lon, $$.Yor, [$.A(), $.F()]),
  new Edge($$.Lon, $$.Nth, [$.F()]),
  new Edge($$.Lon, $$.Eng, [$.F()]),
  // Wal
  new Edge($$.Wal, $$.Iri, [$.F()]),
  new Edge($$.Wal, $$.Yor, [$.A()]),
  new Edge($$.Wal, $$.Eng, [$.F()]),
  // Yor
  new Edge($$.Yor, $$.Nth, [$.F()]),
  // Bre
  new Edge($$.Bre, $$.Eng, [$.F()]),
  new Edge($$.Bre, $$.Pic, [$.A(), $.F()]),
  new Edge($$.Bre, $$.Par, [$.A()]),
  new Edge($$.Bre, $$.Gas, [$.A(), $.F()]),
  new Edge($$.Bre, $$.Mid, [$.F()]),
  // Bur
  new Edge($$.Bur, $$.Par, [$.A()]),
  new Edge($$.Bur, $$.Pic, [$.A()]),
  new Edge($$.Bur, $$.Bel, [$.A()]),
  new Edge($$.Bur, $$.Ruh, [$.A()]),
  new Edge($$.Bur, $$.Mun, [$.A()]),
  new Edge($$.Bur, $$.Mar, [$.A()]),
  new Edge($$.Bur, $$.Gas, [$.A()]),
  // Gas
  new Edge($$.Gas, $$.Mid, [$.F()]),
  new Edge($$.Gas, $$.Par, [$.A()]),
  new Edge($$.Gas, $$.Mar, [$.A()]),
  new Edge($$.Gas, $$.Spa, [$.A()]),
  new Edge($$.Gas, $$['Spa/NC'], [$.F()]),
  // Mar
  new Edge($$.Mar, $$.Spa, [$.A()]),
  new Edge($$.Mar, $$['Spa/SC'], [$.F()]),
  new Edge($$.Mar, $$.GoL, [$.F()]),
  new Edge($$.Mar, $$.Pic, [$.A(), $.F()]),
  // Par
  new Edge($$.Par, $$.Pic, [$.A()]),
  // Pic
  new Edge($$.Pic, $$.Eng, [$.F()]),
  new Edge($$.Pic, $$.Bel, [$.A(), $.F()]),
  // Ber
  new Edge($$.Ber, $$.Kie, [$.A(), $.F()]),
  new Edge($$.Ber, $$.Bal, [$.F()]),
  new Edge($$.Ber, $$.Pru, [$.A(), $.F()]),
  new Edge($$.Ber, $$.Sil, [$.A()]),
  new Edge($$.Ber, $$.Mun, [$.A()]),
  // Kie
  new Edge($$.Kie, $$.Hel, [$.F()]),
  new Edge($$.Kie, $$.Den, [$.A(), $.F()]),
  new Edge($$.Kie, $$.Mun, [$.A()]),
  new Edge($$.Kie, $$.Ruh, [$.A()]),
  new Edge($$.Kie, $$.Hol, [$.A(), $.F()]),
  // Mun
  new Edge($$.Mun, $$.Ruh, [$.A()]),
  new Edge($$.Mun, $$.Sil, [$.A()]),
  // Pru
  new Edge($$.Pru, $$.Bal, [$.F()]),
  new Edge($$.Pru, $$.Lvn, [$.A(), $.F()]),
  new Edge($$.Pru, $$.War, [$.A()]),
  new Edge($$.Pru, $$.Sil, [$.A()]),
  // Ruh
  new Edge($$.Ruh, $$.Bel, [$.A()]),
  new Edge($$.Ruh, $$.Hol, [$.A()]),
  // Sil
  new Edge($$.Sil, $$.War, [$.A()]),
  // Apu
  new Edge($$.Apu, $$.Ven, [$.A(), $.F()]),
  new Edge($$.Apu, $$.Adr, [$.F()]),
  new Edge($$.Apu, $$.Ion, [$.F()]),
  new Edge($$.Apu, $$.Nap, [$.A(), $.F()]),
  new Edge($$.Apu, $$.Rom, [$.A()]),
  // Nap
  new Edge($$.Nap, $$.Rom, [$.A(), $.F()]),
  new Edge($$.Nap, $$.Ion, [$.F()]),
  new Edge($$.Nap, $$.Tyn, [$.F()]),
  // Pie
  new Edge($$.Pie, $$.Ven, [$.A()]),
  new Edge($$.Pie, $$.Tus, [$.A(), $.F()]),
  new Edge($$.Pie, $$.GoL, [$.F()]),
  // Rom
  new Edge($$.Rom, $$.Tus, [$.A(), $.F()]),
  new Edge($$.Rom, $$.Ven, [$.A()]),
  new Edge($$.Rom, $$.Tyn, [$.F()]),
  // Tus
  new Edge($$.Tus, $$.GoL, [$.F()]),
  new Edge($$.Tus, $$.Ven, [$.A()]),
  new Edge($$.Tus, $$.Tyn, [$.F()]),
  // Ven
  new Edge($$.Ven, $$.Adr, [$.F()]),
  // Fin
  new Edge($$.Fin, $$.Nwy, [$.A()]),
  new Edge($$.Fin, $$.Swe, [$.A(), $.F()]),
  new Edge($$.Fin, $$.Bot, [$.F()]),
  new Edge($$.Fin, $$.StP, [$.A()]),
  new Edge($$.Fin, $$['StP/SC'], [$.F()]),
  // Lvn
  new Edge($$.Lvn, $$.Bot, [$.F()]),
  new Edge($$.Lvn, $$.StP, [$.A()]),
  new Edge($$.Lvn, $$['StP/SC'], [$.F()]),
  new Edge($$.Lvn, $$.Mos, [$.A()]),
  new Edge($$.Lvn, $$.War, [$.A()]),
  new Edge($$.Lvn, $$.Bal, [$.F()]),
  // Mos
  new Edge($$.Mos, $$.StP, [$.A()]),
  new Edge($$.Mos, $$.Sev, [$.A()]),
  new Edge($$.Mos, $$.Ukr, [$.A()]),
  new Edge($$.Mos, $$.War, [$.A()]),
  // Sev
  new Edge($$.Sev, $$.Ukr, [$.A()]),
  new Edge($$.Sev, $$.Arm, [$.A(), $.F()]),
  new Edge($$.Sev, $$.Bla, [$.F()]),
  new Edge($$.Sev, $$.Rum, [$.A(), $.F()]),
  // StP
  new Edge($$.StP, $$.Nwy, [$.A()]),
  // StP/NC
  new Edge($$['StP/NC'], $$.Nwy, [$.F()]),
  new Edge($$['StP/NC'], $$.Bar, [$.F()]),
  // StP/SC
  new Edge($$['StP/SC'], $$.Bot, [$.F()]),
  // Ukr
  new Edge($$.Ukr, $$.War, [$.A()]),
  new Edge($$.Ukr, $$.Rum, [$.A()]),
  // War
  // Ank
  new Edge($$.Ank, $$.Bla, [$.F()]),
  new Edge($$.Ank, $$.Arm, [$.A(), $.F()]),
  new Edge($$.Ank, $$.Smy, [$.A()]),
  new Edge($$.Ank, $$.Con, [$.A(), $.F()]),
  // Arm
  new Edge($$.Arm, $$.Bla, [$.F()]),
  new Edge($$.Arm, $$.Syr, [$.A()]),
  new Edge($$.Arm, $$.Smy, [$.A()]),
  // Con
  new Edge($$.Con, $$.Bul, [$.A()]),
  new Edge($$.Con, $$['Bul/EC'], [$.F()]),
  new Edge($$.Con, $$['Bul/SC'], [$.F()]),
  new Edge($$.Con, $$.Bla, [$.F()]),
  new Edge($$.Con, $$.Smy, [$.A(), $.F()]),
  new Edge($$.Con, $$.Aeg, [$.F()]),
  // Smy
  new Edge($$.Smy, $$.Syr, [$.A(), $.F()]),
  new Edge($$.Smy, $$.Eas, [$.F()]),
  new Edge($$.Smy, $$.Aeg, [$.F()]),
  // Syr
  new Edge($$.Syr, $$.Eas, [$.F()]),
  // Alb
  new Edge($$.Alb, $$.Ser, [$.A()]),
  new Edge($$.Alb, $$.Gre, [$.A(), $.F()]),
  new Edge($$.Alb, $$.Ion, [$.F()]),
  // Bel
  new Edge($$.Bel, $$.Eng, [$.F()]),
  new Edge($$.Bel, $$.Nth, [$.F()]),
  new Edge($$.Bel, $$.Hol, [$.A(), $.F()]),
  // Bul
  new Edge($$.Bul, $$.Ser, [$.A()]),
  new Edge($$.Bul, $$.Rum, [$.A()]),
  new Edge($$.Bul, $$.Gre, [$.A()]),
  // Bul/EC
  new Edge($$['Bul/EC'], $$.Rum, [$.F()]),
  new Edge($$['Bul/EC'], $$.Bla, [$.F()]),
  // Bul/SC
  new Edge($$['Bul/SC'], $$.Gre, [$.F()]),
  new Edge($$['Bul/SC'], $$.Aeg, [$.F()]),
  // Den
  new Edge($$.Den, $$.Nth, [$.F()]),
  new Edge($$.Den, $$.Ska, [$.F()]),
  new Edge($$.Den, $$.Bal, [$.F()]),
  new Edge($$.Den, $$.Hel, [$.F()]),
  // Gre
  new Edge($$.Gre, $$.Ser, [$.A()]),
  new Edge($$.Gre, $$.Aeg, [$.F()]),
  new Edge($$.Gre, $$.Ion, [$.F()]),
  // Hol
  new Edge($$.Hol, $$.Nth, [$.F()]),
  new Edge($$.Hol, $$.Hel, [$.F()]),
  // Nwy
  new Edge($$.Nwy, $$.Nrg, [$.F()]),
  new Edge($$.Nwy, $$.Bar, [$.F()]),
  new Edge($$.Nwy, $$.Swe, [$.A(), $.F()]),
  new Edge($$.Nwy, $$.Ska, [$.F()]),
  new Edge($$.Nwy, $$.Nth, [$.F()]),
  // Por
  new Edge($$.Por, $$.Mid, [$.F()]),
  new Edge($$.Por, $$.Spa, [$.A()]),
  new Edge($$.Por, $$['Spa/NC'], [$.F()]),
  new Edge($$.Por, $$['Spa/SC'], [$.F()]),
  // Rum
  new Edge($$.Rum, $$.Ser, [$.A()]),
  new Edge($$.Rum, $$.Bla, [$.F()]),
  // Ser
  // Spa
  // Spa/NC
  new Edge($$['Spa/NC'], $$.Mid, [$.F()]),
  // Spa/SC
  new Edge($$['Spa/SC'], $$.Mid, [$.F()]),
  new Edge($$['Spa/SC'], $$.GoL, [$.F()]),
  new Edge($$['Spa/SC'], $$.Wes, [$.F()]),
  // Swe
  new Edge($$.Swe, $$.Ska, [$.F()]),
  new Edge($$.Swe, $$.Bal, [$.F()]),
  new Edge($$.Swe, $$.Bot, [$.F()]),
  new Edge($$.Swe, $$.Den, [$.A(), $.F()]),
  // Tun
  new Edge($$.Tun, $$.Wes, [$.F()]),
  new Edge($$.Tun, $$.Tyn, [$.F()]),
  new Edge($$.Tun, $$.Ion, [$.F()]),
  new Edge($$.Tun, $$.NAf, [$.A(), $.F()]),
  // NAf
  new Edge($$.NAf, $$.Wes, [$.F()]),
  new Edge($$.NAf, $$.Mid, [$.F()]),
  // Adr
  new Edge($$.Adr, $$.Ion, [$.F()]),
  // Aeg
  new Edge($$.Aeg, $$.Eas, [$.F()]),
  new Edge($$.Aeg, $$.Ion, [$.F()]),
  // Bal
  new Edge($$.Bal, $$.Bot, [$.F()]),
  // Bar
  new Edge($$.Bar, $$.Nrg, [$.F()]),
  // Bla
  // Eas
  new Edge($$.Eas, $$.Ion, [$.F()]),
  // Eng
  new Edge($$.Eng, $$.Iri, [$.F()]),
  new Edge($$.Eng, $$.Nth, [$.F()]),
  new Edge($$.Eng, $$.Mid, [$.F()]),
  // Bot
  // GoL
  new Edge($$.GoL, $$.Tyn, [$.F()]),
  new Edge($$.GoL, $$.Wes, [$.F()]),
  // Hel
  new Edge($$.Hel, $$.Nth, [$.F()]),
  // Ion
  new Edge($$.Ion, $$.Tyn, [$.F()]),
  // Iri
  new Edge($$.Iri, $$.NAt, [$.F()]),
  new Edge($$.Iri, $$.Mid, [$.F()]),
  // Mid
  new Edge($$.Mid, $$.NAf, [$.F()]),
  new Edge($$.Mid, $$.Wes, [$.F()]),
  // NAt
  new Edge($$.NAt, $$.Nrg, [$.F()]),
  // Nth
  new Edge($$.Nth, $$.Nrg, [$.F()]),
  // Nrg
  // Ska
  // Tyn
  new Edge($$.Tyn, $$.Wes, [$.F()])
  // Wes
])
