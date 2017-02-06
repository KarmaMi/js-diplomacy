const $ = require('./location')
const { DiplomacyMap, MapEdge } = require('../../../board/package')
const { Army, Fleet } = require('../rule/military-branch')

// Map
module.exports = new DiplomacyMap([
  // Boh
  new MapEdge($.Boh, $.Mun, [Army]),
  new MapEdge($.Boh, $.Sil, [Army]),
  new MapEdge($.Boh, $.Gal, [Army]),
  new MapEdge($.Boh, $.Vie, [Army]),
  new MapEdge($.Boh, $.Tyr, [Army]),
  // Bud
  new MapEdge($.Bud, $.Vie, [Army]),
  new MapEdge($.Bud, $.Gal, [Army]),
  new MapEdge($.Bud, $.Rum, [Army]),
  new MapEdge($.Bud, $.Ser, [Army]),
  new MapEdge($.Bud, $.Tri, [Army]),
  // Gal
  new MapEdge($.Gal, $.War, [Army]),
  new MapEdge($.Gal, $.Ukr, [Army]),
  new MapEdge($.Gal, $.Rum, [Army]),
  new MapEdge($.Gal, $.Vie, [Army]),
  // Tri
  new MapEdge($.Tri, $.Tyr, [Army]),
  new MapEdge($.Tri, $.Vie, [Army]),
  new MapEdge($.Tri, $.Ser, [Army]),
  new MapEdge($.Tri, $.Alb, [Army, Fleet]),
  new MapEdge($.Tri, $.Adr, [Fleet]),
  new MapEdge($.Tri, $.Ven, [Army, Fleet]),
  // Tyr
  new MapEdge($.Tyr, $.Mun, [Army]),
  new MapEdge($.Tyr, $.Vie, [Army]),
  new MapEdge($.Tyr, $.Ven, [Army]),
  new MapEdge($.Tyr, $.Pie, [Army]),
  // Vie
  // Cly
  new MapEdge($.Cly, $.NAt, [Fleet]),
  new MapEdge($.Cly, $.Nrg, [Fleet]),
  new MapEdge($.Cly, $.Edi, [Army, Fleet]),
  new MapEdge($.Cly, $.Lvp, [Army, Fleet]),
  // Edi
  new MapEdge($.Edi, $.Nrg, [Fleet]),
  new MapEdge($.Edi, $.Nth, [Fleet]),
  new MapEdge($.Edi, $.Yor, [Army, Fleet]),
  new MapEdge($.Edi, $.Lvp, [Army]),
  // Lvp
  new MapEdge($.Lvp, $.Iri, [Fleet]),
  new MapEdge($.Lvp, $.Yor, [Army]),
  new MapEdge($.Lvp, $.Wal, [Army, Fleet]),
  // Lon
  new MapEdge($.Lon, $.Wal, [Army, Fleet]),
  new MapEdge($.Lon, $.Yor, [Army, Fleet]),
  new MapEdge($.Lon, $.Nth, [Fleet]),
  new MapEdge($.Lon, $.Eng, [Fleet]),
  // Wal
  new MapEdge($.Wal, $.Iri, [Fleet]),
  new MapEdge($.Wal, $.Yor, [Army]),
  new MapEdge($.Wal, $.Eng, [Fleet]),
  // Yor
  new MapEdge($.Yor, $.Nth, [Fleet]),
  // Bre
  new MapEdge($.Bre, $.Eng, [Fleet]),
  new MapEdge($.Bre, $.Pic, [Army, Fleet]),
  new MapEdge($.Bre, $.Par, [Army]),
  new MapEdge($.Bre, $.Gas, [Army, Fleet]),
  new MapEdge($.Bre, $.Mid, [Fleet]),
  // Bur
  new MapEdge($.Bur, $.Par, [Army]),
  new MapEdge($.Bur, $.Pic, [Army]),
  new MapEdge($.Bur, $.Bel, [Army]),
  new MapEdge($.Bur, $.Ruh, [Army]),
  new MapEdge($.Bur, $.Mun, [Army]),
  new MapEdge($.Bur, $.Mar, [Army]),
  new MapEdge($.Bur, $.Gas, [Army]),
  // Gas
  new MapEdge($.Gas, $.Mid, [Fleet]),
  new MapEdge($.Gas, $.Par, [Army]),
  new MapEdge($.Gas, $.Mar, [Army]),
  new MapEdge($.Gas, $.Spa, [Army]),
  new MapEdge($.Gas, $.Spa_NC, [Fleet]),
  // Mar
  new MapEdge($.Mar, $.Spa, [Army]),
  new MapEdge($.Mar, $.Spa_SC, [Fleet]),
  new MapEdge($.Mar, $.GoL, [Fleet]),
  new MapEdge($.Mar, $.Pie, [Army, Fleet]),
  // Par
  new MapEdge($.Par, $.Pic, [Army]),
  // Pic
  new MapEdge($.Pic, $.Eng, [Fleet]),
  new MapEdge($.Pic, $.Bel, [Army, Fleet]),
  // Ber
  new MapEdge($.Ber, $.Kie, [Army, Fleet]),
  new MapEdge($.Ber, $.Bal, [Fleet]),
  new MapEdge($.Ber, $.Pru, [Army, Fleet]),
  new MapEdge($.Ber, $.Sil, [Army]),
  new MapEdge($.Ber, $.Mun, [Army]),
  // Kie
  new MapEdge($.Kie, $.Hel, [Fleet]),
  new MapEdge($.Kie, $.Den, [Army, Fleet]),
  new MapEdge($.Kie, $.Mun, [Army]),
  new MapEdge($.Kie, $.Ruh, [Army]),
  new MapEdge($.Kie, $.Hol, [Army, Fleet]),
  // Mun
  new MapEdge($.Mun, $.Ruh, [Army]),
  new MapEdge($.Mun, $.Sil, [Army]),
  // Pru
  new MapEdge($.Pru, $.Bal, [Fleet]),
  new MapEdge($.Pru, $.Lvn, [Army, Fleet]),
  new MapEdge($.Pru, $.War, [Army]),
  new MapEdge($.Pru, $.Sil, [Army]),
  // Ruh
  new MapEdge($.Ruh, $.Bel, [Army]),
  new MapEdge($.Ruh, $.Hol, [Army]),
  // Sil
  new MapEdge($.Sil, $.War, [Army]),
  // Apu
  new MapEdge($.Apu, $.Ven, [Army, Fleet]),
  new MapEdge($.Apu, $.Adr, [Fleet]),
  new MapEdge($.Apu, $.Ion, [Fleet]),
  new MapEdge($.Apu, $.Nap, [Army, Fleet]),
  new MapEdge($.Apu, $.Rom, [Army]),
  // Nap
  new MapEdge($.Nap, $.Rom, [Army, Fleet]),
  new MapEdge($.Nap, $.Ion, [Fleet]),
  new MapEdge($.Nap, $.Tyn, [Fleet]),
  // Pie
  new MapEdge($.Pie, $.Ven, [Army]),
  new MapEdge($.Pie, $.Tus, [Army, Fleet]),
  new MapEdge($.Pie, $.GoL, [Fleet]),
  // Rom
  new MapEdge($.Rom, $.Tus, [Army, Fleet]),
  new MapEdge($.Rom, $.Ven, [Army]),
  new MapEdge($.Rom, $.Tyn, [Fleet]),
  // Tus
  new MapEdge($.Tus, $.GoL, [Fleet]),
  new MapEdge($.Tus, $.Ven, [Army]),
  new MapEdge($.Tus, $.Tyn, [Fleet]),
  // Ven
  new MapEdge($.Ven, $.Adr, [Fleet]),
  // Fin
  new MapEdge($.Fin, $.Nwy, [Army]),
  new MapEdge($.Fin, $.Swe, [Army, Fleet]),
  new MapEdge($.Fin, $.Bot, [Fleet]),
  new MapEdge($.Fin, $.StP, [Army]),
  new MapEdge($.Fin, $.StP_SC, [Fleet]),
  // Lvn
  new MapEdge($.Lvn, $.Bot, [Fleet]),
  new MapEdge($.Lvn, $.StP, [Army]),
  new MapEdge($.Lvn, $.StP_SC, [Fleet]),
  new MapEdge($.Lvn, $.Mos, [Army]),
  new MapEdge($.Lvn, $.War, [Army]),
  new MapEdge($.Lvn, $.Bal, [Fleet]),
  // Mos
  new MapEdge($.Mos, $.StP, [Army]),
  new MapEdge($.Mos, $.Sev, [Army]),
  new MapEdge($.Mos, $.Ukr, [Army]),
  new MapEdge($.Mos, $.War, [Army]),
  // Sev
  new MapEdge($.Sev, $.Ukr, [Army]),
  new MapEdge($.Sev, $.Arm, [Army, Fleet]),
  new MapEdge($.Sev, $.Bla, [Fleet]),
  new MapEdge($.Sev, $.Rum, [Army, Fleet]),
  // StP
  new MapEdge($.StP, $.Nwy, [Army]),
  // StP/NC
  new MapEdge($.StP_NC, $.Nwy, [Fleet]),
  new MapEdge($.StP_NC, $.Bar, [Fleet]),
  // StP/SC
  new MapEdge($.StP_SC, $.Bot, [Fleet]),
  // Ukr
  new MapEdge($.Ukr, $.War, [Army]),
  new MapEdge($.Ukr, $.Rum, [Army]),
  // War
  // Ank
  new MapEdge($.Ank, $.Bla, [Fleet]),
  new MapEdge($.Ank, $.Arm, [Army, Fleet]),
  new MapEdge($.Ank, $.Smy, [Army]),
  new MapEdge($.Ank, $.Con, [Army, Fleet]),
  // Arm
  new MapEdge($.Arm, $.Bla, [Fleet]),
  new MapEdge($.Arm, $.Syr, [Army]),
  new MapEdge($.Arm, $.Smy, [Army]),
  // Con
  new MapEdge($.Con, $.Bul, [Army]),
  new MapEdge($.Con, $.Bul_EC, [Fleet]),
  new MapEdge($.Con, $.Bul_SC, [Fleet]),
  new MapEdge($.Con, $.Bla, [Fleet]),
  new MapEdge($.Con, $.Smy, [Army, Fleet]),
  new MapEdge($.Con, $.Aeg, [Fleet]),
  // Smy
  new MapEdge($.Smy, $.Syr, [Army, Fleet]),
  new MapEdge($.Smy, $.Eas, [Fleet]),
  new MapEdge($.Smy, $.Aeg, [Fleet]),
  // Syr
  new MapEdge($.Syr, $.Eas, [Fleet]),
  // Alb
  new MapEdge($.Alb, $.Ser, [Army]),
  new MapEdge($.Alb, $.Gre, [Army, Fleet]),
  new MapEdge($.Alb, $.Ion, [Fleet]),
  // Bel
  new MapEdge($.Bel, $.Eng, [Fleet]),
  new MapEdge($.Bel, $.Nth, [Fleet]),
  new MapEdge($.Bel, $.Hol, [Army, Fleet]),
  // Bul
  new MapEdge($.Bul, $.Ser, [Army]),
  new MapEdge($.Bul, $.Rum, [Army]),
  new MapEdge($.Bul, $.Gre, [Army]),
  // Bul/EC
  new MapEdge($.Bul_EC, $.Rum, [Fleet]),
  new MapEdge($.Bul_EC, $.Bla, [Fleet]),
  // Bul/SC
  new MapEdge($.Bul_SC, $.Gre, [Fleet]),
  new MapEdge($.Bul_SC, $.Aeg, [Fleet]),
  // Den
  new MapEdge($.Den, $.Nth, [Fleet]),
  new MapEdge($.Den, $.Ska, [Fleet]),
  new MapEdge($.Den, $.Bal, [Fleet]),
  new MapEdge($.Den, $.Hel, [Fleet]),
  // Gre
  new MapEdge($.Gre, $.Ser, [Army]),
  new MapEdge($.Gre, $.Aeg, [Fleet]),
  new MapEdge($.Gre, $.Ion, [Fleet]),
  // Hol
  new MapEdge($.Hol, $.Nth, [Fleet]),
  new MapEdge($.Hol, $.Hel, [Fleet]),
  // Nwy
  new MapEdge($.Nwy, $.Nrg, [Fleet]),
  new MapEdge($.Nwy, $.Bar, [Fleet]),
  new MapEdge($.Nwy, $.Swe, [Army, Fleet]),
  new MapEdge($.Nwy, $.Ska, [Fleet]),
  new MapEdge($.Nwy, $.Nth, [Fleet]),
  // Por
  new MapEdge($.Por, $.Mid, [Fleet]),
  new MapEdge($.Por, $.Spa, [Army]),
  new MapEdge($.Por, $.Spa_NC, [Fleet]),
  new MapEdge($.Por, $.Spa_SC, [Fleet]),
  // Rum
  new MapEdge($.Rum, $.Ser, [Army]),
  new MapEdge($.Rum, $.Bla, [Fleet]),
  // Ser
  // Spa
  // Spa/NC
  new MapEdge($.Spa_NC, $.Mid, [Fleet]),
  // Spa/SC
  new MapEdge($.Spa_SC, $.Mid, [Fleet]),
  new MapEdge($.Spa_SC, $.GoL, [Fleet]),
  new MapEdge($.Spa_SC, $.Wes, [Fleet]),
  // Swe
  new MapEdge($.Swe, $.Ska, [Fleet]),
  new MapEdge($.Swe, $.Bal, [Fleet]),
  new MapEdge($.Swe, $.Bot, [Fleet]),
  new MapEdge($.Swe, $.Den, [Army, Fleet]),
  // Tun
  new MapEdge($.Tun, $.Wes, [Fleet]),
  new MapEdge($.Tun, $.Tyn, [Fleet]),
  new MapEdge($.Tun, $.Ion, [Fleet]),
  new MapEdge($.Tun, $.NAf, [Army, Fleet]),
  // NAf
  new MapEdge($.NAf, $.Wes, [Fleet]),
  new MapEdge($.NAf, $.Mid, [Fleet]),
  // Adr
  new MapEdge($.Adr, $.Ion, [Fleet]),
  // Aeg
  new MapEdge($.Aeg, $.Eas, [Fleet]),
  new MapEdge($.Aeg, $.Ion, [Fleet]),
  // Bal
  new MapEdge($.Bal, $.Bot, [Fleet]),
  // Bar
  new MapEdge($.Bar, $.Nrg, [Fleet]),
  // Bla
  // Eas
  new MapEdge($.Eas, $.Ion, [Fleet]),
  // Eng
  new MapEdge($.Eng, $.Iri, [Fleet]),
  new MapEdge($.Eng, $.Nth, [Fleet]),
  new MapEdge($.Eng, $.Mid, [Fleet]),
  // Bot
  // GoL
  new MapEdge($.GoL, $.Tyn, [Fleet]),
  new MapEdge($.GoL, $.Wes, [Fleet]),
  // Hel
  new MapEdge($.Hel, $.Nth, [Fleet]),
  // Ion
  new MapEdge($.Ion, $.Tyn, [Fleet]),
  // Iri
  new MapEdge($.Iri, $.NAt, [Fleet]),
  new MapEdge($.Iri, $.Mid, [Fleet]),
  // Mid
  new MapEdge($.Mid, $.NAf, [Fleet]),
  new MapEdge($.Mid, $.Wes, [Fleet]),
  new MapEdge($.Mid, $.NAt, [Fleet]),
  // NAt
  new MapEdge($.NAt, $.Nrg, [Fleet]),
  // Nth
  new MapEdge($.Nth, $.Nrg, [Fleet]),
  // Nrg
  // Ska
  // Tyn
  new MapEdge($.Tyn, $.Wes, [Fleet])
  // Wes
])
