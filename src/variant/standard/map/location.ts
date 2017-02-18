import { Name, Province, Location } from "../../../board/module"
import { MilitaryBranch } from "../rule/module"
import { Power } from "./power"

const { Army, Fleet } = MilitaryBranch
const { Austria, England, France, Germany, Italy, Russia, Turkey } = Power

const NC = new Name('North Coast', 'NC')
const EC = new Name('East Coast', 'EC')
const SC = new Name('South Coast', 'SC')

const provinces: { [name: string]: Province<Power> } = {}

function mkLocation(province: Province<Power>, militaryBranches: Array<MilitaryBranch>) {
  return new Location<Power, MilitaryBranch>(province.name, province, militaryBranches)
}
function mkLocationWithCoast(province: Province<Power>, coast: Name) {
  return new Location<Power, MilitaryBranch>(
    new Name(`${province.name.name} (${coast.name})`, `${province.name}_${coast}`),
    province, [Fleet]
  )
}

const spa = new Province(new Name('Spain', 'Spa'), null, true)
const bul = new Province(new Name('Bulgaria', 'Bul'), null, true)
const stp = new Province(new Name('St. Petersburg', 'StP'), Russia, true)

export const locations = {
  Boh: mkLocation(new Province(new Name('Bohemia', 'Boh'), Austria), [Army]),
  Bud: mkLocation(new Province(new Name('Budapest', 'Bud'), Austria, true), [Army]),
  Gal: mkLocation(new Province(new Name('Galicia', 'Gal'), Austria), [Army]),
  Tri: mkLocation(new Province(new Name('Trieste', 'Tri'), Austria, true), [Army, Fleet]),
  Tyr: mkLocation(new Province(new Name('Tyrolia', 'Tyr'), Austria), [Army]),
  Vie: mkLocation(new Province(new Name('Vienna', 'Vie'), Austria, true), [Army]),
  Cly: mkLocation(new Province(new Name('Clyde', 'Cly'), England), [Army, Fleet]),
  Edi: mkLocation(new Province(new Name('Edinburgh', 'Edi'), England, true), [Army, Fleet]),
  Lvp: mkLocation(new Province(new Name('Liverpool', 'Lvp'), England, true), [Army, Fleet]),
  Lon: mkLocation(new Province(new Name('London', 'Lon'), England, true), [Army, Fleet]),
  Wal: mkLocation(new Province(new Name('Wales', 'Wal'), England), [Army, Fleet]),
  Yor: mkLocation(new Province(new Name('Yorkshire', 'Yor'), England), [Army, Fleet]),
  Bre: mkLocation(new Province(new Name('Brest', 'Bre'), France, true), [Army, Fleet]),
  Bur: mkLocation(new Province(new Name('Burgundy', 'Bur'), France), [Army]),
  Gas: mkLocation(new Province(new Name('Gascony', 'Gas'), France), [Army, Fleet]),
  Mar: mkLocation(new Province(new Name('Marseilles', 'Mar'), France, true), [Army, Fleet]),
  Par: mkLocation(new Province(new Name('Paris', 'Par'), France, true), [Army]),
  Pic: mkLocation(new Province(new Name('Picardy', 'Pic'), France), [Army, Fleet]),
  Ber: mkLocation(new Province(new Name('Berlin', 'Ber'), Germany, true), [Army, Fleet]),
  Kie: mkLocation(new Province(new Name('Kiel', 'Kie'), Germany, true), [Army, Fleet]),
  Mun: mkLocation(new Province(new Name('Munich', 'Mun'), Germany, true), [Army]),
  Pru: mkLocation(new Province(new Name('Prussia', 'Pru'), Germany), [Army, Fleet]),
  Ruh: mkLocation(new Province(new Name('Ruhr', 'Ruh'), Germany), [Army]),
  Sil: mkLocation(new Province(new Name('Silesia', 'Sil'), Germany), [Army]),
  Apu: mkLocation(new Province(new Name('Apulia', 'Apu'), Italy), [Army, Fleet]),
  Nap: mkLocation(new Province(new Name('Naples', 'Nap'), Italy, true), [Army, Fleet]),
  Pie: mkLocation(new Province(new Name('Piedmont', 'Pie'), Italy), [Army, Fleet]),
  Rom: mkLocation(new Province(new Name('Rome', 'Rom'), Italy, true), [Army, Fleet]),
  Tus: mkLocation(new Province(new Name('Tuscany', 'Tus'), Italy), [Army, Fleet]),
  Ven: mkLocation(new Province(new Name('Venice', 'Ven'), Italy, true), [Army, Fleet]),
  Fin: mkLocation(new Province(new Name('Finland', 'Fin'), Russia), [Army, Fleet]),
  Lvn: mkLocation(new Province(new Name('Livonia', 'Lvn'), Russia), [Army, Fleet]),
  Mos: mkLocation(new Province(new Name('Moscow', 'Mos'), Russia, true), [Army]),
  Sev: mkLocation(new Province(new Name('Sevastopol', 'Sev'), Russia, true), [Army, Fleet]),
  StP: mkLocation(stp, [Army]),
  StP_NC: mkLocationWithCoast(stp, NC),
  StP_SC: mkLocationWithCoast(stp, SC),
  Ukr: mkLocation(new Province(new Name('Ukraine', 'Ukr'), Russia), [Army]),
  War: mkLocation(new Province(new Name('Warsaw', 'War'), Russia, true), [Army]),
  Ank: mkLocation(new Province(new Name('Ankara', 'Ank'), Turkey, true), [Army, Fleet]),
  Arm: mkLocation(new Province(new Name('Armenia', 'Arm'), Turkey), [Army, Fleet]),
  Con: mkLocation(new Province(new Name('Constantinople', 'Con'), Turkey, true), [Army, Fleet]),
  Smy: mkLocation(new Province(new Name('Smyrna', 'Smy'), Turkey, true), [Army, Fleet]),
  Syr: mkLocation(new Province(new Name('Syria', 'Syr'), Turkey), [Army, Fleet]),
  Alb: mkLocation(new Province(new Name('Albania', 'Alb'), null), [Army, Fleet]),
  Bel: mkLocation(new Province(new Name('Belgium', 'Bel'), null, true), [Army, Fleet]),
  Bul: mkLocation(bul, [Army]),
  Bul_EC: mkLocationWithCoast(bul, EC),
  Bul_SC: mkLocationWithCoast(bul, SC),
  Den: mkLocation(new Province(new Name('Denmark', 'Den'), null, true), [Army, Fleet]),
  Gre: mkLocation(new Province(new Name('Greece', 'Gre'), null, true), [Army, Fleet]),
  Hol: mkLocation(new Province(new Name('Holland', 'Hol'), null, true), [Army, Fleet]),
  Nwy: mkLocation(new Province(new Name('Norway', 'Nwy'), null, true), [Army, Fleet]),
  Por: mkLocation(new Province(new Name('Portugal', 'Por'), null, true), [Army, Fleet]),
  Rum: mkLocation(new Province(new Name('Rumania', 'Rum'), null, true), [Army, Fleet]),
  Ser: mkLocation(new Province(new Name('Serbia', 'Ser'), null, true), [Army]),
  Spa: mkLocation(spa, [Army]),
  Spa_SC: mkLocationWithCoast(spa, SC),
  Spa_NC: mkLocationWithCoast(spa, NC),
  Swe: mkLocation(new Province(new Name('Sweden', 'Swe'), null, true), [Army, Fleet]),
  Tun: mkLocation(new Province(new Name('Tunis', 'Tun'), null, true), [Army, Fleet]),
  NAf: mkLocation(new Province(new Name('North Africa', 'NAf'), null), [Army, Fleet]),
  Adr: mkLocation(new Province(new Name('Adriatic Sea', 'Adr'), null), [Fleet]),
  Aeg: mkLocation(new Province(new Name('Aegean Sea', 'Aeg'), null), [Fleet]),
  Bal: mkLocation(new Province(new Name('Baltic Sea', 'Bal'), null), [Fleet]),
  Bar: mkLocation(new Province(new Name('Barents Sea', 'Bar'), null), [Fleet]),
  Bla: mkLocation(new Province(new Name('Black Sea', 'Bla'), null), [Fleet]),
  Eas: mkLocation(new Province(new Name('Eastern Mediterranean', 'Eas'), null), [Fleet]),
  Eng: mkLocation(new Province(new Name('English Channel', 'Eng'), null), [Fleet]),
  Bot: mkLocation(new Province(new Name('Gulf of Bothnia', 'Bot'), null), [Fleet]),
  GoL: mkLocation(new Province(new Name('Gulf of Lyon', 'GoL'), null), [Fleet]),
  Hel: mkLocation(new Province(new Name('Helgoland Bight', 'Hel'), null), [Fleet]),
  Ion: mkLocation(new Province(new Name('Ionian Sea', 'Ion'), null), [Fleet]),
  Iri: mkLocation(new Province(new Name('Irish Sea', 'Iri'), null), [Fleet]),
  Mid: mkLocation(new Province(new Name('Mid-Atlantic Ocean', 'Mid'), null), [Fleet]),
  NAt: mkLocation(new Province(new Name('North Atlantic Ocean', 'NAt'), null), [Fleet]),
  Nth: mkLocation(new Province(new Name('North Sea', 'Nth'), null), [Fleet]),
  Nrg: mkLocation(new Province(new Name('Norwegian Sea', 'Nrg'), null), [Fleet]),
  Ska: mkLocation(new Province(new Name('Skagerrak', 'Ska'), null), [Fleet]),
  Tyn: mkLocation(new Province(new Name('Tyrrhenian Sea', 'Tyn'), null), [Fleet]),
  Wes: mkLocation(new Province(new Name('Western Mediterranean', 'Wes'), null), [Fleet])
}
