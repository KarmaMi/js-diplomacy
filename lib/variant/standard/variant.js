const Name = require('./../../data/name')
const Location = require('./../../data/location')
const Edge = require('./../../data/edge')
const DiplomacyMap = require('./../../data/diplomacy-map')
const Order = require('./order')
const Variant = require('./../variant')

// Military Branches
const Army = new Name('Army', 'A')
const Fleet = new Name('Fleet', 'F')

// Provinces
const land = {}
const sea = {}
land.Boh = new Name('Bohemia', 'Boh')
land.Bud = new Name('Budapest', 'Bud')
land.Gal = new Name('Galicia', 'Gal')
land.Tri = new Name('Trieste', 'Tri')
land.Tyr = new Name('Tyrolia', 'Tyr')
land.Vie = new Name('Vienna', 'Vie')
land.Cly = new Name('Clyde', 'Cly')
land.Edi = new Name('Edinburgh', 'Edi')
land.Lvp = new Name('Liverpool', 'Lvp')
land.Lon = new Name('London', 'Lon')
land.Wal = new Name('Wales', 'Wal')
land.Yor = new Name('Yorkshire', 'Yor')
land.Bre = new Name('Brest', 'Bre')
land.Bur = new Name('Burgundy', 'Bur')
land.Gas = new Name('Gascony', 'Gas')
land.Mar = new Name('Marseilles', 'Mar')
land.Par = new Name('Paris', 'Par')
land.Pic = new Name('Picardy', 'Pic')
land.Ber = new Name('Berlin', 'Ber')
land.Kie = new Name('Kiel', 'Kie')
land.Mun = new Name('Munich', 'Mun')
land.Pru = new Name('Prussia', 'Pru')
land.Ruh = new Name('Ruhr', 'Ruh')
land.Sil = new Name('Silesia', 'Sil')
land.Apu = new Name('Apulia', 'Apu')
land.Nap = new Name('Naples', 'Nap')
land.Pie = new Name('Piedmont', 'Pie')
land.Rom = new Name('Rome', 'Rom')
land.Tus = new Name('Tuscany', 'Tus')
land.Ven = new Name('Venice', 'Ven')
land.Fin = new Name('Finland', 'Fin')
land.Lvn = new Name('Livonia', 'Lvn')
land.Mos = new Name('Moscow', 'Mos')
land.Sev = new Name('Sevastopol', 'Sev')
land.StP = new Name('St. Petersburg', 'StP')
land.Ukr = new Name('Ukraine', 'Ukr')
land.War = new Name('Warsaw', 'War')
land.Ank = new Name('Ankara', 'Ank')
land.Arm = new Name('Armenia', 'Arm')
land.Con = new Name('Constantinople', 'Con')
land.Smy = new Name('Smyrna', 'Smy')
land.Syr = new Name('Syria', 'Syr')
land.Alb = new Name('Albania', 'Alb')
land.Bel = new Name('Belgium', 'Bel')
land.Bul = new Name('Bulgaria', 'Bul')
land.Den = new Name('Denmark', 'Den')
land.Gre = new Name('Greece', 'Gre')
land.Hol = new Name('Holland', 'Hol')
land.Nwy = new Name('Norway', 'Nwy')
land.Por = new Name('Portugal', 'Por')
land.Rum = new Name('Rumania', 'Rum')
land.Ser = new Name('Serbia', 'Ser')
land.Spa = new Name('Spain', 'Spa')
land.Swe = new Name('Sweden', 'Swe')
land.Tun = new Name('Tunis', 'Tun')
land.NAf = new Name('North Africa', 'NAf')

sea.Adr = new Name('Adriatic Sea', 'Adr')
sea.Aeg = new Name('Aegean Sea', 'Aeg')
sea.Bal = new Name('Baltic Sea', 'Bal')
sea.Bar = new Name('Barents Sea', 'Bar')
sea.Bla = new Name('Black Sea', 'Bla')
sea.Eas = new Name('Eastern Mediterranean', 'Eas')
sea.Eng = new Name('English Channel', 'Eng')
sea.Bot = new Name('Gulf of Bothnia', 'Bot')
sea.GoL = new Name('Gulf of Lyon', 'GoL')
sea.Hel = new Name('Helgoland Bight', 'Hel')
sea.Ion = new Name('Ionian Sea', 'Ion')
sea.Iri = new Name('Irish Sea', 'Iri')
sea.Mid = new Name('Mid-Atlantic Ocean', 'Mid')
sea.NAt = new Name('North Atlantic Ocean', 'NAt')
sea.Nth = new Name('North Sea', 'Nth')
sea.Nrg = new Name('Norwegian Sea', 'Nrg')
sea.Ska = new Name('Skagerrak', 'Ska')
sea.Tyn = new Name('Tyrrhenian Sea', 'Tyn')
sea.Wes = new Name('Western Mediterranean', 'Wes')

// Coasts
const coasts =
  [new Name('South Coast', 'SC'), new Name('North Coast', 'NC'), new Name('East Coast', 'EC')]

// Location
const locations = {}
// Land
for (const key in land) {
  locations[key] = new Location(land[key], [Army, Fleet])
}
// Land with coasts
{
  const [SC, NC, EC] = coasts
  class LocationWithCoast extends Location {
    constructor (province, coast) {
      super(province, [Army, Fleet])
    }
    toString () {
      return `${this.province}/${this.coast}`
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
  orders.push({name: name.toLowerCase(), Clazz: Order[name]})
}

// Map
const $ = locations
const map = new DiplomacyMap([
  // Boh
  new Edge($.Boh, $.Mun, [Army]),
  new Edge($.Boh, $.Sil, [Army]),
  new Edge($.Boh, $.Gal, [Army]),
  new Edge($.Boh, $.Vie, [Army]),
  new Edge($.Boh, $.Tyr, [Army]),
  // Bud
  new Edge($.Bud, $.Vie, [Army]),
  new Edge($.Bud, $.Gal, [Army]),
  new Edge($.Bud, $.Rum, [Army]),
  new Edge($.Bud, $.Ser, [Army]),
  new Edge($.Bud, $.Tri, [Army]),
  // Gal
  new Edge($.Gal, $.War, [Army]),
  new Edge($.Gal, $.Ukr, [Army]),
  new Edge($.Gal, $.Rum, [Army]),
  new Edge($.Gal, $.Vie, [Army]),
  // Tri
  new Edge($.Tri, $.Tyr, [Army]),
  new Edge($.Tri, $.Vie, [Army]),
  new Edge($.Tri, $.Ser, [Army]),
  new Edge($.Tri, $.Alb, [Army, Fleet]),
  new Edge($.Tri, $.Adr, [Army, Fleet]),
  new Edge($.Tri, $.Ven, [Army, Fleet]),
  // Tyr
  new Edge($.Tyr, $.Mun, [Army]),
  new Edge($.Tyr, $.Vie, [Army]),
  new Edge($.Tyr, $.Ven, [Army]),
  new Edge($.Tyr, $.Pie, [Army]),
  // Vie
  // Cly
  new Edge($.Cly, $.NAt, [Fleet]),
  new Edge($.Cly, $.Nrg, [Fleet]),
  new Edge($.Cly, $.Edi, [Army, Fleet]),
  new Edge($.Cly, $.Lvp, [Army, Fleet]),
  // Edi
  new Edge($.Edi, $.Nrg, [Fleet]),
  new Edge($.Edi, $.Nth, [Fleet]),
  new Edge($.Edi, $.Yor, [Army, Fleet]),
  new Edge($.Edi, $.Lvp, [Army]),
  // Lvp
  new Edge($.Lvp, $.Iri, [Fleet]),
  new Edge($.Lvp, $.Yor, [Army]),
  new Edge($.Lvp, $.Wal, [Army, Fleet]),
  // Lon
  new Edge($.Lon, $.Wal, [Army, Fleet]),
  new Edge($.Lon, $.Yor, [Army, Fleet]),
  new Edge($.Lon, $.Nth, [Fleet]),
  new Edge($.Lon, $.Eng, [Fleet]),
  // Wal
  new Edge($.Wal, $.Iri, [Fleet]),
  new Edge($.Wal, $.Yor, [Army]),
  new Edge($.Wal, $.Eng, [Fleet]),
  // Yor
  new Edge($.Yor, $.Nth, [Fleet]),
  // Bre
  new Edge($.Bre, $.Eng, [Fleet]),
  new Edge($.Bre, $.Pic, [Army, Fleet]),
  new Edge($.Bre, $.Par, [Army]),
  new Edge($.Bre, $.Gas, [Army, Fleet]),
  new Edge($.Bre, $.Mid, [Fleet]),
  // Bur
  new Edge($.Bur, $.Par, [Army]),
  new Edge($.Bur, $.Pic, [Army]),
  new Edge($.Bur, $.Bel, [Army]),
  new Edge($.Bur, $.Ruh, [Army]),
  new Edge($.Bur, $.Mun, [Army]),
  new Edge($.Bur, $.Mar, [Army]),
  new Edge($.Bur, $.Gas, [Army]),
  // Gas
  new Edge($.Gas, $.Mid, [Fleet]),
  new Edge($.Gas, $.Par, [Army]),
  new Edge($.Gas, $.Mar, [Army]),
  new Edge($.Gas, $.Spa, [Army]),
  new Edge($.Gas, $['Spa/NC'], [Fleet]),
  // Mar
  new Edge($.Mar, $.Spa, [Army]),
  new Edge($.Mar, $['Spa/SC'], [Fleet]),
  new Edge($.Mar, $.GoL, [Fleet]),
  new Edge($.Mar, $.Pic, [Army, Fleet]),
  // Par
  new Edge($.Par, $.Pic, [Army]),
  // Pic
  new Edge($.Pic, $.Eng, [Fleet]),
  new Edge($.Pic, $.Bel, [Army, Fleet]),
  // Ber
  new Edge($.Ber, $.Kie, [Army, Fleet]),
  new Edge($.Ber, $.Bal, [Fleet]),
  new Edge($.Ber, $.Pru, [Army, Fleet]),
  new Edge($.Ber, $.Sil, [Army]),
  new Edge($.Ber, $.Mun, [Army]),
  // Kie
  new Edge($.Kie, $.Hel, [Fleet]),
  new Edge($.Kie, $.Den, [Army, Fleet]),
  new Edge($.Kie, $.Mun, [Army]),
  new Edge($.Kie, $.Ruh, [Army]),
  new Edge($.Kie, $.Hol, [Army, Fleet]),
  // Mun
  new Edge($.Mun, $.Ruh, [Army]),
  new Edge($.Mun, $.Sil, [Army]),
  // Pru
  new Edge($.Pru, $.Bal, [Fleet]),
  new Edge($.Pru, $.Lvn, [Army, Fleet]),
  new Edge($.Pru, $.War, [Army]),
  new Edge($.Pru, $.Sil, [Army]),
  // Ruh
  new Edge($.Ruh, $.Bel, [Army]),
  new Edge($.Ruh, $.Hol, [Army]),
  // Sil
  new Edge($.Sil, $.War, [Army]),
  // Apu
  new Edge($.Apu, $.Ven, [Army, Fleet]),
  new Edge($.Apu, $.Adr, [Fleet]),
  new Edge($.Apu, $.Ion, [Fleet]),
  new Edge($.Apu, $.Nap, [Army, Fleet]),
  new Edge($.Apu, $.Rom, [Army]),
  // Nap
  new Edge($.Nap, $.Rom, [Army, Fleet]),
  new Edge($.Nap, $.Ion, [Fleet]),
  new Edge($.Nap, $.Tyn, [Fleet]),
  // Pie
  new Edge($.Pie, $.Ven, [Army]),
  new Edge($.Pie, $.Tus, [Army, Fleet]),
  new Edge($.Pie, $.GoL, [Fleet]),
  // Rom
  new Edge($.Rom, $.Tus, [Army, Fleet]),
  new Edge($.Rom, $.Ven, [Army]),
  new Edge($.Rom, $.Tyn, [Fleet]),
  // Tus
  new Edge($.Tus, $.GoL, [Fleet]),
  new Edge($.Tus, $.Ven, [Army]),
  new Edge($.Tus, $.Tyn, [Fleet]),
  // Ven
  new Edge($.Ven, $.Adr, [Fleet]),
  // Fin
  new Edge($.Fin, $.Nwy, [Army]),
  new Edge($.Fin, $.Swe, [Army, Fleet]),
  new Edge($.Fin, $.Bot, [Fleet]),
  new Edge($.Fin, $.StP, [Army]),
  new Edge($.Fin, $['StP/SC'], [Fleet]),
  // Lvn
  new Edge($.Lvn, $.Bot, [Fleet]),
  new Edge($.Lvn, $.StP, [Army]),
  new Edge($.Lvn, $['StP/SC'], [Fleet]),
  new Edge($.Lvn, $.Mos, [Army]),
  new Edge($.Lvn, $.War, [Army]),
  new Edge($.Lvn, $.Bal, [Fleet]),
  // Mos
  new Edge($.Mos, $.StP, [Army]),
  new Edge($.Mos, $.Sev, [Army]),
  new Edge($.Mos, $.Ukr, [Army]),
  new Edge($.Mos, $.War, [Army]),
  // Sev
  new Edge($.Sev, $.Ukr, [Army]),
  new Edge($.Sev, $.Arm, [Army, Fleet]),
  new Edge($.Sev, $.Bla, [Fleet]),
  new Edge($.Sev, $.Rum, [Army, Fleet]),
  // StP
  new Edge($.StP, $.Nwy, [Army]),
  // StP/NC
  new Edge($['StP/NC'], $.Nwy, [Fleet]),
  new Edge($['StP/NC'], $.Bar, [Fleet]),
  // StP/SC
  new Edge($['StP/SC'], $.Bot, [Fleet]),
  // Ukr
  new Edge($.Ukr, $.War, [Army]),
  new Edge($.Ukr, $.Rum, [Army]),
  // War
  // Ank
  new Edge($.Ank, $.Bla, [Fleet]),
  new Edge($.Ank, $.Arm, [Army, Fleet]),
  new Edge($.Ank, $.Smy, [Army]),
  new Edge($.Ank, $.Con, [Army, Fleet]),
  // Arm
  new Edge($.Arm, $.Bla, [Fleet]),
  new Edge($.Arm, $.Syr, [Army]),
  new Edge($.Arm, $.Smy, [Army]),
  // Con
  new Edge($.Con, $.Bul, [Army]),
  new Edge($.Con, $['Bul/EC'], [Fleet]),
  new Edge($.Con, $['Bul/SC'], [Fleet]),
  new Edge($.Con, $.Bla, [Fleet]),
  new Edge($.Con, $.Smy, [Army, Fleet]),
  new Edge($.Con, $.Aeg, [Fleet]),
  // Smy
  new Edge($.Smy, $.Syr, [Army, Fleet]),
  new Edge($.Smy, $.Eas, [Fleet]),
  new Edge($.Smy, $.Aeg, [Fleet]),
  // Syr
  new Edge($.Syr, $.Eas, [Fleet]),
  // Alb
  new Edge($.Alb, $.Ser, [Army]),
  new Edge($.Alb, $.Gre, [Army, Fleet]),
  new Edge($.Alb, $.Ion, [Fleet]),
  // Bel
  new Edge($.Bel, $.Eng, [Fleet]),
  new Edge($.Bel, $.Nth, [Fleet]),
  new Edge($.Bel, $.Hol, [Army, Fleet]),
  // Bul
  new Edge($.Bul, $.Ser, [Army]),
  new Edge($.Bul, $.Rum, [Army]),
  new Edge($.Bul, $.Gre, [Army]),
  // Bul/EC
  new Edge($['Bul/EC'], $.Rum, [Fleet]),
  new Edge($['Bul/EC'], $.Bla, [Fleet]),
  // Bul/SC
  new Edge($['Bul/SC'], $.Gre, [Fleet]),
  new Edge($['Bul/SC'], $.Aeg, [Fleet]),
  // Den
  new Edge($.Den, $.Nth, [Fleet]),
  new Edge($.Den, $.Ska, [Fleet]),
  new Edge($.Den, $.Bal, [Fleet]),
  new Edge($.Den, $.Hel, [Fleet]),
  // Gre
  new Edge($.Gre, $.Ser, [Army]),
  new Edge($.Gre, $.Aeg, [Fleet]),
  new Edge($.Gre, $.Ion, [Fleet]),
  // Hol
  new Edge($.Hol, $.Nth, [Fleet]),
  new Edge($.Hol, $.Hel, [Fleet]),
  // Nwy
  new Edge($.Nwy, $.Nrg, [Fleet]),
  new Edge($.Nwy, $.Bar, [Fleet]),
  new Edge($.Nwy, $.Swe, [Army, Fleet]),
  new Edge($.Nwy, $.Ska, [Fleet]),
  new Edge($.Nwy, $.Nth, [Fleet]),
  // Por
  new Edge($.Por, $.Mid, [Fleet]),
  new Edge($.Por, $.Spa, [Army]),
  new Edge($.Por, $['Spa/NC'], [Fleet]),
  new Edge($.Por, $['Spa/SC'], [Fleet]),
  // Rum
  new Edge($.Rum, $.Ser, [Army]),
  new Edge($.Rum, $.Bla, [Fleet]),
  // Ser
  // Spa
  // Spa/NC
  new Edge($['Spa/NC'], $.Mid, [Fleet]),
  // Spa/SC
  new Edge($['Spa/SC'], $.Mid, [Fleet]),
  new Edge($['Spa/SC'], $.GoL, [Fleet]),
  new Edge($['Spa/SC'], $.Wes, [Fleet]),
  // Swe
  new Edge($.Swe, $.Ska, [Fleet]),
  new Edge($.Swe, $.Bal, [Fleet]),
  new Edge($.Swe, $.Bot, [Fleet]),
  new Edge($.Swe, $.Den, [Army, Fleet]),
  // Tun
  new Edge($.Tun, $.Wes, [Fleet]),
  new Edge($.Tun, $.Tyn, [Fleet]),
  new Edge($.Tun, $.Ion, [Fleet]),
  new Edge($.Tun, $.NAf, [Army, Fleet]),
  // NAf
  new Edge($.NAf, $.Wes, [Fleet]),
  new Edge($.NAf, $.Mid, [Fleet]),
  // Adr
  new Edge($.Adr, $.Ion, [Fleet]),
  // Aeg
  new Edge($.Aeg, $.Eas, [Fleet]),
  new Edge($.Aeg, $.Ion, [Fleet]),
  // Bal
  new Edge($.Bal, $.Bot, [Fleet]),
  // Bar
  new Edge($.Bar, $.Nrg, [Fleet]),
  // Bla
  // Eas
  new Edge($.Eas, $.Ion, [Fleet]),
  // Eng
  new Edge($.Eng, $.Iri, [Fleet]),
  new Edge($.Eng, $.Nth, [Fleet]),
  new Edge($.Eng, $.Mid, [Fleet]),
  // Bot
  // GoL
  new Edge($.GoL, $.Tyn, [Fleet]),
  new Edge($.GoL, $.Wes, [Fleet]),
  // Hel
  new Edge($.Hel, $.Nth, [Fleet]),
  // Ion
  new Edge($.Ion, $.Tyn, [Fleet]),
  // Iri
  new Edge($.Iri, $.NAt, [Fleet]),
  new Edge($.Iri, $.Mid, [Fleet]),
  // Mid
  new Edge($.Mid, $.NAf, [Fleet]),
  new Edge($.Mid, $.Wes, [Fleet]),
  // NAt
  new Edge($.NAt, $.Nrg, [Fleet]),
  // Nth
  new Edge($.Nth, $.Nrg, [Fleet]),
  // Nrg
  // Ska
  // Tyn
  new Edge($.Tyn, $.Wes, [Fleet])
  // Wes
])

class StandardVariant extends Variant {
  constructor () {
    super([Army, Fleet], coasts, orders, map)
  }
  generateLocation (province, coast) {
    if (coast) {
      return locations[`${province}/${coast}`]
    } else {
      return locations[`${province}`]
    }
  }
}

module.exports = new StandardVariant()
