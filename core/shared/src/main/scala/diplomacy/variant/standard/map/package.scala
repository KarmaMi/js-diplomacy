package diplomacy.variant.standard

import diplomacy.board.{ Name, Province }
import diplomacy.variant.standard.rule._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.util.LabeledUndirectedGraph

package object map {
  private[this] val south = Name("South Coast", "SC")
  private[this] val north = Name("North Coast", "NC")
  private[this] val east = Name("East Coast", "EC")
  private[this] def nameWithCoast(provinceName: Name, coastName: Name) = {
    Name(
      s"${provinceName.name}_${coastName.name}",
      s"${provinceName.abbreviatedName}_${coastName.abbreviatedName}"
    )
  }

  object Keywords {
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

  import Keywords._
  val map = new DiplomacyMap(LabeledUndirectedGraph(
    Set(
      // Boh
      (Boh -> Mun, Set[MilitaryBranch](Army)),
      (Boh -> Sil, Set[MilitaryBranch](Army)),
      (Boh -> Gal, Set[MilitaryBranch](Army)),
      (Boh -> Vie, Set[MilitaryBranch](Army)),
      (Boh -> Tyr, Set[MilitaryBranch](Army)),
      // Bud
      (Bud -> Vie, Set[MilitaryBranch](Army)),
      (Bud -> Gal, Set[MilitaryBranch](Army)),
      (Bud -> Rum, Set[MilitaryBranch](Army)),
      (Bud -> Ser, Set[MilitaryBranch](Army)),
      (Bud -> Tri, Set[MilitaryBranch](Army)),
      // Gal
      (Gal -> War, Set[MilitaryBranch](Army)),
      (Gal -> Ukr, Set[MilitaryBranch](Army)),
      (Gal -> Rum, Set[MilitaryBranch](Army)),
      (Gal -> Vie, Set[MilitaryBranch](Army)),
      // Tri
      (Tri -> Tyr, Set[MilitaryBranch](Army)),
      (Tri -> Vie, Set[MilitaryBranch](Army)),
      (Tri -> Ser, Set[MilitaryBranch](Army)),
      (Tri -> Alb, Set(Army, Fleet)),
      (Tri -> Adr, Set(Army, Fleet)),
      (Tri -> Ven, Set(Army, Fleet)),
      // Tyr
      (Tyr -> Mun, Set[MilitaryBranch](Army)),
      (Tyr -> Vie, Set[MilitaryBranch](Army)),
      (Tyr -> Ven, Set[MilitaryBranch](Army)),
      (Tyr -> Pie, Set[MilitaryBranch](Army)),
      // Vie
      // Cly
      (Cly -> NAt, Set[MilitaryBranch](Fleet)),
      (Cly -> Nrg, Set[MilitaryBranch](Fleet)),
      (Cly -> Edi, Set(Army, Fleet)),
      (Cly -> Lvp, Set(Army, Fleet)),
      // Edi
      (Edi -> Nrg, Set[MilitaryBranch](Fleet)),
      (Edi -> Nth, Set[MilitaryBranch](Fleet)),
      (Edi -> Yor, Set(Army, Fleet)),
      (Edi -> Lvp, Set[MilitaryBranch](Army)),
      // Lvp
      (Lvp -> Iri, Set[MilitaryBranch](Fleet)),
      (Lvp -> Yor, Set[MilitaryBranch](Army)),
      (Lvp -> Wal, Set(Army, Fleet)),
      // Lon
      (Lon -> Wal, Set(Army, Fleet)),
      (Lon -> Yor, Set(Army, Fleet)),
      (Lon -> Nth, Set[MilitaryBranch](Fleet)),
      (Lon -> Eng, Set[MilitaryBranch](Fleet)),
      // Wal
      (Wal -> Iri, Set[MilitaryBranch](Fleet)),
      (Wal -> Yor, Set[MilitaryBranch](Army)),
      (Wal -> Eng, Set[MilitaryBranch](Fleet)),
      // Yor
      (Yor -> Nth, Set[MilitaryBranch](Fleet)),
      // Bre
      (Bre -> Eng, Set[MilitaryBranch](Fleet)),
      (Bre -> Pic, Set(Army, Fleet)),
      (Bre -> Par, Set[MilitaryBranch](Army)),
      (Bre -> Gas, Set(Army, Fleet)),
      (Bre -> Mid, Set[MilitaryBranch](Fleet)),
      // Bur
      (Bur -> Par, Set[MilitaryBranch](Army)),
      (Bur -> Pic, Set[MilitaryBranch](Army)),
      (Bur -> Bel, Set[MilitaryBranch](Army)),
      (Bur -> Ruh, Set[MilitaryBranch](Army)),
      (Bur -> Mun, Set[MilitaryBranch](Army)),
      (Bur -> Mar, Set[MilitaryBranch](Army)),
      (Bur -> Gas, Set[MilitaryBranch](Army)),
      // Gas
      (Gas -> Mid, Set[MilitaryBranch](Fleet)),
      (Gas -> Par, Set[MilitaryBranch](Army)),
      (Gas -> Mar, Set[MilitaryBranch](Army)),
      (Gas -> Spa, Set[MilitaryBranch](Army)),
      (Gas -> Spa_NC, Set[MilitaryBranch](Fleet)),
      // Mar
      (Mar -> Spa, Set[MilitaryBranch](Army)),
      (Mar -> Spa_SC, Set[MilitaryBranch](Fleet)),
      (Mar -> GoL, Set[MilitaryBranch](Fleet)),
      (Mar -> Pie, Set(Army, Fleet)),
      // Par
      (Par -> Pic, Set[MilitaryBranch](Army)),
      // Pic
      (Pic -> Eng, Set[MilitaryBranch](Fleet)),
      (Pic -> Bel, Set(Army, Fleet)),
      // Ber
      (Ber -> Kie, Set(Army, Fleet)),
      (Ber -> Bal, Set[MilitaryBranch](Fleet)),
      (Ber -> Pru, Set(Army, Fleet)),
      (Ber -> Sil, Set[MilitaryBranch](Army)),
      (Ber -> Mun, Set[MilitaryBranch](Army)),
      // Kie
      (Kie -> Hel, Set[MilitaryBranch](Fleet)),
      (Kie -> Den, Set(Army, Fleet)),
      (Kie -> Mun, Set[MilitaryBranch](Army)),
      (Kie -> Ruh, Set[MilitaryBranch](Army)),
      (Kie -> Hol, Set(Army, Fleet)),
      // Mun
      (Mun -> Ruh, Set[MilitaryBranch](Army)),
      (Mun -> Sil, Set[MilitaryBranch](Army)),
      // Pru
      (Pru -> Bal, Set[MilitaryBranch](Fleet)),
      (Pru -> Lvn, Set(Army, Fleet)),
      (Pru -> War, Set[MilitaryBranch](Army)),
      (Pru -> Sil, Set[MilitaryBranch](Army)),
      // Ruh
      (Ruh -> Bel, Set[MilitaryBranch](Army)),
      (Ruh -> Hol, Set[MilitaryBranch](Army)),
      // Sil
      (Sil -> War, Set[MilitaryBranch](Army)),
      // Apu
      (Apu -> Ven, Set(Army, Fleet)),
      (Apu -> Adr, Set[MilitaryBranch](Fleet)),
      (Apu -> Ion, Set[MilitaryBranch](Fleet)),
      (Apu -> Nap, Set(Army, Fleet)),
      (Apu -> Rom, Set[MilitaryBranch](Army)),
      // Nap
      (Nap -> Rom, Set(Army, Fleet)),
      (Nap -> Ion, Set[MilitaryBranch](Fleet)),
      (Nap -> Tyn, Set[MilitaryBranch](Fleet)),
      // Pie
      (Pie -> Ven, Set[MilitaryBranch](Army)),
      (Pie -> Tus, Set(Army, Fleet)),
      (Pie -> GoL, Set[MilitaryBranch](Fleet)),
      // Rom
      (Rom -> Tus, Set(Army, Fleet)),
      (Rom -> Ven, Set[MilitaryBranch](Army)),
      (Rom -> Tyn, Set[MilitaryBranch](Fleet)),
      // Tus
      (Tus -> GoL, Set[MilitaryBranch](Fleet)),
      (Tus -> Ven, Set[MilitaryBranch](Army)),
      (Tus -> Tyn, Set[MilitaryBranch](Fleet)),
      // Ven
      (Ven -> Adr, Set[MilitaryBranch](Fleet)),
      // Fin
      (Fin -> Nwy, Set[MilitaryBranch](Army)),
      (Fin -> Swe, Set(Army, Fleet)),
      (Fin -> Bot, Set[MilitaryBranch](Fleet)),
      (Fin -> StP, Set[MilitaryBranch](Army)),
      (Fin -> StP_SC, Set[MilitaryBranch](Fleet)),
      // Lvn
      (Lvn -> Bot, Set[MilitaryBranch](Fleet)),
      (Lvn -> StP, Set[MilitaryBranch](Army)),
      (Lvn -> StP_SC, Set[MilitaryBranch](Fleet)),
      (Lvn -> Mos, Set[MilitaryBranch](Army)),
      (Lvn -> War, Set[MilitaryBranch](Army)),
      (Lvn -> Bal, Set[MilitaryBranch](Fleet)),
      // Mos
      (Mos -> StP, Set[MilitaryBranch](Army)),
      (Mos -> Sev, Set[MilitaryBranch](Army)),
      (Mos -> Ukr, Set[MilitaryBranch](Army)),
      (Mos -> War, Set[MilitaryBranch](Army)),
      // Sev
      (Sev -> Ukr, Set[MilitaryBranch](Army)),
      (Sev -> Arm, Set(Army, Fleet)),
      (Sev -> Bla, Set[MilitaryBranch](Fleet)),
      (Sev -> Rum, Set(Army, Fleet)),
      // StP
      (StP -> Nwy, Set[MilitaryBranch](Army)),
      // StP/NC
      (StP_NC -> Nwy, Set[MilitaryBranch](Fleet)),
      (StP_NC -> Bar, Set[MilitaryBranch](Fleet)),
      // StP/SC
      (StP_SC -> Bot, Set[MilitaryBranch](Fleet)),
      // Ukr
      (Ukr -> War, Set[MilitaryBranch](Army)),
      (Ukr -> Rum, Set[MilitaryBranch](Army)),
      // War
      // Ank
      (Ank -> Bla, Set[MilitaryBranch](Fleet)),
      (Ank -> Arm, Set(Army, Fleet)),
      (Ank -> Smy, Set[MilitaryBranch](Army)),
      (Ank -> Con, Set(Army, Fleet)),
      // Arm
      (Arm -> Bla, Set[MilitaryBranch](Fleet)),
      (Arm -> Syr, Set[MilitaryBranch](Army)),
      (Arm -> Smy, Set[MilitaryBranch](Army)),
      // Con
      (Con -> Bul, Set[MilitaryBranch](Army)),
      (Con -> Bul_EC, Set[MilitaryBranch](Fleet)),
      (Con -> Bul_SC, Set[MilitaryBranch](Fleet)),
      (Con -> Bla, Set[MilitaryBranch](Fleet)),
      (Con -> Smy, Set(Army, Fleet)),
      (Con -> Aeg, Set[MilitaryBranch](Fleet)),
      // Smy
      (Smy -> Syr, Set(Army, Fleet)),
      (Smy -> Eas, Set[MilitaryBranch](Fleet)),
      (Smy -> Aeg, Set[MilitaryBranch](Fleet)),
      // Syr
      (Syr -> Eas, Set[MilitaryBranch](Fleet)),
      // Alb
      (Alb -> Ser, Set[MilitaryBranch](Army)),
      (Alb -> Gre, Set(Army, Fleet)),
      (Alb -> Ion, Set[MilitaryBranch](Fleet)),
      // Bel
      (Bel -> Eng, Set[MilitaryBranch](Fleet)),
      (Bel -> Nth, Set[MilitaryBranch](Fleet)),
      (Bel -> Hol, Set(Army, Fleet)),
      // Bul
      (Bul -> Ser, Set[MilitaryBranch](Army)),
      (Bul -> Rum, Set[MilitaryBranch](Army)),
      (Bul -> Gre, Set[MilitaryBranch](Army)),
      // Bul/EC
      (Bul_EC -> Rum, Set[MilitaryBranch](Fleet)),
      (Bul_EC -> Bla, Set[MilitaryBranch](Fleet)),
      // Bul/SC
      (Bul_SC -> Gre, Set[MilitaryBranch](Fleet)),
      (Bul_SC -> Aeg, Set[MilitaryBranch](Fleet)),
      // Den
      (Den -> Nth, Set[MilitaryBranch](Fleet)),
      (Den -> Ska, Set[MilitaryBranch](Fleet)),
      (Den -> Bal, Set[MilitaryBranch](Fleet)),
      (Den -> Hel, Set[MilitaryBranch](Fleet)),
      // Gre
      (Gre -> Ser, Set[MilitaryBranch](Army)),
      (Gre -> Aeg, Set[MilitaryBranch](Fleet)),
      (Gre -> Ion, Set[MilitaryBranch](Fleet)),
      // Hol
      (Hol -> Nth, Set[MilitaryBranch](Fleet)),
      (Hol -> Hel, Set[MilitaryBranch](Fleet)),
      // Nwy
      (Nwy -> Nrg, Set[MilitaryBranch](Fleet)),
      (Nwy -> Bar, Set[MilitaryBranch](Fleet)),
      (Nwy -> Swe, Set(Army, Fleet)),
      (Nwy -> Ska, Set[MilitaryBranch](Fleet)),
      (Nwy -> Nth, Set[MilitaryBranch](Fleet)),
      // Por
      (Por -> Mid, Set[MilitaryBranch](Fleet)),
      (Por -> Spa, Set[MilitaryBranch](Army)),
      (Por -> Spa_NC, Set[MilitaryBranch](Fleet)),
      (Por -> Spa_SC, Set[MilitaryBranch](Fleet)),
      // Rum
      (Rum -> Ser, Set[MilitaryBranch](Army)),
      (Rum -> Bla, Set[MilitaryBranch](Fleet)),
      // Ser
      // Spa
      // Spa/NC
      (Spa_NC -> Mid, Set[MilitaryBranch](Fleet)),
      // Spa/SC
      (Spa_SC -> Mid, Set[MilitaryBranch](Fleet)),
      (Spa_SC -> GoL, Set[MilitaryBranch](Fleet)),
      (Spa_SC -> Wes, Set[MilitaryBranch](Fleet)),
      // Swe
      (Swe -> Ska, Set[MilitaryBranch](Fleet)),
      (Swe -> Bal, Set[MilitaryBranch](Fleet)),
      (Swe -> Bot, Set[MilitaryBranch](Fleet)),
      (Swe -> Den, Set(Army, Fleet)),
      // Tun
      (Tun -> Wes, Set[MilitaryBranch](Fleet)),
      (Tun -> Tyn, Set[MilitaryBranch](Fleet)),
      (Tun -> Ion, Set[MilitaryBranch](Fleet)),
      (Tun -> NAf, Set(Army, Fleet)),
      // NAf
      (NAf -> Wes, Set[MilitaryBranch](Fleet)),
      (NAf -> Mid, Set[MilitaryBranch](Fleet)),
      // Adr
      (Adr -> Ion, Set[MilitaryBranch](Fleet)),
      // Aeg
      (Aeg -> Eas, Set[MilitaryBranch](Fleet)),
      (Aeg -> Ion, Set[MilitaryBranch](Fleet)),
      // Bal
      (Bal -> Bot, Set[MilitaryBranch](Fleet)),
      // Bar
      (Bar -> Nrg, Set[MilitaryBranch](Fleet)),
      // Bla
      // Eas
      (Eas -> Ion, Set[MilitaryBranch](Fleet)),
      // Eng
      (Eng -> Iri, Set[MilitaryBranch](Fleet)),
      (Eng -> Nth, Set[MilitaryBranch](Fleet)),
      (Eng -> Mid, Set[MilitaryBranch](Fleet)),
      // Bot
      // GoL
      (GoL -> Tyn, Set[MilitaryBranch](Fleet)),
      (GoL -> Wes, Set[MilitaryBranch](Fleet)),
      // Hel
      (Hel -> Nth, Set[MilitaryBranch](Fleet)),
      // Ion
      (Ion -> Tyn, Set[MilitaryBranch](Fleet)),
      // Iri
      (Iri -> NAt, Set[MilitaryBranch](Fleet)),
      (Iri -> Mid, Set[MilitaryBranch](Fleet)),
      // Mid
      (Mid -> NAf, Set[MilitaryBranch](Fleet)),
      (Mid -> Wes, Set[MilitaryBranch](Fleet)),
      // NAt
      (NAt -> Nrg, Set[MilitaryBranch](Fleet)),
      // Nth
      (Nth -> Nrg, Set[MilitaryBranch](Fleet)),
      // Nrg
      // Ska
      // Tyn
      (Tyn -> Wes, Set[MilitaryBranch](Fleet))
      // Wes
  )
  ))
}
