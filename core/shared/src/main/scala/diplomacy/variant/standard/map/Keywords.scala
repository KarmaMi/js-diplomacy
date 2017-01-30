package diplomacy.variant.standard.map

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board.{ Name, Province }
import diplomacy.variant.standard.rule._
import diplomacy.variant.standard.rule.Keywords._

@JSExport @JSExportAll
object Keywords {
  private[this] val south = Name("South Coast", "SC")
  private[this] val north = Name("North Coast", "NC")
  private[this] val east = Name("East Coast", "EC")
  private[this] def nameWithCoast(provinceName: Name, coastName: Name) = {
    Name(
      s"${provinceName.name}_${coastName.name}",
      s"${provinceName.abbreviatedName}_${coastName.abbreviatedName}"
    )
  }

  /* Powers */
  val Austria = Power.Austria
  val England = Power.England
  val France = Power.France
  val Germany = Power.Germany
  val Italy = Power.Italy
  val Russia = Power.Russia
  val Turkey = Power.Turkey

  /* Locations */
  // inland
  val Boh =
    new Location(Province[Power](Name("Bohemia", "Boh"), Option(Austria), false), Set(Army))
  val Bud =
    new Location(Province[Power](Name("Budapest", "Bud"), Option(Austria), true), Set(Army))
  val Gal =
    new Location(Province[Power](Name("Galicia", "Gal"), Option(Austria), false), Set(Army))
  val Tyr =
    new Location(Province[Power](Name("Tyrolia", "Tyr"), Option(Austria), false), Set(Army))
  val Vie =
    new Location(Province[Power](Name("Vienna", "Vie"), Option(Austria), true), Set(Army))
  val Bur =
    new Location(Province[Power](Name("Burgundy", "Bur"), Option(France), false), Set(Army))
  val Par =
    new Location(Province[Power](Name("Paris", "Par"), Option(France), true), Set(Army))
  val Mun =
    new Location(Province[Power](Name("Munich", "Mun"), Option(Germany), true), Set(Army))
  val Ruh =
    new Location(Province[Power](Name("Ruhr", "Ruh"), Option(Germany), false), Set(Army))
  val Sil =
    new Location(Province[Power](Name("Silesia", "Sil"), Option(Germany), false), Set(Army))
  val Mos =
    new Location(Province[Power](Name("Moscow", "Mos"), Option(Russia), true), Set(Army))
  val Ukr =
    new Location(Province[Power](Name("Ukraine", "Ukr"), Option(Russia), false), Set(Army))
  val War =
    new Location(Province[Power](Name("Warsaw", "War"), Option(Russia), true), Set(Army))
  val Ser =
    new Location(Province[Power](Name("Serbia", "Ser"), None, true), Set(Army))
  // coast
  val Tri =
    new Location(Province[Power](Name("Trieste", "Tri"), Option(Austria), true), Set(Army, Fleet))
  val Cly =
    new Location(Province[Power](Name("Clyde", "Cly"), Option(England), false), Set(Army, Fleet))
  val Edi =
    new Location(Province[Power](Name("Edinburgh", "Edi"), Option(England), true), Set(Army, Fleet))
  val Lvp =
    new Location(Province[Power](Name("Liverpool", "Lvp"), Option(England), true), Set(Army, Fleet))
  val Lon =
    new Location(Province[Power](Name("London", "Lon"), Option(England), true), Set(Army, Fleet))
  val Wal =
    new Location(Province[Power](Name("Wales", "Wal"), Option(England), false), Set(Army, Fleet))
  val Yor =
    new Location(Province[Power](Name("Yorkshire", "Yor"), Option(England), false), Set(Army, Fleet))
  val Bre =
    new Location(Province[Power](Name("Brest", "Bre"), Option(France), true), Set(Army, Fleet))
  val Gas =
    new Location(Province[Power](Name("Gascony", "Gas"), Option(France), false), Set(Army, Fleet))
  val Mar =
    new Location(Province[Power](Name("Marseilles", "Mar"), Option(France), true), Set(Army, Fleet))
  val Pic =
    new Location(Province[Power](Name("Picardy", "Pic"), Option(France), false), Set(Army, Fleet))
  val Ber =
    new Location(Province[Power](Name("Berlin", "Ber"), Option(Germany), true), Set(Army, Fleet))
  val Kie =
    new Location(Province[Power](Name("Kiel", "Kie"), Option(Germany), true), Set(Army, Fleet))
  val Pru =
    new Location(Province[Power](Name("Prussia", "Pru"), Option(Germany), false), Set(Army, Fleet))
  val Apu =
    new Location(Province[Power](Name("Apulia", "Apu"), Option(Italy), false), Set(Army, Fleet))
  val Nap =
    new Location(Province[Power](Name("Naples", "Nap"), Option(Italy), true), Set(Army, Fleet))
  val Pie =
    new Location(Province[Power](Name("Piedmont", "Pie"), Option(Italy), false), Set(Army, Fleet))
  val Rom =
    new Location(Province[Power](Name("Rome", "Rom"), Option(Italy), true), Set(Army, Fleet))
  val Tus =
    new Location(Province[Power](Name("Tuscany", "Tus"), Option(Italy), false), Set(Army, Fleet))
  val Ven =
    new Location(Province[Power](Name("Venice", "Ven"), Option(Italy), true), Set(Army, Fleet))
  val Fin =
    new Location(Province[Power](Name("Finland", "Fin"), Option(Russia), false), Set(Army, Fleet))
  val Lvn =
    new Location(Province[Power](Name("Livonia", "Lvn"), Option(Russia), false), Set(Army, Fleet))
  val Sev =
    new Location(Province[Power](Name("Sevastopol", "Sev"), Option(Russia), true), Set(Army, Fleet))
  val Ank =
    new Location(Province[Power](Name("Ankara", "Ank"), Option(Turkey), true), Set(Army, Fleet))
  val Arm =
    new Location(Province[Power](Name("Armenia", "Arm"), Option(Turkey), false), Set(Army, Fleet))
  val Con =
    new Location(Province[Power](Name("Constantinople", "Con"), Option(Turkey), true), Set(Army, Fleet))
  val Smy =
    new Location(Province[Power](Name("Smyrna", "Smy"), Option(Turkey), true), Set(Army, Fleet))
  val Syr =
    new Location(Province[Power](Name("Syria", "Syr"), Option(Turkey), false), Set(Army, Fleet))
  val Alb =
    new Location(Province[Power](Name("Albania", "Alb"), None, false), Set(Army, Fleet))
  val Bel =
    new Location(Province[Power](Name("Belgium", "Bel"), None, true), Set(Army, Fleet))
  val Den =
    new Location(Province[Power](Name("Denmark", "Den"), None, true), Set(Army, Fleet))
  val Gre =
    new Location(Province[Power](Name("Greece", "Gre"), None, true), Set(Army, Fleet))
  val Hol =
    new Location(Province[Power](Name("Holland", "Hol"), None, true), Set(Army, Fleet))
  val Nwy =
    new Location(Province[Power](Name("Norway", "Nwy"), None, true), Set(Army, Fleet))
  val Por =
    new Location(Province[Power](Name("Portugal", "Por"), None, true), Set(Army, Fleet))
  val Rum =
    new Location(Province[Power](Name("Rumania", "Rum"), None, true), Set(Army, Fleet))
  val Swe =
    new Location(Province[Power](Name("Sweden", "Swe"), None, true), Set(Army, Fleet))
  val Tun =
    new Location(Province[Power](Name("Tunis", "Tun"), None, true), Set(Army, Fleet))
  val NAf =
    new Location(Province[Power](Name("North Africa", "NAf"), None, false), Set(Army, Fleet))
  // special coasts
  private[this] val StP_p = Province[Power](Name("St. Petersburg", "StP"), Option(Russia), true)
  val StP = new Location(StP_p, Set(Army))
  val StP_NC = new Location(nameWithCoast(StP_p.name, north), StP_p, Set(Fleet))
  val StP_SC = new Location(nameWithCoast(StP_p.name, south), StP_p, Set(Fleet))
  private[this] val Bul_p = Province[Power](Name("Bulgaria", "Bul"), None, true)
  val Bul = new Location(Bul_p, Set(Army))
  val Bul_EC = new Location(nameWithCoast(Bul_p.name, east), Bul_p, Set(Fleet))
  val Bul_SC = new Location(nameWithCoast(Bul_p.name, south), Bul_p, Set(Fleet))
  private[this] val Spa_p = Province[Power](Name("Spain", "Spa"), None, true)
  val Spa =
    new Location(Spa_p, Set(Army))
  val Spa_NC = new Location(nameWithCoast(Spa_p.name, north), Spa_p, Set(Fleet))
  val Spa_SC = new Location(nameWithCoast(Spa_p.name, south), Spa_p, Set(Fleet))
  // sea
  val Adr =
    new Location(Province[Power](Name("Adriatic Sea", "Adr"), None, false), Set(Fleet))
  val Aeg =
    new Location(Province[Power](Name("Aegean Sea", "Aeg"), None, false), Set(Fleet))
  val Bal =
    new Location(Province[Power](Name("Baltic Sea", "Bal"), None, false), Set(Fleet))
  val Bar =
    new Location(Province[Power](Name("Barents Sea", "Bar"), None, false), Set(Fleet))
  val Bla =
    new Location(Province[Power](Name("Black Sea", "Bla"), None, false), Set(Fleet))
  val Eas =
    new Location(Province[Power](Name("Eastern Mediterranean", "Eas"), None, false), Set(Fleet))
  val Eng =
    new Location(Province[Power](Name("English Channel", "Eng"), None, false), Set(Fleet))
  val Bot =
    new Location(Province[Power](Name("Gulf of Bothnia", "Bot"), None, false), Set(Fleet))
  val GoL =
    new Location(Province[Power](Name("Gulf of Lyon", "GoL"), None, false), Set(Fleet))
  val Hel =
    new Location(Province[Power](Name("Helgoland Bight", "Hel"), None, false), Set(Fleet))
  val Ion =
    new Location(Province[Power](Name("Ionian Sea", "Ion"), None, false), Set(Fleet))
  val Iri =
    new Location(Province[Power](Name("Irish Sea", "Iri"), None, false), Set(Fleet))
  val Mid =
    new Location(Province[Power](Name("Mid-Atlantic Ocean", "Mid"), None, false), Set(Fleet))
  val NAt =
    new Location(Province[Power](Name("North Atlantic Ocean", "NAt"), None, false), Set(Fleet))
  val Nth =
    new Location(Province[Power](Name("North Sea", "Nth"), None, false), Set(Fleet))
  val Nrg =
    new Location(Province[Power](Name("Norwegian Sea", "Nrg"), None, false), Set(Fleet))
  val Ska =
    new Location(Province[Power](Name("Skagerrak", "Ska"), None, false), Set(Fleet))
  val Tyn =
    new Location(Province[Power](Name("Tyrrhenian Sea", "Tyn"), None, false), Set(Fleet))
  val Wes =
    new Location(Province[Power](Name("Western Mediterranean", "Wes"), None, false), Set(Fleet))
}
