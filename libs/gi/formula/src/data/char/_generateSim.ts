import { type SimCharacterKey } from '@genshin-optimizer/gi/consts'
import { allStats } from '@genshin-optimizer/gi/stats'
import { cmpGE } from '@genshin-optimizer/pando/engine'
import {
  own,
  ownBuff,
  register,
} from '../util'
import { dataGenToCharInfo, dmg, entriesForChar } from './util'

export function generateSim(key: SimCharacterKey) {
  const data_gen = allStats.char.data[key]
  const skillParam_gen = allStats.char.skillParam[key]

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
  const {
    final: _final,
    char: { ascension: _ascension, constellation },
  } = own

  return register(
    info.key,
    entriesForChar(info, data_gen),
    // TODO: Double check these
    ownBuff.char.burst.add(cmpGE(constellation, 3, 3)),
    ownBuff.char.skill.add(cmpGE(constellation, 5, 3)),

    dmg('normal1', info, 'atk', _dm.normal.dmg1, 'normal')
  )
}
