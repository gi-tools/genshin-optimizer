import type { WeaponKey } from '@genshin-optimizer/gi/consts'
import {
  constant,
  percent,
} from '@genshin-optimizer/gi/wr'
import { IWeaponSheet } from '../IWeaponSheet'
import { WeaponSheet } from '../WeaponSheet'
import { dataObjForWeaponSheet } from '../util'
import { generateRange } from '../../GenerateSim'
import { objKeyMap } from '@genshin-optimizer/common/util'
import { KeyMap } from '@genshin-optimizer/gi/keymap'

export function generateSim(key: WeaponKey) {

  const [bAtk_array, bAtk_condPath, bAtk_condNode, bAtk_valueNode] = generateRange(key, `base_atk`, 100, 1200, 1)

  const [selfAtk_array, selfAtk_condPath, selfAtk_condNode, selfAtk_valueNode] = generateRange(key, `atk_`, 1, 100, 1, (v) => percent(v / 100))
  const [selfHp_array, selfHp_condPath, selfHp_condNode, selfHp_valueNode] = generateRange(key, `hp_`, 1, 100, 1, (v) => percent(v / 100))
  const [selfDef_array, selfDef_condPath, selfDef_condNode, selfDef_valueNode] = generateRange(key, `def_`, 1, 100, 1, (v) => percent(v / 100))
  const [selfEm_array, selfEm_condPath, selfEm_condNode, selfEm_valueNode] = generateRange(key, `em_`, 1, 500, 1, (v) => constant(v))
  const [selfEr_array, selfEr_condPath, selfEr_condNode, selfEr_valueNode] = generateRange(key, `er_`, 1, 100, 1, (v) => percent(v / 100))
  const [selfCr_array, selfCr_condPath, selfCr_condNode, selfCr_valueNode] = generateRange(key, `crit_rate_`, 1, 100, 1, (v) => percent(v / 100))
  const [selfCrd_array, selfCrd_condPath, selfCrd_condNode, selfCrd_valueNode] = generateRange(key, `crit_dmg_`, 1, 100, 1, (v) => percent(v / 100))

  const data = dataObjForWeaponSheet(
    key,
    {
      premod: {
        atk_: selfAtk_valueNode,
        hp_: selfHp_valueNode,
        def_: selfDef_valueNode,
        eleMas: selfEm_valueNode,
        enerRech_: selfEr_valueNode,
        critRate_: selfCr_valueNode,
        critDMG_: selfCrd_valueNode,
      },
      teamBuff: {
      },
      base: {
        atk: bAtk_valueNode,
      }
    },
  )

  const sheet: IWeaponSheet = {
    document: [
      {
        header: undefined,
        path: bAtk_condPath,
        value: bAtk_condNode,
        name: KeyMap.getStr('base_atk'),
        states: objKeyMap(bAtk_array, (v) => ({
          name: `${v}`,
          fields: [],
        })),
      },
      {
        header: undefined,
        path: selfAtk_condPath,
        value: selfAtk_condNode,
        name: KeyMap.getStr('atk_'),
        states: objKeyMap(selfAtk_array, (v) => ({
          name: `${v}%`,
          fields: [],
        })),
      },
      {
        header: undefined,
        path: selfHp_condPath,
        value: selfHp_condNode,
        name: KeyMap.getStr('hp_'),
        states: objKeyMap(selfHp_array, (v) => ({
          name: `${v}%`,
          fields: [],
        })),
      },
      {
        header: undefined,
        path: selfDef_condPath,
        value: selfDef_condNode,
        name: KeyMap.getStr('def_'),
        states: objKeyMap(selfDef_array, (v) => ({
          name: `${v}%`,
          fields: [],
        })),
      },
      {
        header: undefined,
        path: selfEm_condPath,
        value: selfEm_condNode,
        name: KeyMap.getStr('eleMas'),
        states: objKeyMap(selfEm_array, (v) => ({
          name: `${v}`,
          fields: [],
        })),
      },
      {
        header: undefined,
        path: selfEr_condPath,
        value: selfEr_condNode,
        name: KeyMap.getStr('enerRech_'),
        states: objKeyMap(selfEr_array, (v) => ({
          name: `${v}%`,
          fields: [],
        })),
      },
      {
        header: undefined,
        path: selfCr_condPath,
        value: selfCr_condNode,
        name: KeyMap.getStr('critRate_'),
        states: objKeyMap(selfCr_array, (v) => ({
          name: `${v}%`,
          fields: [],
        })),
      },
      {
        header: undefined,
        path: selfCrd_condPath,
        value: selfCrd_condNode,
        name: KeyMap.getStr('critDMG_'),
        states: objKeyMap(selfCrd_array, (v) => ({
          name: `${v}%`,
          fields: [],
        })),
      },
    ],
  }

  return new WeaponSheet(sheet, data)
}
