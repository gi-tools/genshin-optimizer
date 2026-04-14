import { objKeyMap, range } from "@genshin-optimizer/common/util";
import { constant, equal, greaterEq, infoMut, input, lookup, LookupNode, none, NumNode, percent, prod, ReadNode, res, StrNode, subscript, sum, target, zero } from "@genshin-optimizer/gi/wr";
import { cond } from "./SheetUtil";
import { CharacterBaseStatKey, CharacterKey, CharacterSpecializedStatKey, characterSpecializedStatKeys, ElementWithPhyKey, WeaponKey } from "@genshin-optimizer/gi/consts";
import { DocumentConditionalBase } from "./sheet";
import { KeyMap } from "@genshin-optimizer/gi/keymap";
import { InputPremodKey } from "@genshin-optimizer/gi/wr-types";

export function generateRange(
  key: CharacterKey | WeaponKey,
  name: string,
  from: number,
  to: number,
  step: number,
  valueFormat: (v: number) => NumNode = (v) => constant(v),
): [arr: number[], condPath: string[], condNode: ReadNode<string>, valueNode: LookupNode<NumNode>] {
  const valueArr = range(from, to, step)
  const [condPath, condNode] = cond(key, name)
  const valueNode = lookup(
    condNode,
    objKeyMap(valueArr, valueFormat),
    zero
  )
  return [valueArr, condPath, condNode, valueNode]
}

export function generateBaseStatRangeShort(
  key: CharacterKey,
  stat: CharacterBaseStatKey,
): [
  valueNode: NumNode,
  x00_partialCond: DocumentConditionalBase,
  _xx_partialCond: DocumentConditionalBase,
] {
  let label = 'Base ATK'
  if (stat === 'def') {
    label = 'Base DEF'
  } else if (stat === 'hp') {
    label = 'Base HP'
  } else if (stat === 'atk') {
    label = 'Base ATK'
  }
  const [x00_array, x00_condPath, x00_condNode, x00_valueNode, x00_partialCond, _xx_array, _xx_condPath, _xx_condNode, _xx_valueNode, _xx_partialCond, valueNode] = generateBaseStatRange(key, stat, label)
  return [valueNode, x00_partialCond, _xx_partialCond]
}

export function generateBaseStatRange(
  key: CharacterKey,
  statName: CharacterBaseStatKey,
  label: string,
): [
  x00_array: number[],
  x00_condPath: string[],
  x00_condNode: ReadNode<string>,
  x00_valueNode: LookupNode<NumNode>,
  x00_partialCond: DocumentConditionalBase,
  _xx_array: number[],
  _xx_condPath: string[],
  _xx_condNode: ReadNode<string>,
  _xx_valueNode: LookupNode<NumNode>,
  _xx_partialCond: DocumentConditionalBase,
  valueNode: NumNode,
] {
  let x00_from = 100
  let x00_to = 1200
  let x00_step = 100
  let x00_label = `${label} [x00]`
  let _xx_from = 0
  let _xx_to = 99
  let _xx_step = 1
  let _xx_label = `${label} [_xx]`

  if (statName === 'hp') {
    x00_from = 8000
    x00_to = 16000
    x00_step = 100
  }

  const [x00_array, x00_condPath, x00_condNode, x00_valueNode] = generateRange(key, `${statName}_x00`, x00_from, x00_to, x00_step)
  const [_xx_array, _xx_condPath, _xx_condNode, _xx_valueNode] = generateRange(key, `${statName}_xx`, _xx_from, _xx_to, _xx_step)
  const valueNode = infoMut(
    sum(greaterEq(x00_valueNode, 0, x00_valueNode), greaterEq(_xx_valueNode, 0, _xx_valueNode)),
    {
      name: label
    }
  )
  const x00_partialCond: DocumentConditionalBase = {
    path: x00_condPath,
    value: x00_condNode,
    name: x00_label,
    states: objKeyMap(x00_array, (v) => ({
      name: `${v}`,
      fields: [],
    })),
  }
  const _xx_partialCond: DocumentConditionalBase = {
    path: _xx_condPath,
    value: _xx_condNode,
    name: _xx_label,
    states: objKeyMap(_xx_array, (v) => ({
      name: `${v}`,
      fields: [],
    })),
  }
  return [x00_array, x00_condPath, x00_condNode, x00_valueNode, x00_partialCond, _xx_array, _xx_condPath, _xx_condNode, _xx_valueNode, _xx_partialCond, valueNode];
}

export const ascensionStatValues: {
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

export function generateSscensionStat(
  key: CharacterKey,
): [ascensionStatValueNode: LookupNode<StrNode>, ascensionStat_partialCond: DocumentConditionalBase] {
  const ascensionStatArr = characterSpecializedStatKeys;
  const [condAscensionStatPath, condAscensionStat] = cond(key, `AscensionStat`)
  const ascensionStatValueNode = lookup(
    condAscensionStat,
    objKeyMap(ascensionStatArr, (v) => constant(v)),
    none
  )
  const ascensionStat_partialCond: DocumentConditionalBase = {
    path: condAscensionStatPath,
    value: condAscensionStat,
    name: 'Ascension Stat',
    states: objKeyMap(ascensionStatArr, (stat) => ({
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
  }
  return [ascensionStatValueNode, ascensionStat_partialCond]
}

export function generateDefuffRes(
  key: CharacterKey,
  elm: ElementWithPhyKey,
): [res_Value: NumNode, res_partialCond: DocumentConditionalBase] {
  const [res_array, res_condPath, res_condNode, res_valueNode] = generateRange(key, `target_debuff_${elm}_res`, 1, 50, 1, (v) => constant(-v / 100, { unit: '%', path: `${elm}_enemyRes_` }))
  const res_partialCond: DocumentConditionalBase = {
    path: res_condPath,
    value: res_condNode,
    name: KeyMap.getStr(`${elm}_enemyRes_`),
    states: objKeyMap(res_array, (v) => ({
      name: `${v}%`,
      fields: [],
    })),
  }
  return [res_valueNode, res_partialCond]
}

export function generateDebuffDef(
  key: CharacterKey,
  elm: 'enemyDefRed_' | 'enemyDefIgn_',
): [res_Value: NumNode, res_partialCond: DocumentConditionalBase] {
  const [res_array, res_condPath, res_condNode, res_valueNode] = generateRange(key, `target_debuff_${elm}`, 1, 50, 1, (v) => percent(v / 100, { path: `${elm}` }))
  const res_partialCond: DocumentConditionalBase = {
    path: res_condPath,
    value: res_condNode,
    name: KeyMap.getStr(`${elm}`),
    states: objKeyMap(res_array, (v) => ({
      name: `${v}%`,
      fields: [],
    })),
  }
  return [res_valueNode, res_partialCond]
}

export function getLabelStat(stat: InputPremodKey | 'lunar_base_dmg_'): string {
  if (stat === 'lunar_base_dmg_') {
    return 'Lunar Base DMG'
  }
  return KeyMap.getStr(stat) ?? 'Unknown Stat'
}

export function generateBuffStat(
  key: CharacterKey,
  stat: InputPremodKey | 'lunar_base_dmg_',
  prefix: 'team' | 'self' | 'single'
): [buffStat_Value: NumNode, buffStat_partialCond: DocumentConditionalBase, buffStat_valueRaw: NumNode] {
  const namePrefix = prefix == 'team' ? '❖' : (prefix == 'single' ? '♥' : '')
  let from = 1
  let to = 100
  let step = 1
  let fnCal = (v: number) => percent(v / 100)

  if (stat === 'eleMas') {
    to = 200
    fnCal = (v: number) => constant(v)
  } else if (stat === 'critRate_') {
    to = 50
  } else if (stat === 'lunar_base_dmg_') {
    to = 24
  } else if (stat === 'dmgMultiplier_') {
    from = 100
    to = 300
  } else if (stat === 'atk' || stat === 'def') {
    from = 100
    to = 1000
    step = 10
    fnCal = (v: number) => constant(v)
  } else if (stat === 'hp') {
    from = 2000
    to = 10000
    step = 100
    fnCal = (v: number) => constant(v)
  }

  const fnFormatValue = (v: number): string => {
    if (stat === 'eleMas' || stat === 'atk' || stat === 'def' || stat === 'hp') {
      return `${v}`
    } else {
      return `${v}%`
    }
  }

  const [buffStat_array, buffStat_condPath, buffStat_condNode, buffStat_valueNode] = generateRange(key, `${prefix}_buff_${stat}`, from, to, step, fnCal)

  const buffStat_valueRaw = infoMut(buffStat_valueNode, { path: stat, isTeamBuff: (prefix == 'team' || prefix == 'single') })
  const buffStat_Value = prefix == 'single' ?
    infoMut(equal(target.charKey, input.activeCharKey, buffStat_valueNode), { path: stat, isTeamBuff: true }) :
    infoMut(buffStat_valueNode, { path: stat, isTeamBuff: (prefix == 'team') })
  const buffStat_partialCond: DocumentConditionalBase = {
    path: buffStat_condPath,
    value: buffStat_condNode,
    name: `${namePrefix} ${getLabelStat(stat)}`,
    states: objKeyMap(buffStat_array, (v) => ({
      name: fnFormatValue(v),
      fields: [],
    })),
  }
  return [buffStat_Value, buffStat_partialCond, buffStat_valueRaw]
}
