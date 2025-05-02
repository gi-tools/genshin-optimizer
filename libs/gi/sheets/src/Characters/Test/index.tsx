import type { CharacterKey, ElementKey } from '@genshin-optimizer/gi/consts'
import { allStats } from '@genshin-optimizer/gi/stats'
import {
  equalStr,
  infoMut,
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

const fn_GetTest = (key: CharacterKey, elementKey: ElementKey): CharacterSheet => {
  //const key: CharacterKey = '_Test_P_Bow'
  //const elementKey: ElementKey = 'pyro'
  const skillParam_gen = (allStats.char.skillParam as any)[key]
  const ct = charTemplates(key as any)

  let a = 0,
    s = 0,
    b = 0
  const dm = {
    normal: {
      hitArr: [
        skillParam_gen.auto[a++], // 1
      ],
    },
    charged: {
      dmg: skillParam_gen.auto[a++],
      stamina: skillParam_gen.auto[a++][0],
    },
    plunging: {
      dmg: skillParam_gen.auto[a++],
      low: skillParam_gen.auto[a++],
      high: skillParam_gen.auto[a++],
    },
    skill: {
      dmg: skillParam_gen.skill[s++],
      duration: skillParam_gen.skill[s++][0],
      cd: skillParam_gen.skill[s++][0],
    },
    burst: {
      dmg: skillParam_gen.burst[b++],
      duration: skillParam_gen.burst[b++][0],
      cd: skillParam_gen.burst[b++][0],
      energyCost: skillParam_gen.burst[b++][0],
    },
    passive1: {
    },
    passive2: {
    },
    constellation1: {
    },
    constellation2: {
    },
    constellation4: {
    },
    constellation6: {
    },
  } as const

  const [condInfusionPath, condInfusion] = cond(key, 'TestOnInfusion')
  const infusion = equalStr('on', condInfusion, elementKey)

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

  const data = dataObjForCharacterSheet(key, dmgFormulas, {
    infusion: {
      overridableSelf: infusion,
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
            unit: '/s',
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

    passive1: ct.talentTem('passive1'),
    passive2: ct.talentTem('passive2'),
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
      })
    ]),
    constellation1: ct.talentTem('constellation1'),
    constellation2: ct.talentTem('constellation2'),
    constellation3: ct.talentTem('constellation3'),
    constellation4: ct.talentTem('constellation4'),
    constellation5: ct.talentTem('constellation5'),
    constellation6: ct.talentTem('constellation6'),
  }

  return new CharacterSheet(sheet, data)
};

export default fn_GetTest
