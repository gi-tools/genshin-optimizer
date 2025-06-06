import { subscript } from '@genshin-optimizer/pando/engine'
import type { WengineKey } from '@genshin-optimizer/zzz/consts'
import { mappedStats } from '@genshin-optimizer/zzz/stats'
import { allBoolConditionals, own, ownBuff, registerBuff } from '../../util'
import {
  cmpSpecialtyAndEquipped,
  entriesForWengine,
  registerWengine,
  showSpecialtyAndEquipped,
} from '../util'

const key: WengineKey = 'StarlightEngineReplica'
const dm = mappedStats.wengine[key]
const { phase } = own.wengine

const { hit_away } = allBoolConditionals(key)

const sheet = registerWengine(
  key,
  // Handles base stats and passive buffs
  entriesForWengine(key),

  // Conditional buffs
  registerBuff(
    'cond_dmg_',
    ownBuff.combat.dmg_.physical.add(
      cmpSpecialtyAndEquipped(
        key,
        hit_away.ifOn(subscript(phase, dm.physical_dmg_))
      )
    ),
    showSpecialtyAndEquipped(key)
  )
)
export default sheet
