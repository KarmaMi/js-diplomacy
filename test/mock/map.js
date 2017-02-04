const Name = require('./../../lib/board/name')
const Location = require('./../../lib/board/location')
const MapEdge = require('./../../lib/board/map-edge')
const DiplomacyMap = require('./../../lib/board/diplomacy-map')

const Fleet = new Name('Fleet', 'F')
const Army = new Name('Army', 'A')

const spain = new Name('Spa')
const spa = new Location(spain, spain, [Army])
const spaSc = new Location(spain, spain, [Fleet])

const naples = new Name('Nap')
const nap = new Location(naples, naples, [Army, Fleet])

const apulia = new Name('Apu')
const apu = new Location(apulia, apulia, [Army, Fleet])

const western = new Name('Wes')
const wes = new Location(western, western, [Fleet])

const edges = [
  new MapEdge(spaSc, wes, [Fleet]), new MapEdge(wes, nap, [Fleet]), new MapEdge(nap, apu, [Army])
]

module.exports = {
  militaryBranches: [Army, Fleet],
  provinces: [spain, naples, apulia, western],
  locations: [spa, spaSc, nap, apu, wes],
  map: new DiplomacyMap(edges)
}
