package diplomacy.variant.standard.map

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }
import scala.annotation.meta.field

import diplomacy.board.{ Name, Province }
import diplomacy.variant.standard.rule._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.map.Keywords._
import diplomacy.util.LabeledUndirectedGraph

@JSExport
object DiplomacyMap {
  @JSExport
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
