import { locations as $ } from "./location"
import { board } from "./../board"
import { graph } from "./../graph"
import { standardRule } from "./../standardRule"
import { Power } from "./power"
import { MilitaryBranch } from "../standardRule/data"

const { DiplomacyMap, MapEdge } = board
const { LabeledUndirectedGraph } = graph

const { Army, Fleet } = standardRule.MilitaryBranch

export const map = new DiplomacyMap(new LabeledUndirectedGraph([
  // Boh
  new MapEdge<Power, MilitaryBranch>($.Boh, $.Mun, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Boh, $.Sil, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Boh, $.Gal, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Boh, $.Vie, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Boh, $.Tyr, [Army]),
  // Bud
  new MapEdge<Power, MilitaryBranch>($.Bud, $.Vie, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bud, $.Gal, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bud, $.Rum, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bud, $.Ser, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bud, $.Tri, [Army]),
  // Gal
  new MapEdge<Power, MilitaryBranch>($.Gal, $.War, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Gal, $.Ukr, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Gal, $.Rum, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Gal, $.Vie, [Army]),
  // Tri
  new MapEdge<Power, MilitaryBranch>($.Tri, $.Tyr, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Tri, $.Vie, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Tri, $.Ser, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Tri, $.Alb, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Tri, $.Adr, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Tri, $.Ven, [Army, Fleet]),
  // Tyr
  new MapEdge<Power, MilitaryBranch>($.Tyr, $.Mun, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Tyr, $.Vie, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Tyr, $.Ven, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Tyr, $.Pie, [Army]),
  // Vie
  // Cly
  new MapEdge<Power, MilitaryBranch>($.Cly, $.NAt, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Cly, $.Nrg, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Cly, $.Edi, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Cly, $.Lvp, [Army, Fleet]),
  // Edi
  new MapEdge<Power, MilitaryBranch>($.Edi, $.Nrg, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Edi, $.Nth, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Edi, $.Yor, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Edi, $.Lvp, [Army]),
  // Lvp
  new MapEdge<Power, MilitaryBranch>($.Lvp, $.Iri, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Lvp, $.Yor, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Lvp, $.Wal, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Lvp, $.NAt, [Fleet]),
  // Lon
  new MapEdge<Power, MilitaryBranch>($.Lon, $.Wal, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Lon, $.Yor, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Lon, $.Nth, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Lon, $.Eng, [Fleet]),
  // Wal
  new MapEdge<Power, MilitaryBranch>($.Wal, $.Iri, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Wal, $.Yor, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Wal, $.Eng, [Fleet]),
  // Yor
  new MapEdge<Power, MilitaryBranch>($.Yor, $.Nth, [Fleet]),
  // Bre
  new MapEdge<Power, MilitaryBranch>($.Bre, $.Eng, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Bre, $.Pic, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Bre, $.Par, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bre, $.Gas, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Bre, $.Mid, [Fleet]),
  // Bur
  new MapEdge<Power, MilitaryBranch>($.Bur, $.Par, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bur, $.Pic, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bur, $.Bel, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bur, $.Ruh, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bur, $.Mun, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bur, $.Mar, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bur, $.Gas, [Army]),
  // Gas
  new MapEdge<Power, MilitaryBranch>($.Gas, $.Mid, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Gas, $.Par, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Gas, $.Mar, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Gas, $.Spa, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Gas, $.Spa_NC, [Fleet]),
  // Mar
  new MapEdge<Power, MilitaryBranch>($.Mar, $.Spa, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Mar, $.Spa_SC, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Mar, $.GoL, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Mar, $.Pie, [Army, Fleet]),
  // Par
  new MapEdge<Power, MilitaryBranch>($.Par, $.Pic, [Army]),
  // Pic
  new MapEdge<Power, MilitaryBranch>($.Pic, $.Eng, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Pic, $.Bel, [Army, Fleet]),
  // Ber
  new MapEdge<Power, MilitaryBranch>($.Ber, $.Kie, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Ber, $.Bal, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Ber, $.Pru, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Ber, $.Sil, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Ber, $.Mun, [Army]),
  // Kie
  new MapEdge<Power, MilitaryBranch>($.Kie, $.Hel, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Kie, $.Den, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Kie, $.Mun, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Kie, $.Ruh, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Kie, $.Hol, [Army, Fleet]),
  // Mun
  new MapEdge<Power, MilitaryBranch>($.Mun, $.Ruh, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Mun, $.Sil, [Army]),
  // Pru
  new MapEdge<Power, MilitaryBranch>($.Pru, $.Bal, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Pru, $.Lvn, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Pru, $.War, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Pru, $.Sil, [Army]),
  // Ruh
  new MapEdge<Power, MilitaryBranch>($.Ruh, $.Bel, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Ruh, $.Hol, [Army]),
  // Sil
  new MapEdge<Power, MilitaryBranch>($.Sil, $.War, [Army]),
  // Apu
  new MapEdge<Power, MilitaryBranch>($.Apu, $.Ven, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Apu, $.Adr, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Apu, $.Ion, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Apu, $.Nap, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Apu, $.Rom, [Army]),
  // Nap
  new MapEdge<Power, MilitaryBranch>($.Nap, $.Rom, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Nap, $.Ion, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Nap, $.Tyn, [Fleet]),
  // Pie
  new MapEdge<Power, MilitaryBranch>($.Pie, $.Ven, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Pie, $.Tus, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Pie, $.GoL, [Fleet]),
  // Rom
  new MapEdge<Power, MilitaryBranch>($.Rom, $.Tus, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Rom, $.Ven, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Rom, $.Tyn, [Fleet]),
  // Tus
  new MapEdge<Power, MilitaryBranch>($.Tus, $.GoL, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Tus, $.Ven, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Tus, $.Tyn, [Fleet]),
  // Ven
  new MapEdge<Power, MilitaryBranch>($.Ven, $.Adr, [Fleet]),
  // Fin
  new MapEdge<Power, MilitaryBranch>($.Fin, $.Nwy, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Fin, $.Swe, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Fin, $.Bot, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Fin, $.StP, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Fin, $.StP_SC, [Fleet]),
  // Lvn
  new MapEdge<Power, MilitaryBranch>($.Lvn, $.Bot, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Lvn, $.StP, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Lvn, $.StP_SC, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Lvn, $.Mos, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Lvn, $.War, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Lvn, $.Bal, [Fleet]),
  // Mos
  new MapEdge<Power, MilitaryBranch>($.Mos, $.StP, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Mos, $.Sev, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Mos, $.Ukr, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Mos, $.War, [Army]),
  // Sev
  new MapEdge<Power, MilitaryBranch>($.Sev, $.Ukr, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Sev, $.Arm, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Sev, $.Bla, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Sev, $.Rum, [Army, Fleet]),
  // StP
  new MapEdge<Power, MilitaryBranch>($.StP, $.Nwy, [Army]),
  // StP/NC
  new MapEdge<Power, MilitaryBranch>($.StP_NC, $.Nwy, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.StP_NC, $.Bar, [Fleet]),
  // StP/SC
  new MapEdge<Power, MilitaryBranch>($.StP_SC, $.Bot, [Fleet]),
  // Ukr
  new MapEdge<Power, MilitaryBranch>($.Ukr, $.War, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Ukr, $.Rum, [Army]),
  // War
  // Ank
  new MapEdge<Power, MilitaryBranch>($.Ank, $.Bla, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Ank, $.Arm, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Ank, $.Smy, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Ank, $.Con, [Army, Fleet]),
  // Arm
  new MapEdge<Power, MilitaryBranch>($.Arm, $.Bla, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Arm, $.Syr, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Arm, $.Smy, [Army]),
  // Con
  new MapEdge<Power, MilitaryBranch>($.Con, $.Bul, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Con, $.Bul_EC, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Con, $.Bul_SC, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Con, $.Bla, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Con, $.Smy, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Con, $.Aeg, [Fleet]),
  // Smy
  new MapEdge<Power, MilitaryBranch>($.Smy, $.Syr, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Smy, $.Eas, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Smy, $.Aeg, [Fleet]),
  // Syr
  new MapEdge<Power, MilitaryBranch>($.Syr, $.Eas, [Fleet]),
  // Alb
  new MapEdge<Power, MilitaryBranch>($.Alb, $.Ser, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Alb, $.Gre, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Alb, $.Ion, [Fleet]),
  // Bel
  new MapEdge<Power, MilitaryBranch>($.Bel, $.Eng, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Bel, $.Nth, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Bel, $.Hol, [Army, Fleet]),
  // Bul
  new MapEdge<Power, MilitaryBranch>($.Bul, $.Ser, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bul, $.Rum, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Bul, $.Gre, [Army]),
  // Bul/EC
  new MapEdge<Power, MilitaryBranch>($.Bul_EC, $.Rum, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Bul_EC, $.Bla, [Fleet]),
  // Bul/SC
  new MapEdge<Power, MilitaryBranch>($.Bul_SC, $.Gre, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Bul_SC, $.Aeg, [Fleet]),
  // Den
  new MapEdge<Power, MilitaryBranch>($.Den, $.Nth, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Den, $.Ska, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Den, $.Bal, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Den, $.Hel, [Fleet]),
  // Gre
  new MapEdge<Power, MilitaryBranch>($.Gre, $.Ser, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Gre, $.Aeg, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Gre, $.Ion, [Fleet]),
  // Hol
  new MapEdge<Power, MilitaryBranch>($.Hol, $.Nth, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Hol, $.Hel, [Fleet]),
  // Nwy
  new MapEdge<Power, MilitaryBranch>($.Nwy, $.Nrg, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Nwy, $.Bar, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Nwy, $.Swe, [Army, Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Nwy, $.Ska, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Nwy, $.Nth, [Fleet]),
  // Por
  new MapEdge<Power, MilitaryBranch>($.Por, $.Mid, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Por, $.Spa, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Por, $.Spa_NC, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Por, $.Spa_SC, [Fleet]),
  // Rum
  new MapEdge<Power, MilitaryBranch>($.Rum, $.Ser, [Army]),
  new MapEdge<Power, MilitaryBranch>($.Rum, $.Bla, [Fleet]),
  // Ser
  // Spa
  // Spa/NC
  new MapEdge<Power, MilitaryBranch>($.Spa_NC, $.Mid, [Fleet]),
  // Spa/SC
  new MapEdge<Power, MilitaryBranch>($.Spa_SC, $.Mid, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Spa_SC, $.GoL, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Spa_SC, $.Wes, [Fleet]),
  // Swe
  new MapEdge<Power, MilitaryBranch>($.Swe, $.Ska, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Swe, $.Bal, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Swe, $.Bot, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Swe, $.Den, [Army, Fleet]),
  // Tun
  new MapEdge<Power, MilitaryBranch>($.Tun, $.Wes, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Tun, $.Tyn, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Tun, $.Ion, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Tun, $.NAf, [Army, Fleet]),
  // NAf
  new MapEdge<Power, MilitaryBranch>($.NAf, $.Wes, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.NAf, $.Mid, [Fleet]),
  // Adr
  new MapEdge<Power, MilitaryBranch>($.Adr, $.Ion, [Fleet]),
  // Aeg
  new MapEdge<Power, MilitaryBranch>($.Aeg, $.Eas, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Aeg, $.Ion, [Fleet]),
  // Bal
  new MapEdge<Power, MilitaryBranch>($.Bal, $.Bot, [Fleet]),
  // Bar
  new MapEdge<Power, MilitaryBranch>($.Bar, $.Nrg, [Fleet]),
  // Bla
  // Eas
  new MapEdge<Power, MilitaryBranch>($.Eas, $.Ion, [Fleet]),
  // Eng
  new MapEdge<Power, MilitaryBranch>($.Eng, $.Iri, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Eng, $.Nth, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Eng, $.Mid, [Fleet]),
  // Bot
  // GoL
  new MapEdge<Power, MilitaryBranch>($.GoL, $.Tyn, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.GoL, $.Wes, [Fleet]),
  // Hel
  new MapEdge<Power, MilitaryBranch>($.Hel, $.Nth, [Fleet]),
  // Ion
  new MapEdge<Power, MilitaryBranch>($.Ion, $.Tyn, [Fleet]),
  // Iri
  new MapEdge<Power, MilitaryBranch>($.Iri, $.NAt, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Iri, $.Mid, [Fleet]),
  // Mid
  new MapEdge<Power, MilitaryBranch>($.Mid, $.NAf, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Mid, $.Wes, [Fleet]),
  new MapEdge<Power, MilitaryBranch>($.Mid, $.NAt, [Fleet]),
  // NAt
  new MapEdge<Power, MilitaryBranch>($.NAt, $.Nrg, [Fleet]),
  // Nth
  new MapEdge<Power, MilitaryBranch>($.Nth, $.Nrg, [Fleet]),
  // Nrg
  // Ska
  // Tyn
  new MapEdge<Power, MilitaryBranch>($.Tyn, $.Wes, [Fleet])
  // Wes
]))
