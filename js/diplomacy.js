(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diplomacy = require("../src/jsDiplomacy");
window.diplomacy = diplomacy;

},{"../src/jsDiplomacy":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
const { LabeledEdge, LabeledUndirectedGraph } = graph_1.graph;
var board;
(function (board) {
    /**
     * Name of atomic components (e.g., provinces)
     */
    class Name {
        /**
         * @param name The name
         * @param abbreviatedName The abbreviated name. name is used if this param is not specified.
         */
        constructor(name, abbreviatedName) {
            this.name = name;
            this.abbreviatedName = abbreviatedName || name;
        }
        toString() {
            return this.abbreviatedName;
        }
    }
    board.Name = Name;
    /**
     * Province in Diplomacy map
     */
    class Province {
        /**
         * @param name The name of this province
         * @param homeOf
         *   The power that has this province as a home country.
         *   This is a neutral province if null is set.
         * @param isSupplyCenter The flag whether this is a supply center or not.
         */
        constructor(name, homeOf, isSupplyCenter) {
            this.name = name;
            this.homeOf = homeOf;
            this.isSupplyCenter = isSupplyCenter || false;
        }
        toString() {
            if (this.isSupplyCenter) {
                return `${this.name}*`;
            }
            else {
                return this.name.toString();
            }
        }
    }
    board.Province = Province;
    /**
     * Location in Diplomacy map. Each province is expected to have 1 location at least.
     */
    class Location {
        /**
         * @param name The name of this location. It is usually same as the name of the province
         * @param province The province that this location is in.
         * @param militaryBranches The set of military branches that can enter this location.
         */
        constructor(name, province, militaryBranches) {
            this.name = name;
            this.province = province;
            this.militaryBranches = new Set([...militaryBranches]);
        }
        toString() {
            return `${this.name}`;
        }
    }
    board.Location = Location;
    /**
     * Unit of Diplomacy
     */
    class Unit {
        /**
         * @param militaryBranch The military branch of this unit.
         * @param location The location where this unit is in.
         * @param power The power that has this unit.
         */
        constructor(militaryBranch, location, power) {
            this.militaryBranch = militaryBranch;
            this.location = location;
            this.power = power;
            console.assert(this.location.militaryBranches.has(militaryBranch));
        }
        toString() {
            return `${this.militaryBranch} ${this.location}`;
        }
    }
    board.Unit = Unit;
    /**
     * Relation between board.Location
     */
    class MapEdge extends graph_1.graph.LabeledEdge {
        /**
         * @param n1 The end point 1.
         * @param n2 The end point 2.
         * @param label The set of military branches.
         */
        constructor(n1, n2, militaryBranches) {
            super(n1, n2, new Set([...militaryBranches]));
        }
    }
    board.MapEdge = MapEdge;
    /**
     * Map of Diplomacy
     */
    class DiplomacyMap {
        /**
         * @param map The labeled graph that represents the map.
         */
        constructor(map) {
            this.map = map;
            this.locations = this.map.nodes;
            this.provinces = new Set();
            this.provinceToLocation = new Map();
            this.locations.forEach(elem => {
                this.provinces.add(elem.province);
                if (!this.provinceToLocation.has(elem.province)) {
                    this.provinceToLocation.set(elem.province, new Set());
                }
                const locs = this.provinceToLocation.get(elem.province);
                if (locs) {
                    locs.add(elem);
                }
            });
            this.powers = new Set();
            this.provinces.forEach(province => {
                if (province.homeOf) {
                    this.powers.add(province.homeOf);
                }
            });
        }
        /**
         * @param province The province
         * @return The set of locations that the province has.
         */
        locationsOf(province) {
            return this.provinceToLocation.get(province) || new Set();
        }
        /**
         * @param province The province
         * @param militaryBranch The military branch
         * @return The set of provinces that the military branch in the province can move.
         */
        movableProvincesOf(province, militaryBranch) {
            const retval = new Set();
            const locations = this.locationsOf(province);
            this.locationsOf(province).forEach(location => {
                this.movableLocationsOf(location, militaryBranch).forEach(location => {
                    retval.add(location.province);
                });
            });
            return retval;
        }
        /**
         * @param {!board.Location} location - The location
         * @param {!(string|Object)} militaryBranch - The military branch
         * @return {!Set.<board.Location>} -
         *   The set of locations that the military branch in the location can move.
         */
        movableLocationsOf(location, militaryBranch) {
            return new Set([...this.map.neighborsOf(location)]
                .filter(elem => elem[1].has(militaryBranch)).map(elem => elem[0]));
        }
    }
    board.DiplomacyMap = DiplomacyMap;
    class Board {
        /**
         * @param map
         * @param state
         * @param units The units that are in this board
         * @param unitStatuses The state of each unit (e.g., the unit was dislodged)
         * @param provinceStatuses
         *   The state of each province (e.g., standoff was occurred, this province is occupied by X)
         */
        constructor(map, state, units, unitStatuses, provinceStatuses) {
            this.map = map;
            this.state = state;
            this.units = new Set([...units]);
            this.unitStatuses = new Map([...unitStatuses]);
            this.provinceStatuses = new Map([...provinceStatuses]);
        }
    }
    board.Board = Board;
})(board = exports.board || (exports.board = {}));

},{"./graph":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graph;
(function (graph) {
    /**
     * Implementation of IEdge
     */
    class Edge {
        constructor(n0, n1) {
            this.n0 = n0;
            this.n1 = n1;
        }
    }
    graph.Edge = Edge;
    /**
     * Implementation of ILabeledEdge
     */
    class LabeledEdge extends Edge {
        constructor(n0, n1, label) {
            super(n0, n1);
            this.label = label;
        }
    }
    graph.LabeledEdge = LabeledEdge;
    /**
     * Undirected graph with labeled edges
     */
    class LabeledUndirectedGraph {
        /**
         * @param edges The set of edges.
         * @param nodes The set of nodles.
         */
        constructor(edges, nodes) {
            this.edges = new Set([...edges]);
            if (!nodes) {
                this.nodes = new Set();
                this.edges.forEach(edge => {
                    this.nodes.add(edge.n0);
                    this.nodes.add(edge.n1);
                });
            }
            else {
                this.nodes = new Set([...nodes]);
            }
            this.neighborLists = new Map();
            this.nodes.forEach(node => {
                const xs1 = Array.from(this.edges).filter(edge => edge.n0 === node).map(edge => [edge.n1, edge.label]);
                const xs2 = Array.from(this.edges).filter(edge => edge.n1 === node).map(edge => [edge.n0, edge.label]);
                const xs = xs1.concat(xs2);
                this.neighborLists.set(node, new Set(xs));
            });
        }
        /**
         * @param node - The target node
         * @return he set of nodes that are neighbors of the node.
         */
        neighborsOf(node) {
            return this.neighborLists.get(node) || new Set();
        }
    }
    graph.LabeledUndirectedGraph = LabeledUndirectedGraph;
    /**
     * Directed graph
     */
    class DirectedGraph {
        /**
         * @param nodes The set of nodes.
         * @param edges The set of edges.
         */
        constructor(edges, nodes) {
            this.edges = new Set([...edges]);
            if (!nodes) {
                this.nodes = new Set();
                this.edges.forEach(edge => {
                    this.nodes.add(edge.n0);
                    this.nodes.add(edge.n1);
                });
            }
            else {
                this.nodes = new Set([...nodes]);
            }
            this.neighborLists = new Map();
            this.nodes.forEach(node => {
                const os = Array.from(this.edges).filter(edge => edge.n0 === node).map(edge => edge.n1);
                const is = Array.from(this.edges).filter(edge => edge.n1 === node).map(edge => edge.n0);
                this.neighborLists.set(node, [new Set(os), new Set(is)]);
            });
        }
        outgoingNodesOf(node) {
            return (this.neighborLists.get(node) || [new Set(), new Set()])[0];
        }
        incomingNodesOf(node) {
            return (this.neighborLists.get(node) || [new Set(), new Set()])[1];
        }
        /**
         * @return The cycle that is contained this graph. If there are no cycles, returns null.
         */
        getCycle() {
            const visit = (node, path, state) => {
                state.set(node, true);
                let cycle = null;
                for (let v of this.outgoingNodesOf(node)) {
                    if (!state.get(v)) {
                        const p = [...path];
                        p.push(v);
                        const c = visit(v, p, state);
                        if (c) {
                            cycle = c;
                            break;
                        }
                    }
                    else {
                        cycle = path.slice(path.indexOf(v));
                        break;
                    }
                }
                return cycle;
            };
            let cycle = null;
            for (let node of [...this.nodes]) {
                const state = new Map([...this.nodes].map(node => [node, false]));
                if (!state.get(node)) {
                    const c = visit(node, [node], state);
                    if (c) {
                        cycle = c;
                        break;
                    }
                }
            }
            return cycle;
        }
        /**
         * Deletes a node.
         * @param node The node to be deleted.
         * @return The directed graph that deletes the node.
         */
        deleteNode(node) {
            const nodes = new Set([...this.nodes].filter(n => n !== node));
            const edges = [...this.edges].filter(edge => edge.n0 !== node && edge.n1 !== node);
            return new DirectedGraph(edges, nodes);
        }
        /**
         * Merges nodes into one node.
         * @param nodes The nodes to be merged.
         * @return The directed graph that merges the nodes into one node.
         */
        mergeNodes(target) {
            const nodes = new Set([...this.nodes]);
            let mergedValue = [];
            target.forEach(node => {
                if (!this.nodes.has(node))
                    return;
                mergedValue = mergedValue.concat([...node]);
                nodes.delete(node);
            });
            const mergedNode = new Set(mergedValue);
            nodes.add(mergedNode);
            const edges = new Set();
            this.edges.forEach(edge => {
                const { n0, n1 } = edge;
                if (target.has(n0) && target.has(n1)) {
                    return;
                }
                else if (target.has(n0)) {
                    edges.add(new Edge(mergedNode, n1));
                    return;
                }
                else if (target.has(n1)) {
                    edges.add(new Edge(n0, mergedNode));
                }
                else {
                    edges.add(edge);
                }
            });
            return new DirectedGraph(edges, nodes);
        }
    }
    graph.DirectedGraph = DirectedGraph;
})(graph = exports.graph || (exports.graph = {}));

},{}],4:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./board"));
__export(require("./rule"));
__export(require("./graph"));
__export(require("./util"));
__export(require("./standard"));
__export(require("./standardMap"));
__export(require("./standardBoard"));
__export(require("./standardRule"));

},{"./board":2,"./graph":3,"./rule":5,"./standard":6,"./standardBoard":7,"./standardMap":8,"./standardRule":12,"./util":32}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
var rule;
(function (rule) {
    /**
     * Result of an order execution.
     */
    class Executed {
        /**
         * @param target The target order.
         * @param result The result of the target.
         */
        constructor(target, result) {
            this.target = target;
            this.result = result;
        }
    }
    rule.Executed = Executed;
    /**
     * Result of an order execution. It is used when the original order is replaced.
     */
    class Replaced {
        /**
         * @param target The target order.
         * @param result The result of the target.
         * @param invalidReason The reason why the target is replaced
         * @param replacedBy The order that replaces the target.
         */
        constructor(target, invalidReason, replacedBy, result) {
            this.target = target;
            this.invalidReason = invalidReason;
            this.replacedBy = replacedBy;
            this.result = result;
        }
    }
    rule.Replaced = Replaced;
    class ResolvedResult {
        /**
         * @param board
         * @param results The set of order results
         * @param isFinished The flag whether this game is finished or not.
         */
        constructor(board, results, isFinished) {
            this.board = board;
            this.isFinished = isFinished;
            this.results = new Set([...results]);
        }
    }
    rule.ResolvedResult = ResolvedResult;
    /**
     * Rule of Diplomacy
     */
    class Rule {
        /**
         * Resolves orders and creates a result.
         * @param board
         * @param orders The set of orders to be resolved.
         * @return The result of the orders
         */
        resolve(board, orders) {
            const os = new Set([...orders]);
            // Add a default orders if an unit requiring an order has no order
            for (let unit of [...this.unitsRequiringOrder(board)]) {
                if ([...orders].every(o => o.unit !== unit)) {
                    const order = this.defaultOrderOf(board, unit);
                    if (order) {
                        os.add(order);
                    }
                    else {
                        throw `${unit}: no order`;
                    }
                }
            }
            // Replace from invalid orders to default orders
            const replaced = new Map();
            os.forEach(order => {
                const msg = this.errorOfOrder(board, order);
                if (msg) {
                    const replacedOrder = this.defaultOrderOf(board, order.unit);
                    os.delete(order);
                    if (replacedOrder) {
                        os.add(replacedOrder);
                        replaced.set(replacedOrder, [order, msg]);
                    }
                    else {
                        throw `${order.unit}: no order`;
                    }
                }
            });
            // TODO rename errorOfOrders
            const msg = this.errorOfOrders(board, os);
            if (msg) {
                // Reject if the set of the orders is invalid
                return new util_1.util.Failure(msg);
            }
            const result = this.resolveProcedure(board, os);
            if (result instanceof util_1.util.Success) {
                const newResults = result.result.results;
                replaced.forEach((value, replacedOrder) => {
                    const [order, message] = value;
                    const result = [...newResults].find(r => r.target === replacedOrder);
                    if (result) {
                        newResults.delete(result);
                        newResults.add(new Replaced(order, message, result.target, result.result));
                    }
                });
                return new util_1.util.Success(new ResolvedResult(result.result.board, newResults, result.result.isFinished));
            }
            return new util_1.util.Failure(result.err);
        }
    }
    rule.Rule = Rule;
})(rule = exports.rule || (exports.rule = {}));

},{"./util":32}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variant_1 = require("./variant");
const standardRule_1 = require("./standardRule");
const data_1 = require("./standardRule/data");
const standardMap_1 = require("./standardMap");
const standardBoard_1 = require("./standardBoard");
const power_1 = require("./standardMap/power");
const { map, locations: $ } = standardMap_1.standardMap;
const { Turn, Season } = standardBoard_1.standardBoard;
const { Army, Fleet } = standardRule_1.standardRule.MilitaryBranch;
const { Unit, Board, Rule, Phase } = standardRule_1.standardRule;
const initialBoard = new Board(map, new data_1.State(new Turn(1901, Season.Spring), Phase.Movement), [
    new Unit(Army, $.Vie, power_1.Power.Austria), new Unit(Army, $.Bud, power_1.Power.Austria),
    new Unit(Fleet, $.Tri, power_1.Power.Austria),
    new Unit(Fleet, $.Edi, power_1.Power.England), new Unit(Fleet, $.Lon, power_1.Power.England),
    new Unit(Army, $.Lvp, power_1.Power.England),
    new Unit(Fleet, $.Bre, power_1.Power.France), new Unit(Army, $.Mar, power_1.Power.France),
    new Unit(Army, $.Par, power_1.Power.France),
    new Unit(Fleet, $.Kie, power_1.Power.Germany), new Unit(Army, $.Ber, power_1.Power.Germany),
    new Unit(Army, $.Mun, power_1.Power.Germany),
    new Unit(Army, $.Ven, power_1.Power.Italy), new Unit(Army, $.Rom, power_1.Power.Italy),
    new Unit(Fleet, $.Nap, power_1.Power.Italy),
    new Unit(Fleet, $.Sev, power_1.Power.Russia), new Unit(Army, $.Mos, power_1.Power.Russia),
    new Unit(Army, $.War, power_1.Power.Russia), new Unit(Fleet, $.StP_SC, power_1.Power.Russia),
    new Unit(Army, $.Smy, power_1.Power.Turkey), new Unit(Army, $.Con, power_1.Power.Turkey),
    new Unit(Fleet, $.Ank, power_1.Power.Turkey)
], [], ([...map.provinces].map(p => {
    if (p.homeOf !== null) {
        return [p, new data_1.ProvinceStatus(p.homeOf, false)];
    }
    else {
        return null;
    }
}).filter(x => x)));
const rule = new Rule();
var standard;
(function (standard) {
    standard.variant = new variant_1.variant.Variant(rule, initialBoard);
})(standard = exports.standard || (exports.standard = {}));

},{"./standardBoard":7,"./standardMap":8,"./standardMap/power":11,"./standardRule":12,"./standardRule/data":16,"./variant":33}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var standardBoard;
(function (standardBoard) {
    var Season;
    (function (Season) {
        Season[Season["Spring"] = 1] = "Spring";
        Season[Season["Autumn"] = 2] = "Autumn";
    })(Season = standardBoard.Season || (standardBoard.Season = {}));
    /**
     * The turn of standard Diplomacy rule
     */
    class Turn {
        constructor(year, season) {
            this.year = year;
            this.season = season;
            this.isBuildable = season === Season.Autumn;
            this.isOccupationUpdateable = season === Season.Autumn;
        }
        nextTurn() {
            if (this.season === Season.Autumn) {
                return new Turn(this.year + 1, Season.Spring);
            }
            else {
                return new Turn(this.year, Season.Autumn);
            }
        }
    }
    standardBoard.Turn = Turn;
})(standardBoard = exports.standardBoard || (exports.standardBoard = {}));

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PowerModule = require("./standardMap/power");
const location_1 = require("./standardMap/location");
const map_1 = require("./standardMap/map");
var standardMap;
(function (standardMap) {
    standardMap.Power = PowerModule.Power;
    standardMap.locations = location_1.locations;
    standardMap.map = map_1.map;
})(standardMap = exports.standardMap || (exports.standardMap = {}));

},{"./standardMap/location":9,"./standardMap/map":10,"./standardMap/power":11}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./../board");
const standardRule_1 = require("./../standardRule");
const power_1 = require("./power");
const { Name, Province } = board_1.board;
const { Army, Fleet } = standardRule_1.standardRule.MilitaryBranch;
const { Austria, England, France, Germany, Italy, Russia, Turkey } = power_1.Power;
const NC = new Name('North Coast', 'NC');
const EC = new Name('East Coast', 'EC');
const SC = new Name('South Coast', 'SC');
const provinces = {};
function mkLocation(province, militaryBranches) {
    return new standardRule_1.standardRule.Location(province.name, province, militaryBranches);
}
function mkLocationWithCoast(province, coast) {
    return new standardRule_1.standardRule.Location(new Name(`${province.name.name} (${coast.name})`, `${province.name}_${coast}`), province, [Fleet]);
}
const spa = new Province(new Name('Spain', 'Spa'), null, true);
const bul = new Province(new Name('Bulgaria', 'Bul'), null, true);
const stp = new Province(new Name('St. Petersburg', 'StP'), Russia, true);
exports.locations = {
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
};

},{"./../board":2,"./../standardRule":12,"./power":11}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const location_1 = require("./location");
const board_1 = require("./../board");
const graph_1 = require("./../graph");
const standardRule_1 = require("./../standardRule");
const { DiplomacyMap, MapEdge } = board_1.board;
const { LabeledUndirectedGraph } = graph_1.graph;
const { Army, Fleet } = standardRule_1.standardRule.MilitaryBranch;
exports.map = new DiplomacyMap(new LabeledUndirectedGraph([
    // Boh
    new MapEdge(location_1.locations.Boh, location_1.locations.Mun, [Army]),
    new MapEdge(location_1.locations.Boh, location_1.locations.Sil, [Army]),
    new MapEdge(location_1.locations.Boh, location_1.locations.Gal, [Army]),
    new MapEdge(location_1.locations.Boh, location_1.locations.Vie, [Army]),
    new MapEdge(location_1.locations.Boh, location_1.locations.Tyr, [Army]),
    // Bud
    new MapEdge(location_1.locations.Bud, location_1.locations.Vie, [Army]),
    new MapEdge(location_1.locations.Bud, location_1.locations.Gal, [Army]),
    new MapEdge(location_1.locations.Bud, location_1.locations.Rum, [Army]),
    new MapEdge(location_1.locations.Bud, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Bud, location_1.locations.Tri, [Army]),
    // Gal
    new MapEdge(location_1.locations.Gal, location_1.locations.War, [Army]),
    new MapEdge(location_1.locations.Gal, location_1.locations.Ukr, [Army]),
    new MapEdge(location_1.locations.Gal, location_1.locations.Rum, [Army]),
    new MapEdge(location_1.locations.Gal, location_1.locations.Vie, [Army]),
    // Tri
    new MapEdge(location_1.locations.Tri, location_1.locations.Tyr, [Army]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Vie, [Army]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Alb, [Army, Fleet]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Adr, [Fleet]),
    new MapEdge(location_1.locations.Tri, location_1.locations.Ven, [Army, Fleet]),
    // Tyr
    new MapEdge(location_1.locations.Tyr, location_1.locations.Mun, [Army]),
    new MapEdge(location_1.locations.Tyr, location_1.locations.Vie, [Army]),
    new MapEdge(location_1.locations.Tyr, location_1.locations.Ven, [Army]),
    new MapEdge(location_1.locations.Tyr, location_1.locations.Pie, [Army]),
    // Vie
    // Cly
    new MapEdge(location_1.locations.Cly, location_1.locations.NAt, [Fleet]),
    new MapEdge(location_1.locations.Cly, location_1.locations.Nrg, [Fleet]),
    new MapEdge(location_1.locations.Cly, location_1.locations.Edi, [Army, Fleet]),
    new MapEdge(location_1.locations.Cly, location_1.locations.Lvp, [Army, Fleet]),
    // Edi
    new MapEdge(location_1.locations.Edi, location_1.locations.Nrg, [Fleet]),
    new MapEdge(location_1.locations.Edi, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Edi, location_1.locations.Yor, [Army, Fleet]),
    new MapEdge(location_1.locations.Edi, location_1.locations.Lvp, [Army]),
    // Lvp
    new MapEdge(location_1.locations.Lvp, location_1.locations.Iri, [Fleet]),
    new MapEdge(location_1.locations.Lvp, location_1.locations.Yor, [Army]),
    new MapEdge(location_1.locations.Lvp, location_1.locations.Wal, [Army, Fleet]),
    new MapEdge(location_1.locations.Lvp, location_1.locations.NAt, [Fleet]),
    // Lon
    new MapEdge(location_1.locations.Lon, location_1.locations.Wal, [Army, Fleet]),
    new MapEdge(location_1.locations.Lon, location_1.locations.Yor, [Army, Fleet]),
    new MapEdge(location_1.locations.Lon, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Lon, location_1.locations.Eng, [Fleet]),
    // Wal
    new MapEdge(location_1.locations.Wal, location_1.locations.Iri, [Fleet]),
    new MapEdge(location_1.locations.Wal, location_1.locations.Yor, [Army]),
    new MapEdge(location_1.locations.Wal, location_1.locations.Eng, [Fleet]),
    // Yor
    new MapEdge(location_1.locations.Yor, location_1.locations.Nth, [Fleet]),
    // Bre
    new MapEdge(location_1.locations.Bre, location_1.locations.Eng, [Fleet]),
    new MapEdge(location_1.locations.Bre, location_1.locations.Pic, [Army, Fleet]),
    new MapEdge(location_1.locations.Bre, location_1.locations.Par, [Army]),
    new MapEdge(location_1.locations.Bre, location_1.locations.Gas, [Army, Fleet]),
    new MapEdge(location_1.locations.Bre, location_1.locations.Mid, [Fleet]),
    // Bur
    new MapEdge(location_1.locations.Bur, location_1.locations.Par, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Pic, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Bel, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Ruh, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Mun, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Mar, [Army]),
    new MapEdge(location_1.locations.Bur, location_1.locations.Gas, [Army]),
    // Gas
    new MapEdge(location_1.locations.Gas, location_1.locations.Mid, [Fleet]),
    new MapEdge(location_1.locations.Gas, location_1.locations.Par, [Army]),
    new MapEdge(location_1.locations.Gas, location_1.locations.Mar, [Army]),
    new MapEdge(location_1.locations.Gas, location_1.locations.Spa, [Army]),
    new MapEdge(location_1.locations.Gas, location_1.locations.Spa_NC, [Fleet]),
    // Mar
    new MapEdge(location_1.locations.Mar, location_1.locations.Spa, [Army]),
    new MapEdge(location_1.locations.Mar, location_1.locations.Spa_SC, [Fleet]),
    new MapEdge(location_1.locations.Mar, location_1.locations.GoL, [Fleet]),
    new MapEdge(location_1.locations.Mar, location_1.locations.Pie, [Army, Fleet]),
    // Par
    new MapEdge(location_1.locations.Par, location_1.locations.Pic, [Army]),
    // Pic
    new MapEdge(location_1.locations.Pic, location_1.locations.Eng, [Fleet]),
    new MapEdge(location_1.locations.Pic, location_1.locations.Bel, [Army, Fleet]),
    // Ber
    new MapEdge(location_1.locations.Ber, location_1.locations.Kie, [Army, Fleet]),
    new MapEdge(location_1.locations.Ber, location_1.locations.Bal, [Fleet]),
    new MapEdge(location_1.locations.Ber, location_1.locations.Pru, [Army, Fleet]),
    new MapEdge(location_1.locations.Ber, location_1.locations.Sil, [Army]),
    new MapEdge(location_1.locations.Ber, location_1.locations.Mun, [Army]),
    // Kie
    new MapEdge(location_1.locations.Kie, location_1.locations.Hel, [Fleet]),
    new MapEdge(location_1.locations.Kie, location_1.locations.Den, [Army, Fleet]),
    new MapEdge(location_1.locations.Kie, location_1.locations.Mun, [Army]),
    new MapEdge(location_1.locations.Kie, location_1.locations.Ruh, [Army]),
    new MapEdge(location_1.locations.Kie, location_1.locations.Hol, [Army, Fleet]),
    // Mun
    new MapEdge(location_1.locations.Mun, location_1.locations.Ruh, [Army]),
    new MapEdge(location_1.locations.Mun, location_1.locations.Sil, [Army]),
    // Pru
    new MapEdge(location_1.locations.Pru, location_1.locations.Bal, [Fleet]),
    new MapEdge(location_1.locations.Pru, location_1.locations.Lvn, [Army, Fleet]),
    new MapEdge(location_1.locations.Pru, location_1.locations.War, [Army]),
    new MapEdge(location_1.locations.Pru, location_1.locations.Sil, [Army]),
    // Ruh
    new MapEdge(location_1.locations.Ruh, location_1.locations.Bel, [Army]),
    new MapEdge(location_1.locations.Ruh, location_1.locations.Hol, [Army]),
    // Sil
    new MapEdge(location_1.locations.Sil, location_1.locations.War, [Army]),
    // Apu
    new MapEdge(location_1.locations.Apu, location_1.locations.Ven, [Army, Fleet]),
    new MapEdge(location_1.locations.Apu, location_1.locations.Adr, [Fleet]),
    new MapEdge(location_1.locations.Apu, location_1.locations.Ion, [Fleet]),
    new MapEdge(location_1.locations.Apu, location_1.locations.Nap, [Army, Fleet]),
    new MapEdge(location_1.locations.Apu, location_1.locations.Rom, [Army]),
    // Nap
    new MapEdge(location_1.locations.Nap, location_1.locations.Rom, [Army, Fleet]),
    new MapEdge(location_1.locations.Nap, location_1.locations.Ion, [Fleet]),
    new MapEdge(location_1.locations.Nap, location_1.locations.Tyn, [Fleet]),
    // Pie
    new MapEdge(location_1.locations.Pie, location_1.locations.Ven, [Army]),
    new MapEdge(location_1.locations.Pie, location_1.locations.Tus, [Army, Fleet]),
    new MapEdge(location_1.locations.Pie, location_1.locations.GoL, [Fleet]),
    // Rom
    new MapEdge(location_1.locations.Rom, location_1.locations.Tus, [Army, Fleet]),
    new MapEdge(location_1.locations.Rom, location_1.locations.Ven, [Army]),
    new MapEdge(location_1.locations.Rom, location_1.locations.Tyn, [Fleet]),
    // Tus
    new MapEdge(location_1.locations.Tus, location_1.locations.GoL, [Fleet]),
    new MapEdge(location_1.locations.Tus, location_1.locations.Ven, [Army]),
    new MapEdge(location_1.locations.Tus, location_1.locations.Tyn, [Fleet]),
    // Ven
    new MapEdge(location_1.locations.Ven, location_1.locations.Adr, [Fleet]),
    // Fin
    new MapEdge(location_1.locations.Fin, location_1.locations.Nwy, [Army]),
    new MapEdge(location_1.locations.Fin, location_1.locations.Swe, [Army, Fleet]),
    new MapEdge(location_1.locations.Fin, location_1.locations.Bot, [Fleet]),
    new MapEdge(location_1.locations.Fin, location_1.locations.StP, [Army]),
    new MapEdge(location_1.locations.Fin, location_1.locations.StP_SC, [Fleet]),
    // Lvn
    new MapEdge(location_1.locations.Lvn, location_1.locations.Bot, [Fleet]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.StP, [Army]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.StP_SC, [Fleet]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.Mos, [Army]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.War, [Army]),
    new MapEdge(location_1.locations.Lvn, location_1.locations.Bal, [Fleet]),
    // Mos
    new MapEdge(location_1.locations.Mos, location_1.locations.StP, [Army]),
    new MapEdge(location_1.locations.Mos, location_1.locations.Sev, [Army]),
    new MapEdge(location_1.locations.Mos, location_1.locations.Ukr, [Army]),
    new MapEdge(location_1.locations.Mos, location_1.locations.War, [Army]),
    // Sev
    new MapEdge(location_1.locations.Sev, location_1.locations.Ukr, [Army]),
    new MapEdge(location_1.locations.Sev, location_1.locations.Arm, [Army, Fleet]),
    new MapEdge(location_1.locations.Sev, location_1.locations.Bla, [Fleet]),
    new MapEdge(location_1.locations.Sev, location_1.locations.Rum, [Army, Fleet]),
    // StP
    new MapEdge(location_1.locations.StP, location_1.locations.Nwy, [Army]),
    // StP/NC
    new MapEdge(location_1.locations.StP_NC, location_1.locations.Nwy, [Fleet]),
    new MapEdge(location_1.locations.StP_NC, location_1.locations.Bar, [Fleet]),
    // StP/SC
    new MapEdge(location_1.locations.StP_SC, location_1.locations.Bot, [Fleet]),
    // Ukr
    new MapEdge(location_1.locations.Ukr, location_1.locations.War, [Army]),
    new MapEdge(location_1.locations.Ukr, location_1.locations.Rum, [Army]),
    // War
    // Ank
    new MapEdge(location_1.locations.Ank, location_1.locations.Bla, [Fleet]),
    new MapEdge(location_1.locations.Ank, location_1.locations.Arm, [Army, Fleet]),
    new MapEdge(location_1.locations.Ank, location_1.locations.Smy, [Army]),
    new MapEdge(location_1.locations.Ank, location_1.locations.Con, [Army, Fleet]),
    // Arm
    new MapEdge(location_1.locations.Arm, location_1.locations.Bla, [Fleet]),
    new MapEdge(location_1.locations.Arm, location_1.locations.Syr, [Army]),
    new MapEdge(location_1.locations.Arm, location_1.locations.Smy, [Army]),
    // Con
    new MapEdge(location_1.locations.Con, location_1.locations.Bul, [Army]),
    new MapEdge(location_1.locations.Con, location_1.locations.Bul_EC, [Fleet]),
    new MapEdge(location_1.locations.Con, location_1.locations.Bul_SC, [Fleet]),
    new MapEdge(location_1.locations.Con, location_1.locations.Bla, [Fleet]),
    new MapEdge(location_1.locations.Con, location_1.locations.Smy, [Army, Fleet]),
    new MapEdge(location_1.locations.Con, location_1.locations.Aeg, [Fleet]),
    // Smy
    new MapEdge(location_1.locations.Smy, location_1.locations.Syr, [Army, Fleet]),
    new MapEdge(location_1.locations.Smy, location_1.locations.Eas, [Fleet]),
    new MapEdge(location_1.locations.Smy, location_1.locations.Aeg, [Fleet]),
    // Syr
    new MapEdge(location_1.locations.Syr, location_1.locations.Eas, [Fleet]),
    // Alb
    new MapEdge(location_1.locations.Alb, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Alb, location_1.locations.Gre, [Army, Fleet]),
    new MapEdge(location_1.locations.Alb, location_1.locations.Ion, [Fleet]),
    // Bel
    new MapEdge(location_1.locations.Bel, location_1.locations.Eng, [Fleet]),
    new MapEdge(location_1.locations.Bel, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Bel, location_1.locations.Hol, [Army, Fleet]),
    // Bul
    new MapEdge(location_1.locations.Bul, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Bul, location_1.locations.Rum, [Army]),
    new MapEdge(location_1.locations.Bul, location_1.locations.Gre, [Army]),
    // Bul/EC
    new MapEdge(location_1.locations.Bul_EC, location_1.locations.Rum, [Fleet]),
    new MapEdge(location_1.locations.Bul_EC, location_1.locations.Bla, [Fleet]),
    // Bul/SC
    new MapEdge(location_1.locations.Bul_SC, location_1.locations.Gre, [Fleet]),
    new MapEdge(location_1.locations.Bul_SC, location_1.locations.Aeg, [Fleet]),
    // Den
    new MapEdge(location_1.locations.Den, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Den, location_1.locations.Ska, [Fleet]),
    new MapEdge(location_1.locations.Den, location_1.locations.Bal, [Fleet]),
    new MapEdge(location_1.locations.Den, location_1.locations.Hel, [Fleet]),
    // Gre
    new MapEdge(location_1.locations.Gre, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Gre, location_1.locations.Aeg, [Fleet]),
    new MapEdge(location_1.locations.Gre, location_1.locations.Ion, [Fleet]),
    // Hol
    new MapEdge(location_1.locations.Hol, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Hol, location_1.locations.Hel, [Fleet]),
    // Nwy
    new MapEdge(location_1.locations.Nwy, location_1.locations.Nrg, [Fleet]),
    new MapEdge(location_1.locations.Nwy, location_1.locations.Bar, [Fleet]),
    new MapEdge(location_1.locations.Nwy, location_1.locations.Swe, [Army, Fleet]),
    new MapEdge(location_1.locations.Nwy, location_1.locations.Ska, [Fleet]),
    new MapEdge(location_1.locations.Nwy, location_1.locations.Nth, [Fleet]),
    // Por
    new MapEdge(location_1.locations.Por, location_1.locations.Mid, [Fleet]),
    new MapEdge(location_1.locations.Por, location_1.locations.Spa, [Army]),
    new MapEdge(location_1.locations.Por, location_1.locations.Spa_NC, [Fleet]),
    new MapEdge(location_1.locations.Por, location_1.locations.Spa_SC, [Fleet]),
    // Rum
    new MapEdge(location_1.locations.Rum, location_1.locations.Ser, [Army]),
    new MapEdge(location_1.locations.Rum, location_1.locations.Bla, [Fleet]),
    // Ser
    // Spa
    // Spa/NC
    new MapEdge(location_1.locations.Spa_NC, location_1.locations.Mid, [Fleet]),
    // Spa/SC
    new MapEdge(location_1.locations.Spa_SC, location_1.locations.Mid, [Fleet]),
    new MapEdge(location_1.locations.Spa_SC, location_1.locations.GoL, [Fleet]),
    new MapEdge(location_1.locations.Spa_SC, location_1.locations.Wes, [Fleet]),
    // Swe
    new MapEdge(location_1.locations.Swe, location_1.locations.Ska, [Fleet]),
    new MapEdge(location_1.locations.Swe, location_1.locations.Bal, [Fleet]),
    new MapEdge(location_1.locations.Swe, location_1.locations.Bot, [Fleet]),
    new MapEdge(location_1.locations.Swe, location_1.locations.Den, [Army, Fleet]),
    // Tun
    new MapEdge(location_1.locations.Tun, location_1.locations.Wes, [Fleet]),
    new MapEdge(location_1.locations.Tun, location_1.locations.Tyn, [Fleet]),
    new MapEdge(location_1.locations.Tun, location_1.locations.Ion, [Fleet]),
    new MapEdge(location_1.locations.Tun, location_1.locations.NAf, [Army, Fleet]),
    // NAf
    new MapEdge(location_1.locations.NAf, location_1.locations.Wes, [Fleet]),
    new MapEdge(location_1.locations.NAf, location_1.locations.Mid, [Fleet]),
    // Adr
    new MapEdge(location_1.locations.Adr, location_1.locations.Ion, [Fleet]),
    // Aeg
    new MapEdge(location_1.locations.Aeg, location_1.locations.Eas, [Fleet]),
    new MapEdge(location_1.locations.Aeg, location_1.locations.Ion, [Fleet]),
    // Bal
    new MapEdge(location_1.locations.Bal, location_1.locations.Bot, [Fleet]),
    // Bar
    new MapEdge(location_1.locations.Bar, location_1.locations.Nrg, [Fleet]),
    // Bla
    // Eas
    new MapEdge(location_1.locations.Eas, location_1.locations.Ion, [Fleet]),
    // Eng
    new MapEdge(location_1.locations.Eng, location_1.locations.Iri, [Fleet]),
    new MapEdge(location_1.locations.Eng, location_1.locations.Nth, [Fleet]),
    new MapEdge(location_1.locations.Eng, location_1.locations.Mid, [Fleet]),
    // Bot
    // GoL
    new MapEdge(location_1.locations.GoL, location_1.locations.Tyn, [Fleet]),
    new MapEdge(location_1.locations.GoL, location_1.locations.Wes, [Fleet]),
    // Hel
    new MapEdge(location_1.locations.Hel, location_1.locations.Nth, [Fleet]),
    // Ion
    new MapEdge(location_1.locations.Ion, location_1.locations.Tyn, [Fleet]),
    // Iri
    new MapEdge(location_1.locations.Iri, location_1.locations.NAt, [Fleet]),
    new MapEdge(location_1.locations.Iri, location_1.locations.Mid, [Fleet]),
    // Mid
    new MapEdge(location_1.locations.Mid, location_1.locations.NAf, [Fleet]),
    new MapEdge(location_1.locations.Mid, location_1.locations.Wes, [Fleet]),
    new MapEdge(location_1.locations.Mid, location_1.locations.NAt, [Fleet]),
    // NAt
    new MapEdge(location_1.locations.NAt, location_1.locations.Nrg, [Fleet]),
    // Nth
    new MapEdge(location_1.locations.Nth, location_1.locations.Nrg, [Fleet]),
    // Nrg
    // Ska
    // Tyn
    new MapEdge(location_1.locations.Tyn, location_1.locations.Wes, [Fleet])
    // Wes
]));

},{"./../board":2,"./../graph":3,"./../standardRule":12,"./location":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Power;
(function (Power) {
    Power[Power["Austria"] = 1] = "Austria";
    Power[Power["England"] = 2] = "England";
    Power[Power["France"] = 3] = "France";
    Power[Power["Germany"] = 4] = "Germany";
    Power[Power["Italy"] = 5] = "Italy";
    Power[Power["Russia"] = 6] = "Russia";
    Power[Power["Turkey"] = 7] = "Turkey";
})(Power = exports.Power || (exports.Power = {}));

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Data = require("./standardRule/data");
const OrderModule = require("./standardRule/order");
const ErrorModule = require("./standardRule/error");
const Types = require("./standardRule/types");
const UtilsModule = require("./standardRule/utils");
const HelperModule = require("./standardRule/helper");
const RuleModule = require("./standardRule/rule");
var standardRule;
(function (standardRule) {
    standardRule.Location = Types.Location;
    standardRule.Unit = Types.Unit;
    standardRule.DiplomacyMap = Types.DiplomacyMap;
    standardRule.Board = Types.Board;
    standardRule.MilitaryBranch = Data.MilitaryBranch;
    standardRule.Phase = Data.Phase;
    standardRule.State = Data.State;
    standardRule.Dislodged = Data.Dislodged;
    standardRule.ProvinceStatus = Data.ProvinceStatus;
    standardRule.Result = Data.Result;
    var Order;
    (function (Order_1) {
        Order_1.OrderType = OrderModule.OrderType;
        Order_1.Order = OrderModule.Order;
        Order_1.Hold = OrderModule.Hold;
        Order_1.Move = OrderModule.Move;
        Order_1.Support = OrderModule.Support;
        Order_1.Convoy = OrderModule.Convoy;
        Order_1.Retreat = OrderModule.Retreat;
        Order_1.Disband = OrderModule.Disband;
        Order_1.Build = OrderModule.Build;
    })(Order = standardRule.Order || (standardRule.Order = {}));
    var Error;
    (function (Error_1) {
        Error_1.Error = ErrorModule.Error;
        Error_1.PowerWithProblem = ErrorModule.PowerWithProblem;
        Error_1.UnmovableLocation = ErrorModule.UnmovableLocation;
        Error_1.UnsupportableLocation = ErrorModule.UnsupportableLocation;
        Error_1.UnconvoyableLocation = ErrorModule.UnconvoyableLocation;
        Error_1.UnbuildableLocation = ErrorModule.UnbuildableLocation;
        Error_1.UnitNotExisted = ErrorModule.UnitNotExisted;
        Error_1.CannotBeOrdered = ErrorModule.CannotBeOrdered;
        Error_1.InvalidPhase = ErrorModule.InvalidPhase;
        Error_1.SeveralOrders = ErrorModule.SeveralOrders;
        Error_1.OrderNotExisted = ErrorModule.OrderNotExisted;
    })(Error = standardRule.Error || (standardRule.Error = {}));
    standardRule.Utils = UtilsModule.Utils;
    standardRule.Helper = HelperModule.Helper;
    standardRule.Rule = RuleModule.Rule;
})(standardRule = exports.standardRule || (exports.standardRule = {}));

},{"./standardRule/data":16,"./standardRule/error":17,"./standardRule/helper":18,"./standardRule/order":25,"./standardRule/rule":29,"./standardRule/types":30,"./standardRule/utils":31}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
class BuildOrderGenerator {
    ordersToSkipPhase(board) {
        const numberOfSupplyCenters = utils_1.Utils.numberOfSupplyCenters(board);
        const canSkip = [...board.map.powers].every(power => {
            const numOfUnits = ([...board.units].filter(unit => unit.power === power)).length;
            const numOfSupply = numberOfSupplyCenters.get(power) || 0;
            return (numOfUnits === numOfSupply) || (numOfSupply === 0);
        });
        if (canSkip) {
            const orders = new Set();
            board.map.powers.forEach(power => {
                const units = [...board.units].filter(unit => unit.power === power);
                const numOfSupply = numberOfSupplyCenters.get(power) || 0;
                if (numOfSupply === 0) {
                    units.map(unit => new order_1.Disband(unit)).forEach(o => orders.add(o));
                }
            });
            return orders;
        }
        else {
            return null;
        }
    }
    defaultOrderOf(board, unit) {
        return null;
    }
}
exports.BuildOrderGenerator = BuildOrderGenerator;

},{"./order":25,"./utils":31}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const types_1 = require("./types");
const order_1 = require("./order");
const board_1 = require("./../board");
const rule_1 = require("./../rule");
const util_1 = require("./../util");
const { Province } = board_1.board;
const { Executed } = rule_1.rule;
const { Success } = util_1.util;
const Movement = data_1.Phase.Movement;
class BuildResolver {
    resolve(board, orders) {
        const disbands = [...orders].filter(order => order.tpe === order_1.OrderType.Disband);
        const builds = [...orders].filter(order => order.tpe === order_1.OrderType.Build);
        const newUnits = new Set([...board.units]);
        disbands.forEach(d => newUnits.delete(d.unit));
        builds.forEach(b => newUnits.add(b.unit));
        const newState = new data_1.State(board.state.turn.nextTurn(), Movement);
        const occupationStatuses = [...board.provinceStatuses]
            .filter(elem => elem[1].occupied)
            .map(elem => {
            if (elem[1].standoff) {
                return [elem[0], new data_1.ProvinceStatus(elem[1].occupied, false)];
            }
            else {
                return elem;
            }
        });
        const newBoard = new types_1.Board(board.map, newState, newUnits, [], occupationStatuses);
        const orderResults = [...orders].map(order => new Executed(order, data_1.Result.Success));
        return new Success(new types_1.ResolvedResult(newBoard, orderResults, false));
    }
}
exports.BuildResolver = BuildResolver;

},{"./../board":2,"./../rule":5,"./../util":32,"./data":16,"./order":25,"./types":30}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
const Error = require("./error");
class BuildValidator {
    /**
     * @param stringify Stringify instances of Power
     */
    constructor() { }
    unitsRequiringOrder(board) {
        return new Set();
    }
    errorOfOrder(board, order) {
        const numberOfSupplyCenters = utils_1.Utils.numberOfSupplyCenters(board);
        switch (order.tpe) {
            case order_1.OrderType.Build:
                if ([...board.units].some(unit => unit.location.province === order.unit.location.province)) {
                    return new Error.UnbuildableLocation(order.unit);
                }
                else if (order.unit.location.province.homeOf !== order.unit.power) {
                    return new Error.UnbuildableLocation(order.unit);
                }
                else if (!order.unit.location.province.isSupplyCenter) {
                    return new Error.UnbuildableLocation(order.unit);
                }
                else {
                    const status = board.provinceStatuses.get(order.unit.location.province);
                    if (!status || status.occupied !== order.unit.power) {
                        return new Error.UnbuildableLocation(order.unit);
                    }
                }
                break;
            case order_1.OrderType.Disband:
                if (!board.units.has(order.unit)) {
                    return new Error.UnitNotExisted(order.unit);
                }
                const numOfUnits = ([...board.units].filter(unit => unit.power === order.unit.power)).length;
                const numOfSupply = numberOfSupplyCenters.get(order.unit.power) || 0;
                if (numOfUnits <= numOfSupply) {
                    return new Error.PowerWithProblem(order.unit.power);
                }
                break;
            default:
                return new Error.InvalidPhase(order);
        }
        return null;
    }
    errorOfOrders(board, orders) {
        const numberOfSupplyCenters = utils_1.Utils.numberOfSupplyCenters(board);
        const power = [...board.map.powers].find(power => {
            const numOfUnits = ([...board.units].filter(unit => unit.power === power)).length;
            const numOfSupply = numberOfSupplyCenters.get(power) || 0;
            const diffs = [...orders].map(order => {
                if (order.tpe === order_1.OrderType.Build && order.unit.power === power) {
                    return 1;
                }
                else if (order.tpe === order_1.OrderType.Disband && order.unit.power === power) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            const diff = diffs.reduce((prev, curr) => prev + curr, 0);
            return (numOfUnits + diff) > numOfSupply;
        });
        if (power) {
            return new Error.PowerWithProblem(power);
        }
        return null;
    }
}
exports.BuildValidator = BuildValidator;

},{"./error":17,"./order":25,"./utils":31}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MilitaryBranch;
(function (MilitaryBranch) {
    MilitaryBranch[MilitaryBranch["Army"] = 1] = "Army";
    MilitaryBranch[MilitaryBranch["Fleet"] = 2] = "Fleet";
})(MilitaryBranch = exports.MilitaryBranch || (exports.MilitaryBranch = {}));
var Phase;
(function (Phase) {
    Phase[Phase["Movement"] = 1] = "Movement";
    Phase[Phase["Retreat"] = 2] = "Retreat";
    Phase[Phase["Build"] = 3] = "Build";
})(Phase = exports.Phase || (exports.Phase = {}));
class State {
    constructor(turn, phase) {
        this.turn = turn;
        this.phase = phase;
    }
}
exports.State = State;
/**
 * Status that an unit is dislodged
 */
class Dislodged {
    /**
     * @param attackedFrom - The province that the unit is attacked from
     */
    constructor(attackedFrom) {
        this.attackedFrom = attackedFrom;
    }
}
exports.Dislodged = Dislodged;
/**
 * Status of the province
 */
class ProvinceStatus {
    /**
     * @param occupied
     *    The power that occupies the province. The province is neutral if this property is null
     * @param standoff The flag whether standoff is occurred or not
     */
    constructor(occupied, standoff) {
        this.occupied = occupied;
        this.standoff = standoff;
    }
}
exports.ProvinceStatus = ProvinceStatus;
var Result;
(function (Result) {
    Result[Result["Success"] = 1] = "Success";
    Result[Result["Failed"] = 2] = "Failed";
    Result[Result["Dislodged"] = 3] = "Dislodged";
    Result[Result["Bounced"] = 4] = "Bounced";
    Result[Result["Cut"] = 5] = "Cut";
    Result[Result["Standoff"] = 6] = "Standoff";
    Result[Result["NoCorrespondingOrder"] = 7] = "NoCorrespondingOrder";
})(Result = exports.Result || (exports.Result = {}));

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Errors while resolving orders
  * @typeparam Detail The detail of the error
 */
class Error {
}
exports.Error = Error;
/**
 * Error that a power does not satisify conditions.
 * (e.g., A power does not have enough number of supply centers.)
 */
class PowerWithProblem extends Error {
    constructor(power) {
        super();
        this.power = power;
    }
}
exports.PowerWithProblem = PowerWithProblem;
/**
 * Error that a unit tries to move an unmovable location.
 */
class UnmovableLocation extends Error {
    constructor(unit, destination) {
        super();
        this.unit = unit;
        this.destination = destination;
    }
}
exports.UnmovableLocation = UnmovableLocation;
/**
 * Error that a unit tries to suppor an unsupportable order.
 */
class UnsupportableLocation extends Error {
    constructor(unit, destination) {
        super();
        this.unit = unit;
        this.destination = destination;
    }
}
exports.UnsupportableLocation = UnsupportableLocation;
/**
 * Error that a unit tries to convoy an invalid order.
 */
class UnconvoyableLocation extends Error {
    constructor(unit, destination) {
        super();
        this.unit = unit;
        this.destination = destination;
    }
}
exports.UnconvoyableLocation = UnconvoyableLocation;
/**
 * Error that a power tries to build an unbuildable location.
 */
class UnbuildableLocation extends Error {
    constructor(unit) {
        super();
        this.unit = unit;
    }
}
exports.UnbuildableLocation = UnbuildableLocation;
/**
 * Error that a unit does not existed.
 */
class UnitNotExisted extends Error {
    constructor(unit) {
        super();
        this.unit = unit;
    }
}
exports.UnitNotExisted = UnitNotExisted;
/**
 * Error that a player writes an invalid order.
 */
class CannotBeOrdered extends Error {
    constructor(order) {
        super();
        this.order = order;
    }
}
exports.CannotBeOrdered = CannotBeOrdered;
/**
 * Error that a player writes an invalid order.
 */
class InvalidPhase extends Error {
    constructor(order) {
        super();
        this.order = order;
    }
}
exports.InvalidPhase = InvalidPhase;
class SeveralOrders extends Error {
    constructor(units) {
        super();
        this.units = new Set([...units]);
    }
}
exports.SeveralOrders = SeveralOrders;
class OrderNotExisted extends Error {
    constructor(unit) {
        super();
        this.unit = unit;
    }
}
exports.OrderNotExisted = OrderNotExisted;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./../board");
const types_1 = require("./types");
const data_1 = require("./data");
const Order = require("./order");
const { Province } = board_1.board;
class UnitForStandardRule {
    constructor(unit) {
        this.unit = unit;
    }
    hold() {
        return new Order.Hold(this.unit);
    }
    move(destination) {
        return new Order.Move(this.unit, destination);
    }
    moveViaConvoy(destination) {
        return new Order.Move(this.unit, destination, true);
    }
    support(target) {
        return new Order.Support(this.unit, target);
    }
    convoy(target) {
        return new Order.Convoy(this.unit, target);
    }
    retreat(destination) {
        return new Order.Retreat(this.unit, destination);
    }
    disband() {
        return new Order.Disband(this.unit);
    }
    build() {
        return new Order.Build(this.unit);
    }
}
exports.UnitForStandardRule = UnitForStandardRule;
/**
 * Helper for creating orders of the standard rule
 * ```
 * const $$ = new Helper(board)
 * const $ = // The dictionary of the locations
 * $$.U($.Lon).move($.Nth)
 *
 * $$.U($.Mar).support($$.A($.Par).move($.Bur))
 *
 * $$.F($.Lon).build()
 *
 * $$.U($.Nrg).disband()
 * ```
 */
class Helper {
    constructor(board) {
        this.board = board;
    }
    getUnit(militaryBranch, location) {
        function checkMilitaryBranch(tgt) {
            if (militaryBranch !== null) {
                return tgt === militaryBranch;
            }
            else {
                return true;
            }
        }
        if (this.board.state.phase === data_1.Phase.Movement) {
            const u = [...this.board.units].find(unit => {
                return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch);
            });
            if (u) {
                return u;
            }
            else {
                throw `Cannot find unit: ${location}`;
            }
        }
        else if (this.board.state.phase === data_1.Phase.Retreat) {
            const u = [...this.board.units].find(unit => {
                return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch) && this.board.unitStatuses.has(unit);
            });
            if (u) {
                return u;
            }
            else {
                throw `Cannot find unit: ${location}`;
            }
        }
        else {
            const unit = [...this.board.units].find(unit => {
                return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch);
            });
            if (!unit) {
                if ((militaryBranch !== null) && location.province.homeOf) {
                    return new types_1.Unit(militaryBranch, location, location.province.homeOf);
                }
                else {
                    throw `Cannot find unit: ${location}`;
                }
            }
            else {
                return unit;
            }
        }
    }
    A(location) {
        return new UnitForStandardRule(this.getUnit(data_1.MilitaryBranch.Army, location));
    }
    F(location) {
        return new UnitForStandardRule(this.getUnit(data_1.MilitaryBranch.Fleet, location));
    }
    U(location) {
        return new UnitForStandardRule(this.getUnit(null, location));
    }
}
exports.Helper = Helper;

},{"./../board":2,"./data":16,"./order":25,"./types":30}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("./order");
class MovementOrderGenerator {
    defaultOrderOf(board, unit) {
        return new order_1.Hold(unit);
    }
    ordersToSkipPhase(board) {
        if (board.units.size === 0) {
            return new Set();
        }
        else {
            return null;
        }
    }
}
exports.MovementOrderGenerator = MovementOrderGenerator;

},{"./order":25}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const utils_1 = require("./utils");
const order_1 = require("./order");
const { Fleet } = data_1.MilitaryBranch;
class MovementOrderGroup {
    constructor(target, relatedOrders) {
        this.target = target;
        this.relatedOrders = new Set([...relatedOrders]);
    }
    validSupports() {
        return new Set([...this.relatedOrders].filter(order => {
            return (order.order.tpe === order_1.OrderType.Support) &&
                (order.getResult() !== data_1.Result.Dislodged) && (order.getResult() !== data_1.Result.Cut) &&
                (order.getResult() !== data_1.Result.NoCorrespondingOrder);
        }).map(order => order.order));
    }
    power() {
        return 1 + this.validSupports().size;
    }
    route(map) {
        if (this.target.order instanceof order_1.Move) {
            const units = [...this.relatedOrders].filter(order => {
                return (order.order.tpe === order_1.OrderType.Convoy) &&
                    ((order.getResult() === data_1.Result.Failed) || (order.getResult() === data_1.Result.Success));
            }).map(order => order.order.unit);
            if (utils_1.Utils.isMovableViaSea(map, this.target.order.unit.location.province, this.target.order.destination.province, new Set(units))) {
                return { viaConvoy: true };
            }
            else if (map.movableLocationsOf(this.target.order.unit.location, this.target.order.unit.militaryBranch).has(this.target.order.destination)) {
                return { viaConvoy: false };
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}
exports.MovementOrderGroup = MovementOrderGroup;

},{"./data":16,"./order":25,"./utils":31}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const order_1 = require("./order");
class MovementOrderWithResult {
    constructor(order) {
        this.order = order;
        this.result = null;
    }
    getResult() {
        return this.result;
    }
    setResult(result) {
        if (this.order instanceof order_1.Hold) {
            if (result === data_1.Result.Dislodged || result === data_1.Result.Success) {
                this.result = result;
            }
        }
        else if (this.order instanceof order_1.Move) {
            if (result === data_1.Result.Dislodged || result === data_1.Result.Success) {
                if (this.result !== data_1.Result.Success) {
                    this.result = result;
                }
            }
            else if (result === data_1.Result.Failed || result === data_1.Result.Bounced) {
                if (this.result !== data_1.Result.Dislodged) {
                    this.result = result;
                }
            }
        }
        else if (this.order instanceof order_1.Support) {
            if (result === data_1.Result.Dislodged) {
                this.result = result;
            }
            else if (result === data_1.Result.Failed || result === data_1.Result.Success) {
                if ((this.result !== data_1.Result.Dislodged) &&
                    (this.result !== data_1.Result.Cut) &&
                    (this.result !== data_1.Result.NoCorrespondingOrder)) {
                    this.result = result;
                }
            }
            else if (result === data_1.Result.Cut) {
                if (this.result !== data_1.Result.Dislodged) {
                    this.result = result;
                }
            }
            else if (result === data_1.Result.NoCorrespondingOrder) {
                this.result = result;
            }
        }
        else if (this.order instanceof order_1.Convoy) {
            if (result === data_1.Result.Dislodged) {
                this.result = result;
            }
            else if (result === data_1.Result.Failed || result === data_1.Result.Success) {
                if (this.result !== data_1.Result.Dislodged && this.result !== data_1.Result.NoCorrespondingOrder) {
                    this.result = result;
                }
            }
            else if (result === data_1.Result.NoCorrespondingOrder) {
                this.result = result;
            }
        }
        else {
            throw { err: `Invalid order: ${this.order}` };
        }
    }
}
exports.MovementOrderWithResult = MovementOrderWithResult;

},{"./data":16,"./order":25}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const order_1 = require("./order");
const types_1 = require("./types");
const movement_order_with_result_1 = require("./movement-order-with-result");
const movement_order_group_1 = require("./movement-order-group");
const order_dependency_1 = require("./order-dependency");
const board_1 = require("./../board");
const rule_1 = require("./../rule");
const util_1 = require("./../util");
const { Province } = board_1.board;
const { Executed } = rule_1.rule;
const { Success } = util_1.util;
const { Retreat } = data_1.Phase;
class TmpMovementOrderGroup {
    constructor(target, relatedOrders) {
        this.target = target;
        this.relatedOrders = relatedOrders;
    }
}
class MovementResolver {
    resolve(board, orders) {
        const ordersWithResult = [...orders].map(order => new movement_order_with_result_1.MovementOrderWithResult(order));
        const movesViaConvoy = new Set();
        const dislodgedFrom = new Map();
        function canBounce(order1, order2) {
            const o1 = order1.order;
            const o2 = order2.order;
            if (o1 instanceof order_1.Move && o2 instanceof order_1.Move) {
                if (o1.destination.province === o2.destination.province) {
                    return true;
                }
                else if ((o1.destination.province === o2.unit.location.province) &&
                    (o2.destination.province === o1.unit.location.province)) {
                    if (movesViaConvoy.has(order1.order) || movesViaConvoy.has(order2.order)) {
                        return order1.getResult() === data_1.Result.Bounced || order2.getResult() === data_1.Result.Bounced;
                    }
                    else {
                        return true;
                    }
                }
                else if (o1.destination.province === o2.unit.location.province) {
                    return order2.getResult() === data_1.Result.Bounced;
                }
                else if (o2.destination.province === o1.unit.location.province) {
                    return order1.getResult() === data_1.Result.Bounced;
                }
                else {
                    return false;
                }
            }
            else if (o1 instanceof order_1.Move) {
                return o1.destination.province === order2.order.unit.location.province;
            }
            else if (o2 instanceof order_1.Move) {
                return o2.destination.province === order1.order.unit.location.province;
            }
            else {
                return false;
            }
        }
        // 1. Divide orders into groups
        const province2TmpOrderGroup = new Map();
        function getOrderGroup(province, location) {
            const groups = province2TmpOrderGroup.get(province) || new Map();
            const group = groups.get(location) || new TmpMovementOrderGroup(null, new Set());
            groups.set(location, group);
            province2TmpOrderGroup.set(province, groups);
            return group;
        }
        ordersWithResult.forEach(order => {
            const group = getOrderGroup(order.order.unit.location.province, order.order.unit.location);
            group.target = order;
            const o = order.order;
            if (o instanceof order_1.Hold) {
            }
            else if (o instanceof order_1.Move) {
                const o2 = o;
                const group2 = getOrderGroup(o2.destination.province, o2.unit.location);
                group2.target = order;
            }
            else if (o instanceof order_1.Support) {
                const o2 = o;
                const group2 = getOrderGroup(o2.destination.province, o2.target.unit.location);
                group2.relatedOrders.add(order);
            }
            else if (o instanceof order_1.Convoy) {
                const o2 = o;
                const group2 = getOrderGroup(o2.target.destination.province, o2.target.unit.location);
                group2.relatedOrders.add(order);
            }
        });
        // 2. Exclude support or convoy orders that have no corresponding orders
        for (let elem of [...province2TmpOrderGroup]) {
            for (let elem2 of [...elem[1]]) {
                if (elem2[1].target === null) {
                    elem2[1].relatedOrders.forEach((order) => {
                        order.setResult(data_1.Result.NoCorrespondingOrder);
                    });
                    elem[1].delete(elem2[0]);
                }
                else {
                    elem2[1].relatedOrders.forEach((order) => {
                        if (order.order instanceof order_1.Support || order.order instanceof order_1.Convoy) {
                            const targetType1 = order.order.target.tpe;
                            const targetType2 = elem2[1].target.order.tpe;
                            switch (targetType2) {
                                case order_1.OrderType.Move:
                                    if (targetType1 !== order_1.OrderType.Move) {
                                        order.setResult(data_1.Result.NoCorrespondingOrder);
                                    }
                                    break;
                                default:
                                    if (targetType1 !== order_1.OrderType.Hold) {
                                        order.setResult(data_1.Result.NoCorrespondingOrder);
                                    }
                                    break;
                            }
                        }
                    });
                }
            }
        }
        const province2OrderGroups = new Map();
        province2TmpOrderGroup.forEach((groups, province) => {
            const newGroups = [...groups.values()].map(x => {
                return new movement_order_group_1.MovementOrderGroup(x.target, x.relatedOrders);
            });
            province2OrderGroups.set(province, new Set([...newGroups]));
        });
        // 3. Generate the dependency graph
        let graph = new order_dependency_1.OrderDependency(ordersWithResult).graph;
        // 4. Resolve orders following dependency
        while (graph.nodes.size > 0) {
            const target = [...graph.nodes].find(node => graph.incomingNodesOf(node).size === 0);
            if (!target) {
                throw "Internal Error";
            }
            graph = graph.deleteNode(target);
            const provinces = target;
            // Get all related order groups
            const relatedGroups = new Map([...provinces].map((province) => {
                const groups = province2OrderGroups.get(province) || new Set();
                return ([province, new Set([...groups])]);
            }));
            // Resolve each province
            while (relatedGroups.size !== 0) {
                // 1. Resolve cutting support
                relatedGroups.forEach(groups => {
                    groups.forEach(group => {
                        const o = group.target.order;
                        if (o instanceof order_1.Support) {
                            const destination = o.destination;
                            const isCut = [...groups].some(group => {
                                const o2 = group.target.order;
                                if (o2 instanceof order_1.Move) {
                                    return ((group.target.order.unit.location.province !== destination.province) &&
                                        (group.route(board.map)) &&
                                        (o.unit.power !== group.target.order.unit.power)) || false;
                                }
                                return false;
                            });
                            if (isCut) {
                                group.target.setResult(data_1.Result.Cut);
                            }
                        }
                    });
                });
                // 2. Sort provinces by related units
                const sortedGroups = [...relatedGroups].sort((a, b) => {
                    const hasG1Convoy = [...a[1]].some(group => {
                        return group.target.order.tpe === order_1.OrderType.Convoy;
                    });
                    const hasG2Convoy = [...b[1]].some(group => {
                        return group.target.order.tpe === order_1.OrderType.Convoy;
                    });
                    if (hasG1Convoy) {
                        return -1;
                    }
                    else if (hasG2Convoy) {
                        return 1;
                    }
                    else {
                        const pow1 = Math.max(...[...a[1]].map(group => group.power()));
                        const pow2 = Math.max(...[...b[1]].map(group => group.power()));
                        return (pow1 > pow2) ? -1 : 1;
                    }
                });
                // 3. Check whether move orders can be conducted or not
                const failedMoves = new Set();
                sortedGroups.forEach(elem => {
                    const [province, groups] = elem;
                    groups.forEach(group => {
                        const o = group.target.order;
                        if ((o instanceof order_1.Move) &&
                            (province === o.destination.province)) {
                            const route = group.route(board.map);
                            if (route) {
                                if (route.viaConvoy) {
                                    movesViaConvoy.add(group.target.order);
                                }
                            }
                            else {
                                failedMoves.add(group);
                            }
                        }
                    });
                });
                if (sortedGroups.length === 0) {
                    continue;
                }
                // 4. Resolve the province, and delete it from the buffer
                const [province, groups] = sortedGroups[0];
                relatedGroups.delete(province);
                // 5. Resolve and exclude failed move orders
                groups.forEach(group => {
                    if (failedMoves.has(group)) {
                        group.target.setResult(data_1.Result.Failed);
                        group.relatedOrders.forEach(o => { o.setResult(data_1.Result.Failed); });
                        groups.delete(group);
                    }
                });
                const defenceOpt = [...groups].find(group => {
                    return group.target.order.unit.location.province === province;
                });
                const offence = new Set([...groups]);
                if (defenceOpt)
                    offence.delete(defenceOpt);
                // 6. Resolve and exclude dislodged moves if #provinces <= 2
                if ([...provinces].length <= 2) {
                    if (defenceOpt) {
                        offence.forEach(group => {
                            if (group.target.order.tpe === order_1.OrderType.Move) {
                                const isDislodged = (!group.target.getResult()) ? false : group.target.getResult() === data_1.Result.Dislodged;
                                if (isDislodged && canBounce(group.target, defenceOpt.target)) {
                                    groups.delete(group);
                                    offence.delete(group);
                                    group.relatedOrders.forEach(o => { o.setResult(data_1.Result.Failed); });
                                }
                            }
                        });
                    }
                }
                if (groups.size === 0)
                    continue;
                // 7. Find orders that have the highest power
                const maxPower = Math.max(...[...groups].map(group => group.power()));
                const maxOrders = new Set([...groups].filter(g => g.power() >= maxPower).map(g => g.target));
                // 8. Resolve the defence order
                if (defenceOpt) {
                    if (maxOrders.has(defenceOpt.target)) {
                        const o = defenceOpt.target.order;
                        if (o instanceof order_1.Move) {
                        }
                        else if (o instanceof order_1.Hold) {
                            defenceOpt.target.setResult(data_1.Result.Success);
                            defenceOpt.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                        }
                        else if (o instanceof order_1.Convoy) {
                            if (defenceOpt.target.getResult() !== data_1.Result.NoCorrespondingOrder) {
                                defenceOpt.target.setResult(data_1.Result.Failed); // This convoy order is available.
                            }
                            defenceOpt.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                        }
                        else {
                            defenceOpt.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                        }
                    }
                    else {
                        let isDislodged = false;
                        const offenceGroup = [...offence].find(group => maxOrders.has(group.target));
                        if (maxOrders.size === 1) {
                            if (offenceGroup) {
                                let offensivePower = 0;
                                if (offenceGroup.target.order.unit.power !== defenceOpt.target.order.unit.power) {
                                    offensivePower += 1;
                                }
                                const validSupports = [...offenceGroup.validSupports()].filter(s => {
                                    return s.unit.power !== defenceOpt.target.order.unit.power;
                                });
                                offensivePower += validSupports.length;
                                isDislodged = defenceOpt.power() < offensivePower;
                            }
                            if (isDislodged) {
                                if (offenceGroup) {
                                    defenceOpt.target.setResult(data_1.Result.Dislodged);
                                    dislodgedFrom.set(defenceOpt.target.order.unit, offenceGroup.target.order.unit.location.province);
                                    defenceOpt.relatedOrders.forEach(order => { order.setResult(data_1.Result.Failed); });
                                }
                            }
                            else {
                                if (defenceOpt.target.order.tpe === order_1.OrderType.Hold) {
                                    defenceOpt.target.setResult(data_1.Result.Success);
                                    defenceOpt.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                                }
                            }
                        }
                    }
                }
                // 9. Resolve the offence orders
                offence.forEach(group => {
                    let isBounced = true;
                    if (maxOrders.has(group.target)) {
                        if (maxOrders.size === 1) {
                            if (defenceOpt) {
                                if (defenceOpt.target.order.tpe === order_1.OrderType.Move) {
                                    isBounced = (defenceOpt.target.getResult() !== data_1.Result.Success) &&
                                        (defenceOpt.target.getResult() !== data_1.Result.Dislodged);
                                }
                                else {
                                    isBounced = defenceOpt.target.getResult() !== data_1.Result.Dislodged;
                                }
                            }
                            else {
                                isBounced = false;
                            }
                        }
                        else if (maxOrders.size === 2) {
                            const order2 = ([...maxOrders].find(o => o !== group.target));
                            isBounced = canBounce(group.target, order2);
                        }
                    }
                    if (isBounced) {
                        group.target.setResult(data_1.Result.Bounced);
                        group.relatedOrders.forEach(o => { o.setResult(data_1.Result.Failed); });
                    }
                    else {
                        group.target.setResult(data_1.Result.Success);
                        group.relatedOrders.forEach(o => { o.setResult(data_1.Result.Success); });
                    }
                });
            }
        }
        // Generate a new board
        const unit2Result = new Map(ordersWithResult.map(order => {
            return [order.order.unit, [order.order, order.getResult()]];
        }));
        const newUnits = new Set();
        board.units.forEach(unit => {
            const r = unit2Result.get(unit);
            if (r) {
                const [order, result] = r;
                if (order instanceof order_1.Move && result === data_1.Result.Success) {
                    newUnits.add(new types_1.Unit(unit.militaryBranch, order.destination, unit.power));
                }
                else {
                    newUnits.add(unit);
                }
            }
            else {
                newUnits.add(unit);
            }
        });
        const newUnitStatuses = new Map();
        ordersWithResult.forEach(order => {
            if (order.getResult() === data_1.Result.Dislodged) {
                const x = dislodgedFrom.get(order.order.unit);
                newUnitStatuses.set(order.order.unit, new data_1.Dislodged(x));
            }
        });
        const provincesContainingUnit = new Set([...newUnits].map(u => u.location.province));
        const occupationStatuses = [...board.provinceStatuses]
            .filter(elem => elem[1].occupied)
            .map(elem => {
            if (elem[1].standoff) {
                return [elem[0], new data_1.ProvinceStatus(elem[1].occupied, false)];
            }
            else {
                return elem;
            }
        });
        const newProvinceStatuses = new Map([...occupationStatuses]);
        province2OrderGroups.forEach((groups, province) => {
            const wasBounced = [...groups].some(group => group.target.getResult() === data_1.Result.Bounced);
            const standoff = wasBounced && !(provincesContainingUnit.has(province));
            if (standoff) {
                const current = newProvinceStatuses.get(province) || new data_1.ProvinceStatus(null, true);
                const x = new data_1.ProvinceStatus(current.occupied, true);
                newProvinceStatuses.set(province, x);
            }
        });
        const newState = new data_1.State(board.state.turn, Retreat);
        const newBoard = new types_1.Board(board.map, newState, newUnits, newUnitStatuses, newProvinceStatuses);
        const orderResults = [...ordersWithResult].map(order => {
            const r = order.getResult();
            if (r !== null) {
                return new Executed(order.order, r);
            }
            else {
                throw `Internal error: ${order.order} was not resolved`;
            }
        });
        return new Success(new types_1.ResolvedResult(newBoard, orderResults, false));
    }
}
exports.MovementResolver = MovementResolver;

},{"./../board":2,"./../rule":5,"./../util":32,"./data":16,"./movement-order-group":20,"./movement-order-with-result":21,"./order":25,"./order-dependency":24,"./types":30}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
const data_1 = require("./data");
const Error = require("./error");
const { Army, Fleet } = data_1.MilitaryBranch;
class MovementValidator {
    unitsRequiringOrder(board) {
        return board.units;
    }
    errorOfOrder(board, o) {
        // The order is invalid if order.unit is not in board.
        if (!board.units.has(o.unit)) {
            return new Error.UnitNotExisted(o.unit);
        }
        if (o instanceof order_1.Hold) {
            return null;
        }
        else if (o instanceof order_1.Move) {
            // TODO the type of `o` is inferred as `never`
            const order = o;
            /*
            Move is valid if
            1. the unit can move to the destination or
            2. the unit is army, the location is coast, and the fleet can move to destination from the location.
            */
            if (utils_1.Utils.movableLocationsOf(board, order.unit).has(order.destination)) {
                return null;
            }
            else {
                return new Error.UnmovableLocation(order.unit, order.destination);
            }
        }
        else if (o instanceof order_1.Support) {
            const order = o;
            // Support is valid if the destination can be moved.
            const msgForTarget = this.errorOfOrder(board, order.target);
            if (msgForTarget) {
                return msgForTarget;
            }
            else {
                if (utils_1.Utils.supportableLocationsOf(board.map, order.unit).has(order.destination)) {
                    return null;
                }
                else {
                    return new Error.UnsupportableLocation(order.unit, order.destination);
                }
            }
        }
        else if (o instanceof order_1.Convoy) {
            const order = o;
            /*
            Convoy is valid if
            1. the unit is fleet,
            2. the target is move order,
            3. the target is army,
            4. the location is sea, and
            5. the destination can be moved from the unit's location
            */
            const msg = this.errorOfOrder(board, order.target);
            if (msg) {
                return msg;
            }
            else {
                if (order.unit.militaryBranch !== Fleet) {
                    return new Error.CannotBeOrdered(order);
                }
                else if (order.target.unit.militaryBranch !== Army) {
                    return new Error.CannotBeOrdered(order);
                }
                else {
                    if (!utils_1.Utils.isSea(board.map, order.unit.location.province)) {
                        return new Error.CannotBeOrdered(order);
                    }
                    else if (!utils_1.Utils.isMovableViaSea(board.map, order.target.unit.location.province, order.target.destination.province, board.units)) {
                        return new Error.UnmovableLocation(order.target.unit, order.target.destination);
                    }
                    else if (!(board.map.movableProvincesOf(order.unit.location.province, Fleet).has(order.target.destination.province) ||
                        utils_1.Utils.isMovableViaSea(board.map, order.unit.location.province, order.target.destination.province, board.units))) {
                        return new Error.UnconvoyableLocation(order.unit, order.target.destination);
                    }
                    else {
                        return null;
                    }
                }
            }
        }
        return new Error.InvalidPhase(o);
    }
    errorOfOrders(board, orders) {
        return null;
    }
}
exports.MovementValidator = MovementValidator;

},{"./data":16,"./error":17,"./order":25,"./utils":31}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("./order");
const data_1 = require("./data");
const graph_1 = require("./../graph");
const board_1 = require("./../board");
const { DirectedGraph, Edge } = graph_1.graph;
const { Province } = board_1.board;
class OrderDependency {
    constructor(ordersWithResult) {
        const nodeMap = new Map();
        const nodes = new Set();
        const edges = new Set();
        function addNode(p1) {
            if (nodeMap.has(p1)) {
                return;
            }
            const n1 = new Set([p1]);
            nodeMap.set(p1, n1);
            nodes.add(n1);
        }
        function addEdge(p1, p2) {
            const n1 = nodeMap.get(p1);
            const n2 = nodeMap.get(p2);
            if (n1 && n2) {
                edges.add(new Edge(n1, n2));
            }
        }
        const os = [...ordersWithResult];
        os.forEach(orderWithResult => {
            const order = orderWithResult.order;
            addNode(order.unit.location.province);
            if (order instanceof order_1.Hold) {
            }
            else if (order instanceof order_1.Move) {
                const o = order;
                addNode(o.destination.province);
                addEdge(o.destination.province, o.unit.location.province);
            }
            else if (order instanceof order_1.Support) {
                const o = order;
                if (orderWithResult.getResult() !== data_1.Result.NoCorrespondingOrder) {
                    addNode(o.destination.province);
                    addEdge(o.unit.location.province, o.destination.province);
                }
            }
            else if (order instanceof order_1.Convoy) {
                const o = order;
                if (orderWithResult.getResult() !== data_1.Result.NoCorrespondingOrder) {
                    addNode(o.target.destination.province);
                    addEdge(o.unit.location.province, o.target.destination.province);
                }
            }
        });
        let graph = new DirectedGraph(edges, nodes);
        while (true) {
            const c = graph.getCycle();
            if (c && c.length > 1) {
                graph = graph.mergeNodes(new Set([...c]));
            }
            else {
                break;
            }
        }
        this.graph = graph;
    }
}
exports.OrderDependency = OrderDependency;

},{"./../board":2,"./../graph":3,"./data":16,"./order":25}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderType;
(function (OrderType) {
    OrderType[OrderType["Hold"] = 1] = "Hold";
    OrderType[OrderType["Move"] = 2] = "Move";
    OrderType[OrderType["Support"] = 3] = "Support";
    OrderType[OrderType["Convoy"] = 4] = "Convoy";
    OrderType[OrderType["Retreat"] = 5] = "Retreat";
    OrderType[OrderType["Disband"] = 6] = "Disband";
    OrderType[OrderType["Build"] = 7] = "Build";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
/**
 * Order of the standard rule
 */
class Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param tpe The type of the order
     */
    constructor(unit, tpe) {
        this.unit = unit;
        this.tpe = tpe;
    }
}
exports.Order = Order;
/**
 * Hold order
 */
class Hold extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     */
    constructor(unit) {
        super(unit, OrderType.Hold);
    }
    toString() {
        return `${this.unit} H`;
    }
}
exports.Hold = Hold;
/**
 * Move order
 */
class Move extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param destination The destination of this move order.
     * @param useConvoy The flag whether this move order uses convoy or not.
     */
    constructor(unit, destination, useConvoy) {
        super(unit, OrderType.Move);
        this.destination = destination;
        this.useConvoy = useConvoy || false;
    }
    toString() {
        if (this.useConvoy) {
            return `${this.unit}-${this.destination} via Convoy`;
        }
        else {
            return `${this.unit}-${this.destination}`;
        }
    }
}
exports.Move = Move;
/**
 * Support order
 */
class Support extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param target The target order of this support.
     */
    constructor(unit, target) {
        super(unit, OrderType.Support);
        this.target = target;
        console.assert(target.tpe === OrderType.Move || target.tpe === OrderType.Hold);
        if (target instanceof Move) {
            this.destination = target.destination;
        }
        else {
            this.destination = target.unit.location;
        }
    }
    toString() {
        return `${this.unit} S ${this.target}`;
    }
}
exports.Support = Support;
/**
 * Convoy order
 */
class Convoy extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param target The target order of this convoy.
     */
    constructor(unit, target) {
        super(unit, OrderType.Convoy);
        this.target = target;
        console.assert(target.tpe === OrderType.Move);
    }
    toString() {
        return `${this.unit} C ${this.target}`;
    }
}
exports.Convoy = Convoy;
/**
 * Retreat order
 */
class Retreat extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     * @param destination The destination of this retreat.
     */
    constructor(unit, destination) {
        super(unit, OrderType.Retreat);
        this.destination = destination;
    }
    toString() {
        return `${this.unit} R ${this.destination}`;
    }
}
exports.Retreat = Retreat;
/**
 * Disband order
 */
class Disband extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     */
    constructor(unit) {
        super(unit, OrderType.Disband);
    }
    toString() {
        return `Disband ${this.unit}`;
    }
}
exports.Disband = Disband;
/**
 * Build order
 */
class Build extends Order {
    /**
     * @param unit The unit that corresponds to this order.
     */
    constructor(unit) {
        super(unit, OrderType.Build);
    }
    toString() {
        return `Build ${this.unit}`;
    }
}
exports.Build = Build;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
class RetreatOrderGenerator {
    ordersToSkipPhase(board) {
        if (board.unitStatuses.size === 0) {
            return new Set();
        }
        if ([...board.unitStatuses].every(elem => {
            const [unit, status] = elem;
            const locations = utils_1.Utils.locationsToRetreat(board, unit, status.attackedFrom);
            return locations.size === 0;
        })) {
            // Disband all dislodged units
            const retval = new Set();
            board.unitStatuses.forEach((status, unit) => {
                retval.add(new order_1.Disband(unit));
            });
            return retval;
        }
        return null;
    }
    defaultOrderOf(board, unit) {
        return new order_1.Disband(unit);
    }
}
exports.RetreatOrderGenerator = RetreatOrderGenerator;

},{"./order":25,"./utils":31}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const order_1 = require("./order");
const utils_1 = require("./utils");
const types_1 = require("./types");
const board_1 = require("./../board");
const rule_1 = require("./../rule");
const util_1 = require("./../util");
const { Province } = board_1.board;
const { Executed } = rule_1.rule;
const { Success } = util_1.util;
const { Movement, Build } = data_1.Phase;
class RetreatResolver {
    resolve(board, orders) {
        const disbands = [...orders].filter(order => order.tpe === order_1.OrderType.Disband);
        const retreats = ([...orders].filter(order => order.tpe === order_1.OrderType.Retreat));
        const retval = new Map();
        disbands.forEach(order => retval.set(order, data_1.Result.Success));
        // Create a map from province to retreat order
        const province2RetreatUnits = new Map();
        retreats.forEach(order => {
            const elem = province2RetreatUnits.get(order.destination.province) || [];
            elem.push(order);
            province2RetreatUnits.set(order.destination.province, elem);
        });
        // Resolve retreat orders
        province2RetreatUnits.forEach((orders, province) => {
            if (orders.length === 1) {
                orders.forEach(order => retval.set(order, data_1.Result.Success));
            }
            else {
                orders.forEach(order => retval.set(order, data_1.Result.Failed));
            }
        });
        // Generate a new board
        const unit2Result = new Map([...retval].map(elem => {
            return [elem[0].unit, [elem[0], elem[1]]];
        }));
        const newUnits = new Set();
        board.units.forEach(unit => {
            const result = unit2Result.get(unit);
            if (result) {
                const [order, r] = result;
                if (order instanceof order_1.Retreat && r === data_1.Result.Success) {
                    newUnits.add(new types_1.Unit(unit.militaryBranch, order.destination, unit.power));
                }
            }
            else {
                newUnits.add(unit);
            }
        });
        const newState = (board.state.turn.isBuildable)
            ? new data_1.State(board.state.turn, Build)
            : new data_1.State(board.state.turn.nextTurn(), Movement);
        // Update occupation if needed
        const occupationStatuses = [...board.provinceStatuses]
            .filter(elem => elem[1].occupied)
            .map(elem => {
            if (elem[1].standoff) {
                return [elem[0], new data_1.ProvinceStatus(elem[1].occupied, false)];
            }
            else {
                return elem;
            }
        });
        const newProvinceStatuses = new Map([...occupationStatuses]);
        if (board.state.turn.isOccupationUpdateable) {
            newUnits.forEach(unit => {
                newProvinceStatuses.set(unit.location.province, new data_1.ProvinceStatus(unit.power, false));
            });
        }
        const newBoard = new types_1.Board(board.map, newState, newUnits, [], newProvinceStatuses);
        const orderResults = [...retval].map(elem => {
            const [order, result] = elem;
            return new Executed(order, result);
        });
        const numOfCenters = ([...board.map.provinces].filter(p => p.isSupplyCenter)).length;
        const numberOfSupplyCenters = utils_1.Utils.numberOfSupplyCenters(newBoard);
        const isFinished = [...newBoard.map.powers].some(power => {
            return (numberOfSupplyCenters.get(power) || 0) > (numOfCenters / 2);
        });
        return new Success(new types_1.ResolvedResult(newBoard, orderResults, isFinished));
    }
}
exports.RetreatResolver = RetreatResolver;

},{"./../board":2,"./../rule":5,"./../util":32,"./data":16,"./order":25,"./types":30,"./utils":31}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const order_1 = require("./order");
const Error = require("./error");
class RetreatValidator {
    unitsRequiringOrder(board) {
        return new Set([...board.unitStatuses].map(elem => elem[0]));
    }
    errorOfOrder(board, order) {
        // The order is invalid if order.unit is not dislodged
        const dislodged = board.unitStatuses.get(order.unit);
        if (!dislodged) {
            return new Error.CannotBeOrdered(order);
        }
        if (order instanceof order_1.Retreat) {
            const ls = utils_1.Utils.locationsToRetreat(board, order.unit, dislodged.attackedFrom);
            if (!ls.has(order.destination)) {
                return new Error.UnmovableLocation(order.unit, order.destination);
            }
        }
        else if (!(order instanceof order_1.Disband)) {
            return new Error.InvalidPhase(order);
        }
        return null;
    }
    errorOfOrders(board, orders) {
        for (let elem of [...board.unitStatuses]) {
            const [unit, status] = elem;
            const hasOrder = [...orders].some(order => order.unit === unit);
            if (!hasOrder) {
                return new Error.OrderNotExisted(unit);
            }
        }
        return null;
    }
}
exports.RetreatValidator = RetreatValidator;

},{"./error":17,"./order":25,"./utils":31}],29:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const data_1 = require("./data");
const movement_resolver_1 = require("./movement-resolver");
const movement_validator_1 = require("./movement-validator");
const movement_order_generator_1 = require("./movement-order-generator");
const retreat_resolver_1 = require("./retreat-resolver");
const retreat_validator_1 = require("./retreat-validator");
const retreat_order_generator_1 = require("./retreat-order-generator");
const build_resolver_1 = require("./build-resolver");
const build_validator_1 = require("./build-validator");
const build_order_generator_1 = require("./build-order-generator");
const error_1 = require("./error");
const rule_1 = require("./../rule");
const util_1 = require("./../util");
const { Success, Failure } = util_1.util;
const { Movement, Retreat, Build } = data_1.Phase;
class PhaseRule {
    constructor(resolver, validator, orderGenerator) {
        this.resolver = resolver;
        this.validator = validator;
        this.orderGenerator = orderGenerator;
    }
}
/**
 * Standard rule of Diplomacy
 */
class Rule extends rule_1.rule.Rule {
    /**
     * @param stringify Stringify instances of Power
     */
    constructor() {
        super();
        this.phaseRules = new Map([
            [
                Movement,
                new PhaseRule(new movement_resolver_1.MovementResolver(), new movement_validator_1.MovementValidator(), new movement_order_generator_1.MovementOrderGenerator())
            ],
            [
                Retreat,
                new PhaseRule(new retreat_resolver_1.RetreatResolver(), new retreat_validator_1.RetreatValidator(), new retreat_order_generator_1.RetreatOrderGenerator())
            ],
            [
                Build,
                new PhaseRule(new build_resolver_1.BuildResolver(), new build_validator_1.BuildValidator(), new build_order_generator_1.BuildOrderGenerator())
            ]
        ]);
    }
    resolveProcedure(board, orders) {
        const unitsHaveSeveralOrders = new Set([...orders].filter(order => {
            return [...orders].some(order2 => order !== order2 && order.unit === order2.unit);
        }).map(order => order.unit));
        if (unitsHaveSeveralOrders.size !== 0) {
            return new Failure(new error_1.SeveralOrders(unitsHaveSeveralOrders));
        }
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        const { resolver } = ruleOpt;
        const r1 = resolver.resolve(board, orders);
        if (!r1.result) {
            return r1;
        }
        const result = r1.result;
        const ruleOpt2 = this.phaseRules.get(result.board.state.phase);
        if (!ruleOpt2) {
            throw `Invalid phase: ${result.board.state.phase}`;
        }
        const orders2 = ruleOpt2.orderGenerator.ordersToSkipPhase(result.board);
        if (!orders2) {
            return r1;
        }
        const r2 = this.resolve(result.board, orders2);
        if (!r2.result) {
            return r2;
        }
        const result2 = r2.result;
        const orderResults = new Set([...result.results]);
        result2.results.forEach(r => orderResults.add(r));
        return new Success(new types_1.ResolvedResult(result2.board, orderResults, result.isFinished || result2.isFinished));
    }
    unitsRequiringOrder(board) {
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        return ruleOpt.validator.unitsRequiringOrder(board);
    }
    errorOfOrder(board, order) {
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        return ruleOpt.validator.errorOfOrder(board, order);
    }
    errorOfOrders(board, orders) {
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        return ruleOpt.validator.errorOfOrders(board, orders);
    }
    defaultOrderOf(board, unit) {
        const ruleOpt = this.phaseRules.get(board.state.phase);
        if (!ruleOpt) {
            throw `invalid phase: ${board.state.phase}`;
        }
        return ruleOpt.orderGenerator.defaultOrderOf(board, unit);
    }
}
exports.Rule = Rule;

},{"./../rule":5,"./../util":32,"./build-order-generator":13,"./build-resolver":14,"./build-validator":15,"./data":16,"./error":17,"./movement-order-generator":19,"./movement-resolver":22,"./movement-validator":23,"./retreat-order-generator":26,"./retreat-resolver":27,"./retreat-validator":28,"./types":30}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./../board");
const rule_1 = require("./../rule");
const data_1 = require("./data");
class Location extends board_1.board.Location {
}
exports.Location = Location;
class Unit extends board_1.board.Unit {
    toString() {
        switch (this.militaryBranch) {
            case data_1.MilitaryBranch.Army:
                return `A ${this.location}`;
            case data_1.MilitaryBranch.Fleet:
                return `F ${this.location}`;
        }
    }
}
exports.Unit = Unit;
class DiplomacyMap extends board_1.board.DiplomacyMap {
}
exports.DiplomacyMap = DiplomacyMap;
class Board extends board_1.board.Board {
}
exports.Board = Board;
class ResolvedResult extends rule_1.rule.ResolvedResult {
}
exports.ResolvedResult = ResolvedResult;

},{"./../board":2,"./../rule":5,"./data":16}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./../board");
const data_1 = require("./data");
const { Province } = board_1.board;
/*
/**
 * Utility of the standard rule
 */
class Utils {
    /**
     * @param board -
     * @returns The map between powers and the number of supply centers
     */
    static numberOfSupplyCenters(board) {
        const retval = new Map();
        board.provinceStatuses.forEach((status, province) => {
            if (!status.occupied) {
                return;
            }
            const power = status.occupied;
            if (power) {
                const numOfSupply = retval.get(power) || 0;
                retval.set(power, numOfSupply + ((province.isSupplyCenter) ? 1 : 0));
            }
        });
        return retval;
    }
    /**
     * @returns True if the province is sea. Sea is a province that only Fleet can enter.
     */
    static isSea(map, province) {
        return [...map.locationsOf(province)].every(l => {
            return l.militaryBranches.size === 1 && l.militaryBranches.has(data_1.MilitaryBranch.Fleet);
        });
    }
    /**
     * @return True if the unit can be ordered "convoy" order.
     */
    static canConvoy(map, unit) {
        return Utils.isSea(map, unit.location.province);
    }
    /**
     * @returns The locations that the unit can retreat to.
     */
    static locationsToRetreat(board, unit, attackedFrom) {
        return new Set([...board.map.movableLocationsOf(unit.location, unit.militaryBranch)].filter(location => {
            const existsUnit = [...board.units].some(unit => unit.location.province === location.province);
            const status = board.provinceStatuses.get(location.province);
            if (status && status.standoff) {
                return false;
            }
            else if (location.province === attackedFrom) {
                return false;
            }
            else if (existsUnit) {
                return false;
            }
            else {
                return true;
            }
        }));
    }
    /**
     * @param units The set of units that is used for convoy
     */
    static isMovableViaSea(map, source, destination, units) {
        const provinces = new Set([...units]
            .filter(u => u.militaryBranch === data_1.MilitaryBranch.Fleet)
            .map(x => x.location.province));
        const visited = new Set();
        // TODO duplicated code
        function dfs(province) {
            const nextProvinces = [...map.movableProvincesOf(province, data_1.MilitaryBranch.Fleet)]
                .filter(p => Utils.isSea(map, p) && provinces.has(p));
            return nextProvinces.some(p => {
                if (map.movableProvincesOf(p, data_1.MilitaryBranch.Fleet).has(destination)) {
                    return true;
                }
                else if (!visited.has(p)) {
                    visited.add(p);
                    return dfs(p);
                }
                else {
                    return false;
                }
            });
        }
        return dfs(source);
    }
    /**
     * @returns The location that the unit can move via convoy
     */
    static movableViaConvoyLocationsOf(board, unit) {
        if (unit.militaryBranch === data_1.MilitaryBranch.Fleet) {
            return new Set();
        }
        const provinces = new Set([...board.units].map(x => x.location.province));
        const visited = new Set();
        // TODO duplicated code
        function dfs(province) {
            const nextProvinces = [...board.map.movableProvincesOf(province, data_1.MilitaryBranch.Fleet)]
                .filter(p => Utils.isSea(board.map, p) && provinces.has(p));
            nextProvinces.forEach(p => {
                if (!visited.has(p)) {
                    visited.add(p);
                    dfs(p);
                }
            });
        }
        dfs(unit.location.province);
        // The provinces that can use for convoy
        const sea = visited;
        let retval = [];
        sea.forEach(s => {
            [...board.map.movableProvincesOf(s, data_1.MilitaryBranch.Fleet)]
                .filter(p => !Utils.isSea(board.map, p))
                .forEach(p => {
                board.map.locationsOf(p).forEach(l => {
                    if (l.militaryBranches.has(data_1.MilitaryBranch.Army)) {
                        retval.push(l);
                    }
                });
            });
        });
        return new Set(retval.filter(x => x.province !== unit.location.province));
    }
    /**
     * @returns The locations that the unit can move to (including via convoy).
     */
    static movableLocationsOf(board, unit) {
        const locations = Array.from(board.map.movableLocationsOf(unit.location, unit.militaryBranch));
        const movableViaSea = Utils.movableViaConvoyLocationsOf(board, unit);
        return new Set(Array.from(movableViaSea).concat(locations));
    }
    /**
     * @return The set of locations that can be supported by the unit
     */
    static supportableLocationsOf(map, unit) {
        const provinces = new Set(Array.from(map.movableLocationsOf(unit.location, unit.militaryBranch)).map(l => l.province));
        const retval = new Set();
        provinces.forEach(p => {
            map.locationsOf(p).forEach(l => retval.add(l));
        });
        return retval;
    }
    /**
     * @return
     *   The Map between powers and number of buildable units.
     *   If a power should disband some units, this contains negative number
     *   (e.g., It contains -1 if a power has to disband 1 unit).
     */
    static numberOfBuildableUnits(board) {
        const numberOfSupplyCenters = Utils.numberOfSupplyCenters(board);
        const retval = new Map();
        board.map.powers.forEach(power => {
            const numOfSupply = numberOfSupplyCenters.get(power) || 0;
            const numOfUnits = ([...board.units].filter(x => x.power === power)).length;
            retval.set(power, numOfSupply - numOfUnits);
        });
        return retval;
    }
}
exports.Utils = Utils;

},{"./../board":2,"./data":16}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util;
(function (util) {
    class Success {
        constructor(result) {
            this.result = result;
        }
    }
    util.Success = Success;
    class Failure {
        constructor(err) {
            this.err = err;
        }
    }
    util.Failure = Failure;
})(util = exports.util || (exports.util = {}));

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var variant;
(function (variant) {
    /**
     * Variant of Diplomacy
     */
    class Variant {
        /**
         * @param rule The rule used in this variant.
         * @param initialBoard The initial state of the board used in this variant.
         */
        constructor(rule, initialBoard) {
            this.rule = rule;
            this.initialBoard = initialBoard;
        }
    }
    variant.Variant = Variant;
})(variant = exports.variant || (exports.variant = {}));

},{}]},{},[1]);

//# sourceMappingURL=diplomacy.js.map
