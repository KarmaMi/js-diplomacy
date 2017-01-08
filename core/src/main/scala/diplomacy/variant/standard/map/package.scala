package diplomacy.variant.standard

import diplomacy.board._
import diplomacy.variant.standard.rule.MilitaryBranch
import diplomacy.util.LabeledUndirectedGraph

package object map extends DiplomacyMap.TypeHelper {
  type Power = diplomacy.variant.standard.map.Power.Power
  type MilitaryBranch = diplomacy.variant.standard.rule.MilitaryBranch.MilitaryBranch

  private[this] val inland = Set[Province](
    Province(Name("Bohemia", "Boh"), Option(Power.Austria), false),
    Province(Name("Budapest", "Bud"), Option(Power.Austria), true),
    Province(Name("Galicia", "Gal"), Option(Power.Austria), false),
    Province(Name("Tyrolia", "Tyr"), Option(Power.Austria), false),
    Province(Name("Vienna", "Vie"), Option(Power.Austria), true),
    Province(Name("Burgundy", "Bur"), Option(Power.France), false),
    Province(Name("Paris", "Par"), Option(Power.France), true),
    Province(Name("Munich", "Mun"), Option(Power.Germany), true),
    Province(Name("Ruhr", "Ruh"), Option(Power.Germany), false),
    Province(Name("Silesia", "Sil"), Option(Power.Germany), false),
    Province(Name("Moscow", "Mos"), Option(Power.Russia), true),
    Province(Name("Ukraine", "Ukr"), Option(Power.Russia), false),
    Province(Name("Warsaw", "War"), Option(Power.Russia), true),
    Province(Name("Serbia", "Ser"), None, true)
  )
  private[this] val coast = Set[Province](
    Province(Name("Trieste", "Tri"), Option(Power.Austria), true),
    Province(Name("Clyde", "Cly"), Option(Power.England), false),
    Province(Name("Edinburgh", "Edi"), Option(Power.England), true),
    Province(Name("Liverpool", "Lvp"), Option(Power.England), true),
    Province(Name("London", "Lon"), Option(Power.England), true),
    Province(Name("Wales", "Wal"), Option(Power.England), false),
    Province(Name("Yorkshire", "Yor"), Option(Power.England), false),
    Province(Name("Brest", "Bre"), Option(Power.France), true),
    Province(Name("Gascony", "Gas"), Option(Power.France), false),
    Province(Name("Marseilles", "Mar"), Option(Power.France), true),
    Province(Name("Picardy", "Pic"), Option(Power.France), false),
    Province(Name("Berlin", "Ber"), Option(Power.Germany), true),
    Province(Name("Kiel", "Kie"), Option(Power.Germany), true),
    Province(Name("Prussia", "Pru"), Option(Power.Germany), false),
    Province(Name("Apulia", "Apu"), Option(Power.Italy), false),
    Province(Name("Naples", "Nap"), Option(Power.Italy), true),
    Province(Name("Piedmont", "Pie"), Option(Power.Italy), false),
    Province(Name("Rome", "Rom"), Option(Power.Italy), true),
    Province(Name("Tuscany", "Tus"), Option(Power.Italy), false),
    Province(Name("Venice", "Ven"), Option(Power.Italy), true),
    Province(Name("Finland", "Fin"), Option(Power.Russia), false),
    Province(Name("Livonia", "Lvn"), Option(Power.Russia), false),
    Province(Name("Sevastopol", "Sev"), Option(Power.Russia), true),
    Province(Name("Ankara", "Ank"), Option(Power.Turkey), true),
    Province(Name("Armenia", "Arm"), Option(Power.Turkey), false),
    Province(Name("Constantinople", "Con"), Option(Power.Turkey), true),
    Province(Name("Smyrna", "Smy"), Option(Power.Turkey), true),
    Province(Name("Syria", "Syr"), Option(Power.Turkey), false),
    Province(Name("Albania", "Alb"), None, false),
    Province(Name("Belgium", "Bel"), None, true),
    Province(Name("Denmark", "Den"), None, true),
    Province(Name("Greece", "Gre"), None, true),
    Province(Name("Holland", "Hol"), None, true),
    Province(Name("Norway", "Nwy"), None, true),
    Province(Name("Portugal", "Por"), None, true),
    Province(Name("Rumania", "Rum"), None, true),
    Province(Name("Sweden", "Swe"), None, true),
    Province(Name("Tunis", "Tun"), None, true),
    Province(Name("North Africa", "NAf"), None, false)
  )
  private[this] val specialCoast = Set[Province](
    Province(Name("St. Petersburg", "StP"), Option(Power.Russia), true),
    Province(Name("Bulgaria", "Bul"), None, true),
    Province(Name("Spain", "Spa"), None, true)
  )
  private[this] val sea = Set[Province](
    Province(Name("Adriatic Sea", "Adr"), None, false),
    Province(Name("Aegean Sea", "Aeg"), None, false),
    Province(Name("Baltic Sea", "Bal"), None, false),
    Province(Name("Barents Sea", "Bar"), None, false),
    Province(Name("Black Sea", "Bla"), None, false),
    Province(Name("Eastern Mediterranean", "Eas"), None, false),
    Province(Name("English Channel", "Eng"), None, false),
    Province(Name("Gulf of Bothnia", "Bot"), None, false),
    Province(Name("Gulf of Lyon", "GoL"), None, false),
    Province(Name("Helgoland Bight", "Hel"), None, false),
    Province(Name("Ionian Sea", "Ion"), None, false),
    Province(Name("Irish Sea", "Iri"), None, false),
    Province(Name("Mid-Atlantic Ocean", "Mid"), None, false),
    Province(Name("North Atlantic Ocean", "NAt"), None, false),
    Province(Name("North Sea", "Nth"), None, false),
    Province(Name("Norwegian Sea", "Nrg"), None, false),
    Province(Name("Skagerrak", "Ska"), None, false),
    Province(Name("Tyrrhenian Sea", "Tyn"), None, false),
    Province(Name("Western Mediterranean", "Wes"), None, false)
  )

  private[this] val locations: Set[Location] = {
    val south = Name("South Coast", "SC")
    val north = Name("North Coast", "NC")
    val east = Name("East Coast", "EC")

    def addCoast(provinceName: Name, coastName: Name) = {
      Name(
        s"${provinceName.name}_${coastName.name}",
        s"${provinceName.abbreviatedName}_${coastName.abbreviatedName}"
      )
    }

    (inland map { l => Location(l, Set[MilitaryBranch](MilitaryBranch.Army)) }) ++
    (coast map {
      c => Location(c, Set[MilitaryBranch](MilitaryBranch.Army, MilitaryBranch.Fleet))
    }) ++
    (specialCoast flatMap {
      case p if p.name == Name("Bulgaria", "Bul") =>
        Set[Location](
          Location(p, Set(MilitaryBranch.Army)),
          Location(addCoast(p.name, south), p, Set(MilitaryBranch.Fleet)),
          Location(addCoast(p.name, east), p, Set(MilitaryBranch.Fleet))
        )
      case p =>
        Set[Location](
          Location(p, Set(MilitaryBranch.Army)),
          Location(addCoast(p.name, south), p, Set(MilitaryBranch.Fleet)),
          Location(addCoast(p.name, north), p, Set(MilitaryBranch.Fleet))
        )
    }) ++
    (sea map { s => Location(s, Set[MilitaryBranch](MilitaryBranch.Fleet)) })
  }

  private[this] val $ = LocationHelper(locations)

  private[this] val edges = Set[((Location, Location), Set[MilitaryBranch])](
    // Boh
    ($.Boh -> $.Mun, Set(MilitaryBranch.Army)),
    ($.Boh -> $.Sil, Set(MilitaryBranch.Army)),
    ($.Boh -> $.Gal, Set(MilitaryBranch.Army)),
    ($.Boh -> $.Vie, Set(MilitaryBranch.Army)),
    ($.Boh -> $.Tyr, Set(MilitaryBranch.Army)),
    // Bud
    ($.Bud -> $.Vie, Set(MilitaryBranch.Army)),
    ($.Bud -> $.Gal, Set(MilitaryBranch.Army)),
    ($.Bud -> $.Rum, Set(MilitaryBranch.Army)),
    ($.Bud -> $.Ser, Set(MilitaryBranch.Army)),
    ($.Bud -> $.Tri, Set(MilitaryBranch.Army)),
    // Gal
    ($.Gal -> $.War, Set(MilitaryBranch.Army)),
    ($.Gal -> $.Ukr, Set(MilitaryBranch.Army)),
    ($.Gal -> $.Rum, Set(MilitaryBranch.Army)),
    ($.Gal -> $.Vie, Set(MilitaryBranch.Army)),
    // Tri
    ($.Tri -> $.Tyr, Set(MilitaryBranch.Army)),
    ($.Tri -> $.Vie, Set(MilitaryBranch.Army)),
    ($.Tri -> $.Ser, Set(MilitaryBranch.Army)),
    ($.Tri -> $.Alb, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Tri -> $.Adr, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Tri -> $.Ven, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Tyr
    ($.Tyr -> $.Mun, Set(MilitaryBranch.Army)),
    ($.Tyr -> $.Vie, Set(MilitaryBranch.Army)),
    ($.Tyr -> $.Ven, Set(MilitaryBranch.Army)),
    ($.Tyr -> $.Pie, Set(MilitaryBranch.Army)),
    // Vie
    // Cly
    ($.Cly -> $.NAt, Set(MilitaryBranch.Fleet)),
    ($.Cly -> $.Nrg, Set(MilitaryBranch.Fleet)),
    ($.Cly -> $.Edi, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Cly -> $.Lvp, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Edi
    ($.Edi -> $.Nrg, Set(MilitaryBranch.Fleet)),
    ($.Edi -> $.Nth, Set(MilitaryBranch.Fleet)),
    ($.Edi -> $.Yor, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Edi -> $.Lvp, Set(MilitaryBranch.Army)),
    // Lvp
    ($.Lvp -> $.Iri, Set(MilitaryBranch.Fleet)),
    ($.Lvp -> $.Yor, Set(MilitaryBranch.Army)),
    ($.Lvp -> $.Wal, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Lon
    ($.Lon -> $.Wal, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Lon -> $.Yor, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Lon -> $.Nth, Set(MilitaryBranch.Fleet)),
    ($.Lon -> $.Eng, Set(MilitaryBranch.Fleet)),
    // Wal
    ($.Wal -> $.Iri, Set(MilitaryBranch.Fleet)),
    ($.Wal -> $.Yor, Set(MilitaryBranch.Army)),
    ($.Wal -> $.Eng, Set(MilitaryBranch.Fleet)),
    // Yor
    ($.Yor -> $.Nth, Set(MilitaryBranch.Fleet)),
    // Bre
    ($.Bre -> $.Eng, Set(MilitaryBranch.Fleet)),
    ($.Bre -> $.Pic, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Bre -> $.Par, Set(MilitaryBranch.Army)),
    ($.Bre -> $.Gas, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Bre -> $.Mid, Set(MilitaryBranch.Fleet)),
    // Bur
    ($.Bur -> $.Par, Set(MilitaryBranch.Army)),
    ($.Bur -> $.Pic, Set(MilitaryBranch.Army)),
    ($.Bur -> $.Bel, Set(MilitaryBranch.Army)),
    ($.Bur -> $.Ruh, Set(MilitaryBranch.Army)),
    ($.Bur -> $.Mun, Set(MilitaryBranch.Army)),
    ($.Bur -> $.Mar, Set(MilitaryBranch.Army)),
    ($.Bur -> $.Gas, Set(MilitaryBranch.Army)),
    // Gas
    ($.Gas -> $.Mid, Set(MilitaryBranch.Fleet)),
    ($.Gas -> $.Par, Set(MilitaryBranch.Army)),
    ($.Gas -> $.Mar, Set(MilitaryBranch.Army)),
    ($.Gas -> $.Spa, Set(MilitaryBranch.Army)),
    ($.Gas -> $.Spa_NC, Set(MilitaryBranch.Fleet)),
    // Mar
    ($.Mar -> $.Spa, Set(MilitaryBranch.Army)),
    ($.Mar -> $.Spa_SC, Set(MilitaryBranch.Fleet)),
    ($.Mar -> $.GoL, Set(MilitaryBranch.Fleet)),
    ($.Mar -> $.Pie, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Par
    ($.Par -> $.Pic, Set(MilitaryBranch.Army)),
    // Pic
    ($.Pic -> $.Eng, Set(MilitaryBranch.Fleet)),
    ($.Pic -> $.Bel, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Ber
    ($.Ber -> $.Kie, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Ber -> $.Bal, Set(MilitaryBranch.Fleet)),
    ($.Ber -> $.Pru, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Ber -> $.Sil, Set(MilitaryBranch.Army)),
    ($.Ber -> $.Mun, Set(MilitaryBranch.Army)),
    // Kie
    ($.Kie -> $.Hel, Set(MilitaryBranch.Fleet)),
    ($.Kie -> $.Den, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Kie -> $.Mun, Set(MilitaryBranch.Army)),
    ($.Kie -> $.Ruh, Set(MilitaryBranch.Army)),
    ($.Kie -> $.Hol, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Mun
    ($.Mun -> $.Ruh, Set(MilitaryBranch.Army)),
    ($.Mun -> $.Sil, Set(MilitaryBranch.Army)),
    // Pru
    ($.Pru -> $.Bal, Set(MilitaryBranch.Fleet)),
    ($.Pru -> $.Lvn, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Pru -> $.War, Set(MilitaryBranch.Army)),
    ($.Pru -> $.Sil, Set(MilitaryBranch.Army)),
    // Ruh
    ($.Ruh -> $.Bel, Set(MilitaryBranch.Army)),
    ($.Ruh -> $.Hol, Set(MilitaryBranch.Army)),
    // Sil
    ($.Sil -> $.War, Set(MilitaryBranch.Army)),
    // Apu
    ($.Apu -> $.Ven, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Apu -> $.Adr, Set(MilitaryBranch.Fleet)),
    ($.Apu -> $.Ion, Set(MilitaryBranch.Fleet)),
    ($.Apu -> $.Nap, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Apu -> $.Rom, Set(MilitaryBranch.Army)),
    // Nap
    ($.Nap -> $.Rom, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Nap -> $.Ion, Set(MilitaryBranch.Fleet)),
    ($.Nap -> $.Tyn, Set(MilitaryBranch.Fleet)),
    // Pie
    ($.Pie -> $.Ven, Set(MilitaryBranch.Army)),
    ($.Pie -> $.Tus, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Pie -> $.GoL, Set(MilitaryBranch.Fleet)),
    // Rom
    ($.Rom -> $.Tus, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Rom -> $.Ven, Set(MilitaryBranch.Army)),
    ($.Rom -> $.Tyn, Set(MilitaryBranch.Fleet)),
    // Tus
    ($.Tus -> $.GoL, Set(MilitaryBranch.Fleet)),
    ($.Tus -> $.Ven, Set(MilitaryBranch.Army)),
    ($.Tus -> $.Tyn, Set(MilitaryBranch.Fleet)),
    // Ven
    ($.Ven -> $.Adr, Set(MilitaryBranch.Fleet)),
    // Fin
    ($.Fin -> $.Nwy, Set(MilitaryBranch.Army)),
    ($.Fin -> $.Swe, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Fin -> $.Bot, Set(MilitaryBranch.Fleet)),
    ($.Fin -> $.StP, Set(MilitaryBranch.Army)),
    ($.Fin -> $.StP_SC, Set(MilitaryBranch.Fleet)),
    // Lvn
    ($.Lvn -> $.Bot, Set(MilitaryBranch.Fleet)),
    ($.Lvn -> $.StP, Set(MilitaryBranch.Army)),
    ($.Lvn -> $.StP_SC, Set(MilitaryBranch.Fleet)),
    ($.Lvn -> $.Mos, Set(MilitaryBranch.Army)),
    ($.Lvn -> $.War, Set(MilitaryBranch.Army)),
    ($.Lvn -> $.Bal, Set(MilitaryBranch.Fleet)),
    // Mos
    ($.Mos -> $.StP, Set(MilitaryBranch.Army)),
    ($.Mos -> $.Sev, Set(MilitaryBranch.Army)),
    ($.Mos -> $.Ukr, Set(MilitaryBranch.Army)),
    ($.Mos -> $.War, Set(MilitaryBranch.Army)),
    // Sev
    ($.Sev -> $.Ukr, Set(MilitaryBranch.Army)),
    ($.Sev -> $.Arm, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Sev -> $.Bla, Set(MilitaryBranch.Fleet)),
    ($.Sev -> $.Rum, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // StP
    ($.StP -> $.Nwy, Set(MilitaryBranch.Army)),
    // StP/NC
    ($.StP_NC -> $.Nwy, Set(MilitaryBranch.Fleet)),
    ($.StP_NC -> $.Bar, Set(MilitaryBranch.Fleet)),
    // StP/SC
    ($.StP_SC -> $.Bot, Set(MilitaryBranch.Fleet)),
    // Ukr
    ($.Ukr -> $.War, Set(MilitaryBranch.Army)),
    ($.Ukr -> $.Rum, Set(MilitaryBranch.Army)),
    // War
    // Ank
    ($.Ank -> $.Bla, Set(MilitaryBranch.Fleet)),
    ($.Ank -> $.Arm, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Ank -> $.Smy, Set(MilitaryBranch.Army)),
    ($.Ank -> $.Con, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Arm
    ($.Arm -> $.Bla, Set(MilitaryBranch.Fleet)),
    ($.Arm -> $.Syr, Set(MilitaryBranch.Army)),
    ($.Arm -> $.Smy, Set(MilitaryBranch.Army)),
    // Con
    ($.Con -> $.Bul, Set(MilitaryBranch.Army)),
    ($.Con -> $.Bul_EC, Set(MilitaryBranch.Fleet)),
    ($.Con -> $.Bul_SC, Set(MilitaryBranch.Fleet)),
    ($.Con -> $.Bla, Set(MilitaryBranch.Fleet)),
    ($.Con -> $.Smy, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Con -> $.Aeg, Set(MilitaryBranch.Fleet)),
    // Smy
    ($.Smy -> $.Syr, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Smy -> $.Eas, Set(MilitaryBranch.Fleet)),
    ($.Smy -> $.Aeg, Set(MilitaryBranch.Fleet)),
    // Syr
    ($.Syr -> $.Eas, Set(MilitaryBranch.Fleet)),
    // Alb
    ($.Alb -> $.Ser, Set(MilitaryBranch.Army)),
    ($.Alb -> $.Gre, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Alb -> $.Ion, Set(MilitaryBranch.Fleet)),
    // Bel
    ($.Bel -> $.Eng, Set(MilitaryBranch.Fleet)),
    ($.Bel -> $.Nth, Set(MilitaryBranch.Fleet)),
    ($.Bel -> $.Hol, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Bul
    ($.Bul -> $.Ser, Set(MilitaryBranch.Army)),
    ($.Bul -> $.Rum, Set(MilitaryBranch.Army)),
    ($.Bul -> $.Gre, Set(MilitaryBranch.Army)),
    // Bul/EC
    ($.Bul_EC -> $.Rum, Set(MilitaryBranch.Fleet)),
    ($.Bul_EC -> $.Bla, Set(MilitaryBranch.Fleet)),
    // Bul/SC
    ($.Bul_SC -> $.Gre, Set(MilitaryBranch.Fleet)),
    ($.Bul_SC -> $.Aeg, Set(MilitaryBranch.Fleet)),
    // Den
    ($.Den -> $.Nth, Set(MilitaryBranch.Fleet)),
    ($.Den -> $.Ska, Set(MilitaryBranch.Fleet)),
    ($.Den -> $.Bal, Set(MilitaryBranch.Fleet)),
    ($.Den -> $.Hel, Set(MilitaryBranch.Fleet)),
    // Gre
    ($.Gre -> $.Ser, Set(MilitaryBranch.Army)),
    ($.Gre -> $.Aeg, Set(MilitaryBranch.Fleet)),
    ($.Gre -> $.Ion, Set(MilitaryBranch.Fleet)),
    // Hol
    ($.Hol -> $.Nth, Set(MilitaryBranch.Fleet)),
    ($.Hol -> $.Hel, Set(MilitaryBranch.Fleet)),
    // Nwy
    ($.Nwy -> $.Nrg, Set(MilitaryBranch.Fleet)),
    ($.Nwy -> $.Bar, Set(MilitaryBranch.Fleet)),
    ($.Nwy -> $.Swe, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    ($.Nwy -> $.Ska, Set(MilitaryBranch.Fleet)),
    ($.Nwy -> $.Nth, Set(MilitaryBranch.Fleet)),
    // Por
    ($.Por -> $.Mid, Set(MilitaryBranch.Fleet)),
    ($.Por -> $.Spa, Set(MilitaryBranch.Army)),
    ($.Por -> $.Spa_NC, Set(MilitaryBranch.Fleet)),
    ($.Por -> $.Spa_SC, Set(MilitaryBranch.Fleet)),
    // Rum
    ($.Rum -> $.Ser, Set(MilitaryBranch.Army)),
    ($.Rum -> $.Bla, Set(MilitaryBranch.Fleet)),
    // Ser
    // Spa
    // Spa/NC
    ($.Spa_NC -> $.Mid, Set(MilitaryBranch.Fleet)),
    // Spa/SC
    ($.Spa_SC -> $.Mid, Set(MilitaryBranch.Fleet)),
    ($.Spa_SC -> $.GoL, Set(MilitaryBranch.Fleet)),
    ($.Spa_SC -> $.Wes, Set(MilitaryBranch.Fleet)),
    // Swe
    ($.Swe -> $.Ska, Set(MilitaryBranch.Fleet)),
    ($.Swe -> $.Bal, Set(MilitaryBranch.Fleet)),
    ($.Swe -> $.Bot, Set(MilitaryBranch.Fleet)),
    ($.Swe -> $.Den, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // Tun
    ($.Tun -> $.Wes, Set(MilitaryBranch.Fleet)),
    ($.Tun -> $.Tyn, Set(MilitaryBranch.Fleet)),
    ($.Tun -> $.Ion, Set(MilitaryBranch.Fleet)),
    ($.Tun -> $.NAf, Set(MilitaryBranch.Army, MilitaryBranch.Fleet)),
    // NAf
    ($.NAf -> $.Wes, Set(MilitaryBranch.Fleet)),
    ($.NAf -> $.Mid, Set(MilitaryBranch.Fleet)),
    // Adr
    ($.Adr -> $.Ion, Set(MilitaryBranch.Fleet)),
    // Aeg
    ($.Aeg -> $.Eas, Set(MilitaryBranch.Fleet)),
    ($.Aeg -> $.Ion, Set(MilitaryBranch.Fleet)),
    // Bal
    ($.Bal -> $.Bot, Set(MilitaryBranch.Fleet)),
    // Bar
    ($.Bar -> $.Nrg, Set(MilitaryBranch.Fleet)),
    // Bla
    // Eas
    ($.Eas -> $.Ion, Set(MilitaryBranch.Fleet)),
    // Eng
    ($.Eng -> $.Iri, Set(MilitaryBranch.Fleet)),
    ($.Eng -> $.Nth, Set(MilitaryBranch.Fleet)),
    ($.Eng -> $.Mid, Set(MilitaryBranch.Fleet)),
    // Bot
    // GoL
    ($.GoL -> $.Tyn, Set(MilitaryBranch.Fleet)),
    ($.GoL -> $.Wes, Set(MilitaryBranch.Fleet)),
    // Hel
    ($.Hel -> $.Nth, Set(MilitaryBranch.Fleet)),
    // Ion
    ($.Ion -> $.Tyn, Set(MilitaryBranch.Fleet)),
    // Iri
    ($.Iri -> $.NAt, Set(MilitaryBranch.Fleet)),
    ($.Iri -> $.Mid, Set(MilitaryBranch.Fleet)),
    // Mid
    ($.Mid -> $.NAf, Set(MilitaryBranch.Fleet)),
    ($.Mid -> $.Wes, Set(MilitaryBranch.Fleet)),
    // NAt
    ($.NAt -> $.Nrg, Set(MilitaryBranch.Fleet)),
    // Nth
    ($.Nth -> $.Nrg, Set(MilitaryBranch.Fleet)),
    // Nrg
    // Ska
    // Tyn
    ($.Tyn -> $.Wes, Set(MilitaryBranch.Fleet))
    // Wes
  )

  val map = DiplomacyMap(LabeledUndirectedGraph(locations, edges))
}
