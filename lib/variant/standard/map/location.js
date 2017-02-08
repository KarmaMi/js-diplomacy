'use strict'

const { land, coast, sea } = require('./province')
const { Location, Name } = require('../../../board/package')
const { Army, Fleet } = require('../rule/military-branch')

const NC = new Name('North Coast', 'NC')
const EC = new Name('East Coast', 'EC')
const SC = new Name('South Coast', 'SC')

const locations = {}

function addLocation (a0, a1) {
  const l = new Location(a0.name, a0, a1)
  locations[l.toString()] = l
}
function addLocationWithCoast (a0, a1) {
  const l = new Location(`${a0.name}_${a1}`, a0, [Fleet])
  locations[l.toString()] = l
}

for (let key in land) {
  addLocation(land[key], [Army])
}
for (let key in coast) {
  addLocation(coast[key], [Army, Fleet])
}

// Land with coasts
addLocationWithCoast(land.Spa, NC)
addLocationWithCoast(land.Spa, SC)
addLocationWithCoast(land.StP, NC)
addLocationWithCoast(land.StP, SC)
addLocationWithCoast(land.Bul, EC)
addLocationWithCoast(land.Bul, SC)

// Sea
for (let key in sea) {
  addLocation(sea[key], [Fleet])
}

module.exports = locations
