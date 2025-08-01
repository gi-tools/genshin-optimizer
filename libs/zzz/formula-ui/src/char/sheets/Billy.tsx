import type { CharacterKey } from '@genshin-optimizer/zzz/consts'
import { buffs, conditionals } from '@genshin-optimizer/zzz/formula'
import { trans } from '../../util'
import { createBaseSheet, fieldForBuff } from '../sheetUtil'

const key: CharacterKey = 'Billy'
const [, ch] = trans('char', key)
const cond = conditionals[key]
const buff = buffs[key]

const sheet = createBaseSheet(key, {
  core: [
    {
      type: 'fields',
      fields: [
        {
          title: ch('core_common_dmg_'),
          fieldRef: buff.core_common_dmg_.tag,
        },
      ],
    },
  ],
  ability: [
    {
      type: 'conditional',
      conditional: {
        label: ch('abilityCond'),
        metadata: cond.ult_dmg_stacks,
        fields: [fieldForBuff(buff.ability_ult_dmg_)],
      },
    },
  ],
  m2: [
    {
      type: 'fields',
      fields: [fieldForBuff(buff.m2_dodgeCounter_dmg_)],
    },
  ],
  m4: [
    {
      type: 'conditional',
      conditional: {
        label: ch('m4Cond'),
        metadata: cond.distance,
        fields: [fieldForBuff(buff.m4_exSpecial_crit_)],
      },
    },
  ],
  m6: [
    {
      type: 'conditional',
      conditional: {
        label: ch('m6Cond'),
        metadata: cond.m6_stacks,
        fields: [fieldForBuff(buff.m6_common_dmg_)],
      },
    },
  ],
})

export default sheet
