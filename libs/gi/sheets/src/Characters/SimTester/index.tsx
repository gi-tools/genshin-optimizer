import { characterSpecializedStatKeys, type CharacterSpecializedStatKey, type CharacterKey, type ElementKey } from '@genshin-optimizer/gi/consts'
import { allStats } from '@genshin-optimizer/gi/stats'
import { objKeyMap, range } from '@genshin-optimizer/common/util'
import {
  constant,
  equal,
  equalStr,
  greaterEq,
  infoMut,
  input,
  lookup,
  none,
  percent,
  sum,
  zero,
} from '@genshin-optimizer/gi/wr'
import { cond, st, stg } from '../../SheetUtil'
import { CharacterSheet } from '../CharacterSheet'
import type { TalentSheet } from '../ICharacterSheet'
import { charTemplates } from '../charTemplates'
import {
  dataObjForCharacterSheet,
  dmgNode,
  plungingDmgNodes,
} from '../dataUtil'
import { KeyMap } from '@genshin-optimizer/gi/keymap'

const key: CharacterKey = 'SimTester'
const elementKey: ElementKey = 'cryo'
const skillParam_gen = allStats.char.skillParam[key]
const ct = charTemplates(key)

const dm = {
  normal: {
    hitArr: [
      skillParam_gen.auto[0], // 1
    ],
  },
  charged: {
    dmg: skillParam_gen.auto[1],
    stamina: skillParam_gen.auto[2][0],
  },
  plunging: {
    dmg: skillParam_gen.auto[3],
    low: skillParam_gen.auto[4],
    high: skillParam_gen.auto[5],
  },
  skill: {
    dmg: skillParam_gen.skill[0],
    duration: skillParam_gen.skill[1][0],
    cd: skillParam_gen.skill[2][0],
  },
  burst: {
    dmg: skillParam_gen.burst[0],
    duration: skillParam_gen.burst[1][0],
    cd: skillParam_gen.burst[2][0],
    energyCost: skillParam_gen.burst[3][0],
  },
} as const

const [condInfusionPath, condInfusion] = cond(key, 'SimTester_Infusion')
const infusion = equalStr('on', condInfusion, elementKey)

const fix_BaseAtk_x00_Arr = range(100, 1200, 100)
const [condFix_BaseAtk_x00_Path, condFix_BaseAtk_x00] = cond(key, 'SimTester_BaseAtk_x00')
const fix_BaseAtk_x00 = lookup(
  condFix_BaseAtk_x00,
  objKeyMap(fix_BaseAtk_x00_Arr, (bAtk) => constant(bAtk)),
  zero
)
const fix_BaseAtk_xx_Arr = range(0, 99, 1)
const [condFix_BaseAtk_xx_Path, condFix_BaseAtk_xx] = cond(key, 'SimTester_BaseAtk_xx')
const fix_BaseAtk_xx = lookup(
  condFix_BaseAtk_xx,
  objKeyMap(fix_BaseAtk_xx_Arr, (bAtk) => constant(bAtk)),
  zero
)
const fix_BaseAtk_Total = infoMut(
  sum(greaterEq(fix_BaseAtk_x00, 0, fix_BaseAtk_x00), greaterEq(fix_BaseAtk_xx, 0, fix_BaseAtk_xx)),
  {
    name: 'Base Atk'
  }
)

const fix_BaseDef_x00_Arr = range(100, 1200, 100)
const [condFix_BaseDef_x00_Path, condFix_BaseDef_x00] = cond(key, 'SimTester_BaseDef_x00')
const fix_BaseDef_x00 = lookup(
  condFix_BaseDef_x00,
  objKeyMap(fix_BaseDef_x00_Arr, (bDef) => constant(bDef)),
  zero
)
const fix_BaseDef_xx_Arr = range(0, 99, 1)
const [condFix_BaseDef_xx_Path, condFix_BaseDef_xx] = cond(key, 'SimTester_BaseDef_xx')
const fix_BaseDef_xx = lookup(
  condFix_BaseDef_xx,
  objKeyMap(fix_BaseDef_xx_Arr, (bDef) => constant(bDef)),
  zero
)
const fix_BaseDef_Total = infoMut(
  sum(greaterEq(fix_BaseDef_x00, 0, fix_BaseDef_x00), greaterEq(fix_BaseDef_xx, 0, fix_BaseDef_xx)),
  {
    name: 'Base Def',
  }
)

const fix_BaseHp_xxx00_Arr = range(8000, 16000, 100)
const [condFix_BaseHp_xxx00_Path, condFix_BaseHp_xxx00] = cond(key, 'SimTester_BaseHp_xxx00')
const fix_BaseHp_xxx00 = lookup(
  condFix_BaseHp_xxx00,
  objKeyMap(fix_BaseHp_xxx00_Arr, (bHp) => constant(bHp)),
  zero
)
const fix_BaseHp_xx_Arr = range(0, 99, 1)
const [condFix_BaseHp_xx_Path, condFix_BaseHp_xx] = cond(key, 'SimTester_BaseHp_xx')
const fix_BaseHp_xx = lookup(
  condFix_BaseHp_xx,
  objKeyMap(fix_BaseHp_xx_Arr, (bHp) => constant(bHp)),
  zero
)
const fix_BaseHp_Total = infoMut(
  sum(greaterEq(fix_BaseHp_xxx00, 0, fix_BaseHp_xxx00), greaterEq(fix_BaseHp_xx, 0, fix_BaseHp_xx)),
  {
    name: 'Base Hp',
  }
)

const fixAscensionStatArr = characterSpecializedStatKeys;
const [condFixAscensionStatPath, condFixAscensionStat] = cond(key, 'SimTester_AscensionStat')
const fixAscensionStat = lookup(
  condFixAscensionStat,
  objKeyMap(fixAscensionStatArr, (ascensionStat) => constant(ascensionStat)),
  none
)
const ascensionStatValues: {
  [key in CharacterSpecializedStatKey]: number
} = {
  hp_: (0.288),
  atk_: (0.288),
  def_: (0.36),
  eleMas: (115.2),
  enerRech_: (0.32),
  heal_: (0.22),
  critRate_: (0.192),
  critDMG_: (0.384),
  physical_dmg_: (0.3),
  anemo_dmg_: (0.288),
  geo_dmg_: (0.288),
  electro_dmg_: (0.288),
  hydro_dmg_: (0.288),
  pyro_dmg_: (0.288),
  cryo_dmg_: (0.288),
  dendro_dmg_: (0.288),
}

const dmgFormulas = {
  normal: Object.fromEntries(
    dm.normal.hitArr.map((arr, i) => [
      i,
      dmgNode('atk', arr, 'normal'),
    ])
  ),
  charged: {
    dmg: dmgNode('atk', dm.charged.dmg, 'charged'),
  },
  plunging: plungingDmgNodes('atk', dm.plunging),
  skill: {
    pressDmg: dmgNode('atk', dm.skill.dmg, 'skill'),
  },
  burst: {
    pressDmg: dmgNode('atk', dm.burst.dmg, 'burst'),
  },
}

const burstC3 = greaterEq(input.constellation, 3, 3)
const skillC5 = greaterEq(input.constellation, 5, 3)

const data = dataObjForCharacterSheet(key, dmgFormulas, {
  premod: {
    burstBoost: burstC3,
    skillBoost: skillC5,
    hp_: equal(fixAscensionStat, 'hp_', percent(ascensionStatValues['hp_'])),
    atk_: equal(fixAscensionStat, 'atk_', percent(ascensionStatValues['atk_'])),
    def_: equal(fixAscensionStat, 'def_', percent(ascensionStatValues['def_'])),
    eleMas: equal(fixAscensionStat, 'eleMas', constant(ascensionStatValues['eleMas'])),
    enerRech_: equal(fixAscensionStat, 'enerRech_', percent(ascensionStatValues['enerRech_'])),
    heal_: equal(fixAscensionStat, 'heal_', percent(ascensionStatValues['heal_'])),
    critRate_: equal(fixAscensionStat, 'critRate_', percent(ascensionStatValues['critRate_'])),
    critDMG_: equal(fixAscensionStat, 'critDMG_', percent(ascensionStatValues['critDMG_'])),
    physical_dmg_: equal(fixAscensionStat, 'physical_dmg_', percent(ascensionStatValues['physical_dmg_'])),
    anemo_dmg_: equal(fixAscensionStat, 'anemo_dmg_', percent(ascensionStatValues['anemo_dmg_'])),
    geo_dmg_: equal(fixAscensionStat, 'geo_dmg_', percent(ascensionStatValues['geo_dmg_'])),
    electro_dmg_: equal(fixAscensionStat, 'electro_dmg_', percent(ascensionStatValues['electro_dmg_'])),
    hydro_dmg_: equal(fixAscensionStat, 'hydro_dmg_', percent(ascensionStatValues['hydro_dmg_'])),
    pyro_dmg_: equal(fixAscensionStat, 'pyro_dmg_', percent(ascensionStatValues['pyro_dmg_'])),
    cryo_dmg_: equal(fixAscensionStat, 'cryo_dmg_', percent(ascensionStatValues['cryo_dmg_'])),
    dendro_dmg_: equal(fixAscensionStat, 'dendro_dmg_', percent(ascensionStatValues['dendro_dmg_'])),
  },
  base: {
    atk: greaterEq(fix_BaseAtk_Total, 0, fix_BaseAtk_Total),
    def: greaterEq(fix_BaseDef_Total, 0, fix_BaseDef_Total),
    hp: greaterEq(fix_BaseHp_Total, 0, fix_BaseHp_Total),
  },
  infusion: {
    nonOverridableSelf: infusion,
  },
})

const sheet: TalentSheet = {
  auto: ct.talentTem('auto', [
    {
      text: ct.chg('auto.fields.normal'),
    },
    {
      fields: dm.normal.hitArr.map((_, i) => ({
        node: infoMut(dmgFormulas.normal[i], {
          name: ct.chg(`auto.skillParams.${i}`),
        }),
      })),
    },
    {
      text: ct.chg('auto.fields.charged'),
    },
    {
      fields: [
        {
          node: infoMut(dmgFormulas.charged.dmg, {
            name: ct.chg(`auto.skillParams.1`),
          }),
        },
        {
          text: ct.chg('auto.skillParams.2'),
          value: dm.charged.stamina,
        },
      ],
    },
    {
      text: ct.chg(`auto.fields.plunging`),
    },
    {
      fields: [
        {
          node: infoMut(dmgFormulas.plunging.dmg, {
            name: stg('plunging.dmg'),
          }),
        },
        {
          node: infoMut(dmgFormulas.plunging.low, {
            name: stg('plunging.low'),
          }),
        },
        {
          node: infoMut(dmgFormulas.plunging.high, {
            name: stg('plunging.high'),
          }),
        },
      ],
    },
  ]),

  skill: ct.talentTem('skill', [
    ct.fieldsTem('skill', {
      fields: [
        {
          node: infoMut(dmgFormulas.skill.pressDmg, {
            name: ct.chg('skill.skillParams.0'),
          }),
        },
        {
          text: stg('duration'),
          value: dm.skill.duration,
          unit: 's',
        },
        {
          text: stg('cd'),
          value: dm.skill.cd,
          unit: 's',
        },
      ],
    }),
  ]),

  burst: ct.talentTem('burst', [
    ct.fieldsTem('burst', {
      fields: [
        {
          node: infoMut(dmgFormulas.burst.pressDmg, {
            name: ct.chg('burst.skillParams.0'),
          }),
        },
        {
          text: stg('duration'),
          value: dm.burst.duration,
          unit: 's',
        },
        {
          text: stg('energyCost'),
          value: dm.burst.energyCost,
        },
        {
          text: stg('cd'),
          value: dm.burst.cd,
          unit: 's',
        },
      ],
    }),
  ]),

  passive1: ct.talentTem('passive1', [
    ct.condTem('passive1', {
      path: condFix_BaseAtk_x00_Path,
      value: condFix_BaseAtk_x00,
      name: 'BaseATK [x00]',
      states: objKeyMap(fix_BaseAtk_x00_Arr, (batk) => ({
        name: `${batk}`,
        fields: [],
      })),
    }),
    ct.condTem('passive1', {
      path: condFix_BaseAtk_xx_Path,
      value: condFix_BaseAtk_xx,
      name: 'BaseATK [_xx]',
      states: objKeyMap(fix_BaseAtk_xx_Arr, (batk) => ({
        name: `${batk}`,
        fields: [],
      })),
    }),
    ct.condTem('passive1', {
      path: condFix_BaseDef_x00_Path,
      value: condFix_BaseDef_x00,
      name: 'BaseDEF [x00]',
      states: objKeyMap(fix_BaseDef_x00_Arr, (bdef) => ({
        name: `${bdef}`,
        fields: [],
      })),
    }),
    ct.condTem('passive1', {
      path: condFix_BaseDef_xx_Path,
      value: condFix_BaseDef_xx,
      name: 'BaseDEF [_xx]',
      states: objKeyMap(fix_BaseDef_xx_Arr, (bdef) => ({
        name: `${bdef}`,
        fields: [],
      })),
    }),
    ct.condTem('passive1', {
      path: condFix_BaseHp_xxx00_Path,
      value: condFix_BaseHp_xxx00,
      name: 'BaseHP [xxx00]',
      states: objKeyMap(fix_BaseHp_xxx00_Arr, (bhp) => ({
        name: `${bhp}`,
        fields: [],
      })),
    }),
    ct.condTem('passive1', {
      path: condFix_BaseHp_xx_Path,
      value: condFix_BaseHp_xx,
      name: 'BaseHP [___xx]',
      states: objKeyMap(fix_BaseHp_xx_Arr, (bhp) => ({
        name: `${bhp}`,
        fields: [],
      })),
    }),
    ct.condTem('passive1', {
      path: condFixAscensionStatPath,
      value: condFixAscensionStat,
      name: 'Ascension Stat',
      states: objKeyMap(fixAscensionStatArr, (stat) => ({
        name: KeyMap.getStr(stat),
        fields: [
          {
            text: KeyMap.getStr(stat),
            value: stat == 'eleMas' ? ascensionStatValues[stat] : ascensionStatValues[stat] * 100,
            unit: stat == 'eleMas' ? '' : '%',
            fixed: 1,
          }
        ],
      })),
    }),
    ct.fieldsTem('passive1', {
      fields: [
        {
          node: fix_BaseAtk_Total,
        },
        {
          node: fix_BaseDef_Total,
        },
        {
          node: fix_BaseHp_Total,
        },
      ]
    })
  ]),
  passive2: ct.talentTem('passive2', [
  ]),
  passive3: ct.talentTem('passive3', [
    ct.condTem('passive3', {
      value: condInfusion,
      path: condInfusionPath,
      name: ct.ch('infusion.enter'),
      states: {
        on: {
          fields: [
            {
              text: st('infusion.' + elementKey),
              variant: elementKey,
            },
          ],
        },
      },
    }),
  ]),
  constellation1: ct.talentTem('constellation1'),
  constellation2: ct.talentTem('constellation2'),
  constellation3: ct.talentTem('constellation3', [
    { fields: [{ node: burstC3 }] },
  ]),
  constellation4: ct.talentTem('constellation4'),
  constellation5: ct.talentTem('constellation5', [
    { fields: [{ node: skillC5 }] },
  ]),
  constellation6: ct.talentTem('constellation6'),
}
export default new CharacterSheet(sheet, data)
