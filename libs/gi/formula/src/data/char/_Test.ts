import type { CharacterKey } from '@genshin-optimizer/gi/consts'
import { allStats } from '@genshin-optimizer/gi/stats'
import {
  register,
} from '../util'
import { dataGenToCharInfo, dmg, entriesForChar } from './util'

export default function fn_TestRegister(key: CharacterKey) {
  //const key: CharacterKey = '_Test_A_Swo'
  const data_gen = (allStats.char.data as any)[key]
  const skillParam_gen = (allStats.char.skillParam as any)[key]

  // TODO: Fill data-mine values here
  const _dm = {
    normal: {
      dmg1: skillParam_gen.auto[0],
    },
    charged: {},
    plunging: {},
    skill: {},
    burst: {},
  } as const

  const info = dataGenToCharInfo(data_gen)

  return register(
    info.key,
    entriesForChar(info, data_gen),
    // Formulas
    // TODO: Add dmg/heal/shield formulas using `dmg`, `customDmg`, `shield`, `customShield`, `fixedShield`, or `customHeal`
    dmg('normal1', info, 'atk', _dm.normal.dmg1, 'normal')
  )
}
