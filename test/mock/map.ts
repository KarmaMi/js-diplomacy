import { board } from "../../src/board"
import { graph } from "../../src/graph"

const { Name, Province, Location, MapEdge, DiplomacyMap } = board
const { LabeledUndirectedGraph } = graph

const Fleet = new Name("Fleet", "F")
const Army = new Name("Army", "A")

const spain = new Province<string>(new Name("Spa"), null, true)
const spa = new Location<string, board.Name>(new Name("Spa"), spain, [Army])
const spaSc = new Location<string, board.Name>(new Name("Spa_SC"), spain, [Fleet])

const naples = new Province<string>(new Name("Nap"), "Italy", true)
const nap = new Location<string, board.Name>(new Name("Nap"), naples, [Army, Fleet])

const apulia = new Province<string>(new Name("Apu"), "Italy", false)
const apu = new Location<string, board.Name>(new Name("Apu"), apulia, [Army, Fleet])

const western = new Province<string>(new Name("Wes"), null, false)
const wes = new Location<string, board.Name>(new Name("Wes"), western, [Fleet])

const edges = [
  new MapEdge<string, board.Name>(spaSc, wes, [Fleet]),
  new MapEdge<string, board.Name>(wes, nap, [Fleet]),
  new MapEdge<string, board.Name>(nap, apu, [Army])
]

const mockMap = {
  militaryBranches: [Army, Fleet],
  provinces: [spain, naples, apulia, western],
  locations: [spa, spaSc, nap, apu, wes],
  map: new DiplomacyMap(new LabeledUndirectedGraph(edges))
}
export = mockMap
