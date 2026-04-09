import { type ElementKey, SimCharacterKey, allElementKeys, allLunarReactionKeys } from '@genshin-optimizer/gi/consts'
import { allStats } from '@genshin-optimizer/gi/stats'
import { objKeyValMap } from '@genshin-optimizer/common/util'
import {
  constant,
  equal,
  equalStr,
  greaterEq,
  infoMut,
  input,
  lunarDmg,
  percent,
  subscript,
  sum,
} from '@genshin-optimizer/gi/wr'
import { cond, stg } from '../../SheetUtil'
import { CharacterSheet } from '../CharacterSheet'
import type { TalentSheet } from '../ICharacterSheet'
import { charTemplates } from '../charTemplates'
import {
  dataObjForCharacterSheet,
  dmgNode,
  plungingDmgNodes,
} from '../dataUtil'
import { ascensionStatValues, generateBaseStatRangeShort, generateBuffStat, generateDebuffDef, generateDefuffRes, generateSscensionStat } from '../../GenerateSim'

function getElementKey(key: SimCharacterKey): ElementKey {
  const elementKey = allElementKeys.find(e => key.toLowerCase().includes(e));
  if (elementKey)
    return elementKey.toLowerCase() as ElementKey;
  throw new Error(`Unknown element key: ${key}`)
}

export function generateSim(key: SimCharacterKey) {
  const elementKey = getElementKey(key)
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
      dmgScale: skillParam_gen.skill[0],
      dmgReactionScale: skillParam_gen.skill[3],
      duration: skillParam_gen.skill[1][0],
      cd: skillParam_gen.skill[2][0],
    },
    burst: {
      dmgScale: skillParam_gen.burst[0],
      dmgReactionScale: skillParam_gen.burst[4],
      duration: skillParam_gen.burst[1][0],
      cd: skillParam_gen.burst[2][0],
      energyCost: skillParam_gen.burst[3][0],
    },
  } as const

  const [condInfusionPath, condInfusion] = cond(key, `Infusion`)
  const infusion = equalStr('on', condInfusion, elementKey)

  const [bAtk_Value, bAtk_x00_partialCond, bAtk_xx_partialCond] = generateBaseStatRangeShort(key, 'atk')
  const [bDef_Value, bDef_x00_partialCond, bDef_xx_partialCond] = generateBaseStatRangeShort(key, 'def')
  const [bHp_Value, bHp_x00_partialCond, bHp_xx_partialCond] = generateBaseStatRangeShort(key, 'hp')
  const [ascensionStatValueNode, ascensionStat_partialCond] = generateSscensionStat(key)

  const [selfAtk_Value, selfAtk_partialCond] = generateBuffStat(key, 'atk_', 'self')
  const [selfDef_Value, selfDef_partialCond] = generateBuffStat(key, 'def_', 'self')
  const [selfHp_Value, selfHp_partialCond] = generateBuffStat(key, 'hp_', 'self')
  const [selfEm_Value, selfEm_partialCond] = generateBuffStat(key, 'eleMas', 'self')
  const [selfEnerRech_Value, selfEnerRech_partialCond] = generateBuffStat(key, 'enerRech_', 'self')
  const [selfHeal_Value, selfHeal_partialCond] = generateBuffStat(key, 'heal_', 'self')
  const [selfCritRate_Value, selfCritRate_partialCond] = generateBuffStat(key, 'critRate_', 'self')
  const [selfCritDMG_Value, selfCritDMG_partialCond] = generateBuffStat(key, 'critDMG_', 'self')
  const [selfDmgMulti_Value, selfDmgMulti_partialCond] = generateBuffStat(key, 'dmgMultiplier_', 'self')
  const [selfPhysical_dmg_Value, selfPhysical_dmg_partialCond] = generateBuffStat(key, 'physical_dmg_', 'self')
  const [selfAnemo_dmg_Value, selfAnemo_dmg_partialCond] = generateBuffStat(key, 'anemo_dmg_', 'self')
  const [selfGeo_dmg_Value, selfGeo_dmg_partialCond] = generateBuffStat(key, 'geo_dmg_', 'self')
  const [selfElectro_dmg_Value, selfElectro_dmg_partialCond] = generateBuffStat(key, 'electro_dmg_', 'self')
  const [selfDendro_dmg_Value, selfDendro_dmg_partialCond] = generateBuffStat(key, 'dendro_dmg_', 'self')
  const [selfHydro_dmg_Value, selfHydro_dmg_partialCond] = generateBuffStat(key, 'hydro_dmg_', 'self')
  const [selfPyro_dmg_Value, selfPyro_dmg_partialCond] = generateBuffStat(key, 'pyro_dmg_', 'self')
  const [selfCryo_dmg_Value, selfCryo_dmg_partialCond] = generateBuffStat(key, 'cryo_dmg_', 'self')
  const [selfCommon_dmg_Value, selfCommon_dmg_partialCond] = generateBuffStat(key, 'all_dmg_', 'self')
  const [selfNormal_dmg_Value, selfNormal_dmg_partialCond] = generateBuffStat(key, 'normal_dmg_', 'self')
  const [selfNormal_critRate_Value, selfNormal_critRate_partialCond] = generateBuffStat(key, 'normal_critRate_', 'self')
  const [selfNormal_critDMG_Value, selfNormal_critDMG_partialCond] = generateBuffStat(key, 'normal_critDMG_', 'self')
  const [selfCharged_dmg_Value, selfCharged_dmg_partialCond] = generateBuffStat(key, 'charged_dmg_', 'self')
  const [selfCharged_critRate_Value, selfCharged_critRate_partialCond] = generateBuffStat(key, 'charged_critRate_', 'self')
  const [selfCharged_critDMG_Value, selfCharged_critDMG_partialCond] = generateBuffStat(key, 'charged_critDMG_', 'self')
  const [selfPlunging_dmg_Value, selfPlunging_dmg_partialCond] = generateBuffStat(key, 'plunging_dmg_', 'self')
  const [selfPlunging_critRate_Value, selfPlunging_critRate_partialCond] = generateBuffStat(key, 'plunging_critRate_', 'self')
  const [selfPlunging_critDMG_Value, selfPlunging_critDMG_partialCond] = generateBuffStat(key, 'plunging_critDMG_', 'self')
  const [selfSkill_dmg_Value, selfSkill_dmg_partialCond] = generateBuffStat(key, 'skill_dmg_', 'self')
  const [selfSkill_critRate_Value, selfSkill_critRate_partialCond] = generateBuffStat(key, 'skill_critRate_', 'self')
  const [selfSkill_critDMG_Value, selfSkill_critDMG_partialCond] = generateBuffStat(key, 'skill_critDMG_', 'self')
  const [selfBurst_dmg_Value, selfBurst_dmg_partialCond] = generateBuffStat(key, 'burst_dmg_', 'self')
  const [selfBurst_critRate_Value, selfBurst_critRate_partialCond] = generateBuffStat(key, 'burst_critRate_', 'self')
  const [selfBurst_critDMG_Value, selfBurst_critDMG_partialCond] = generateBuffStat(key, 'burst_critDMG_', 'self')
  const [selfLunarbloomBonus_Value, selfLunarbloomBonus_partialCond] = generateBuffStat(key, 'lunarbloom_dmg_', 'self')
  const [selfLunarbloom_critRate_Value, selfLunarbloom_critRate_partialCond] = generateBuffStat(key, 'lunarbloom_critRate_', 'self')
  const [selfLunarbloom_critDMG_Value, selfLunarbloom_critDMG_partialCond] = generateBuffStat(key, 'lunarbloom_critDMG_', 'self')
  const [selfLunarchargedBonus_Value, selfLunarchargedBonus_partialCond] = generateBuffStat(key, 'lunarcharged_dmg_', 'self')
  const [selfLunarcharged_critRate_Value, selfLunarcharged_critRate_partialCond] = generateBuffStat(key, 'lunarcharged_critRate_', 'self')
  const [selfLunarcharged_critDMG_Value, selfLunarcharged_critDMG_partialCond] = generateBuffStat(key, 'lunarcharged_critDMG_', 'self')
  const [selfLunarcrystallizeBonus_Value, selfLunarcrystallizeBonus_partialCond] = generateBuffStat(key, 'lunarcrystallize_dmg_', 'self')
  const [selfLunarcrystallize_critRate_Value, selfLunarcrystallize_critRate_partialCond] = generateBuffStat(key, 'lunarcrystallize_critRate_', 'self')
  const [selfLunarcrystallize_critDMG_Value, selfLunarcrystallize_critDMG_partialCond] = generateBuffStat(key, 'lunarcrystallize_critDMG_', 'self')

  const [singleAtk_Value, singleAtk_partialCond, singleAtk_valueRaw] = generateBuffStat(key, 'atk_', 'single')
  const [singleDef_Value, singleDef_partialCond, singleDef_valueRaw] = generateBuffStat(key, 'def_', 'single')
  const [singleHp_Value, singleHp_partialCond, singleHp_valueRaw] = generateBuffStat(key, 'hp_', 'single')
  const [singleEm_Value, singleEm_partialCond, singleEm_valueRaw] = generateBuffStat(key, 'eleMas', 'single')
  const [singleEnerRech_Value, singleEnerRech_partialCond, singleEnerRech_valueRaw] = generateBuffStat(key, 'enerRech_', 'single')
  const [singleHeal_Value, singleHeal_partialCond, singleHeal_valueRaw] = generateBuffStat(key, 'heal_', 'single')
  const [singleCritRate_Value, singleCritRate_partialCond, singleCritRate_valueRaw] = generateBuffStat(key, 'critRate_', 'single')
  const [singleCritDMG_Value, singleCritDMG_partialCond, singleCritDMG_valueRaw] = generateBuffStat(key, 'critDMG_', 'single')
  const [singleDmgMulti_Value, singleDmgMulti_partialCond, singleDmgMulti_valueRaw] = generateBuffStat(key, 'dmgMultiplier_', 'single')
  const [singlePhysical_dmg_Value, singlePhysical_dmg_partialCond, singlePhysical_dmg_valueRaw] = generateBuffStat(key, 'physical_dmg_', 'single')
  const [singleAnemo_dmg_Value, singleAnemo_dmg_partialCond, singleAnemo_dmg_valueRaw] = generateBuffStat(key, 'anemo_dmg_', 'single')
  const [singleGeo_dmg_Value, singleGeo_dmg_partialCond, singleGeo_dmg_valueRaw] = generateBuffStat(key, 'geo_dmg_', 'single')
  const [singleElectro_dmg_Value, singleElectro_dmg_partialCond, singleElectro_dmg_valueRaw] = generateBuffStat(key, 'electro_dmg_', 'single')
  const [singleDendro_dmg_Value, singleDendro_dmg_partialCond, singleDendro_dmg_valueRaw] = generateBuffStat(key, 'dendro_dmg_', 'single')
  const [singleHydro_dmg_Value, singleHydro_dmg_partialCond, singleHydro_dmg_valueRaw] = generateBuffStat(key, 'hydro_dmg_', 'single')
  const [singlePyro_dmg_Value, singlePyro_dmg_partialCond, singlePyro_dmg_valueRaw] = generateBuffStat(key, 'pyro_dmg_', 'single')
  const [singleCryo_dmg_Value, singleCryo_dmg_partialCond, singleCryo_dmg_valueRaw] = generateBuffStat(key, 'cryo_dmg_', 'single')
  const [singleCommon_dmg_Value, singleCommon_dmg_partialCond, singleCommon_dmg_valueRaw] = generateBuffStat(key, 'all_dmg_', 'single')
  const [singleNormal_dmg_Value, singleNormal_dmg_partialCond, singleNormal_dmg_valueRaw] = generateBuffStat(key, 'normal_dmg_', 'single')
  const [singleNormal_critRate_Value, singleNormal_critRate_partialCond, singleNormal_critRate_valueRaw] = generateBuffStat(key, 'normal_critRate_', 'single')
  const [singleNormal_critDMG_Value, singleNormal_critDMG_partialCond, singleNormal_critDMG_valueRaw] = generateBuffStat(key, 'normal_critDMG_', 'single')
  const [singleCharged_dmg_Value, singleCharged_dmg_partialCond, singleCharged_dmg_valueRaw] = generateBuffStat(key, 'charged_dmg_', 'single')
  const [singleCharged_critRate_Value, singleCharged_critRate_partialCond, singleCharged_critRate_valueRaw] = generateBuffStat(key, 'charged_critRate_', 'single')
  const [singleCharged_critDMG_Value, singleCharged_critDMG_partialCond, singleCharged_critDMG_valueRaw] = generateBuffStat(key, 'charged_critDMG_', 'single')
  const [singlePlunging_dmg_Value, singlePlunging_dmg_partialCond, singlePlunging_dmg_valueRaw] = generateBuffStat(key, 'plunging_dmg_', 'single')
  const [singlePlunging_critRate_Value, singlePlunging_critRate_partialCond, singlePlunging_critRate_valueRaw] = generateBuffStat(key, 'plunging_critRate_', 'single')
  const [singlePlunging_critDMG_Value, singlePlunging_critDMG_partialCond, singlePlunging_critDMG_valueRaw] = generateBuffStat(key, 'plunging_critDMG_', 'single')
  const [singleSkill_dmg_Value, singleSkill_dmg_partialCond, singleSkill_dmg_valueRaw] = generateBuffStat(key, 'skill_dmg_', 'single')
  const [singleSkill_critRate_Value, singleSkill_critRate_partialCond, singleSkill_critRate_valueRaw] = generateBuffStat(key, 'skill_critRate_', 'single')
  const [singleSkill_critDMG_Value, singleSkill_critDMG_partialCond, singleSkill_critDMG_valueRaw] = generateBuffStat(key, 'skill_critDMG_', 'single')
  const [singleBurst_dmg_Value, singleBurst_dmg_partialCond, singleBurst_dmg_valueRaw] = generateBuffStat(key, 'burst_dmg_', 'single')
  const [singleBurst_critRate_Value, singleBurst_critRate_partialCond, singleBurst_critRate_valueRaw] = generateBuffStat(key, 'burst_critRate_', 'single')
  const [singleBurst_critDMG_Value, singleBurst_critDMG_partialCond, singleBurst_critDMG_valueRaw] = generateBuffStat(key, 'burst_critDMG_', 'single')
  const [singleLunarbloomBonus_Value, singleLunarbloomBonus_partialCond, singleLunarbloomBonus_valueRaw] = generateBuffStat(key, 'lunarbloom_dmg_', 'single')
  const [singleLunarbloom_critRate_Value, singleLunarbloom_critRate_partialCond, singleLunarbloom_critRate_valueRaw] = generateBuffStat(key, 'lunarbloom_critRate_', 'single')
  const [singleLunarbloom_critDMG_Value, singleLunarbloom_critDMG_partialCond, singleLunarbloom_critDMG_valueRaw] = generateBuffStat(key, 'lunarbloom_critDMG_', 'single')
  const [singleLunarchargedBonus_Value, singleLunarchargedBonus_partialCond, singleLunarchargedBonus_valueRaw] = generateBuffStat(key, 'lunarcharged_dmg_', 'single')
  const [singleLunarcharged_critRate_Value, singleLunarcharged_critRate_partialCond, singleLunarcharged_critRate_valueRaw] = generateBuffStat(key, 'lunarcharged_critRate_', 'single')
  const [singleLunarcharged_critDMG_Value, singleLunarcharged_critDMG_partialCond, singleLunarcharged_critDMG_valueRaw] = generateBuffStat(key, 'lunarcharged_critDMG_', 'single')
  const [singleLunarcrystallizeBonus_Value, singleLunarcrystallizeBonus_partialCond, singleLunarcrystallizeBonus_valueRaw] = generateBuffStat(key, 'lunarcrystallize_dmg_', 'single')
  const [singleLunarcrystallize_critRate_Value, singleLunarcrystallize_critRate_partialCond, singleLunarcrystallize_critRate_valueRaw] = generateBuffStat(key, 'lunarcrystallize_critRate_', 'single')
  const [singleLunarcrystallize_critDMG_Value, singleLunarcrystallize_critDMG_partialCond, singleLunarcrystallize_critDMG_valueRaw] = generateBuffStat(key, 'lunarcrystallize_critDMG_', 'single')

  const [buffAtk_Value, buffAtk_partialCond] = generateBuffStat(key, 'atk_', 'team')
  const [buffDef_Value, buffDef_partialCond] = generateBuffStat(key, 'def_', 'team')
  const [buffHp_Value, buffHp_partialCond] = generateBuffStat(key, 'hp_', 'team')
  const [buffEm_Value, buffEm_partialCond] = generateBuffStat(key, 'eleMas', 'team')
  const [buffEnerRech_Value, buffEnerRech_partialCond] = generateBuffStat(key, 'enerRech_', 'team')
  const [buffHeal_Value, buffHeal_partialCond] = generateBuffStat(key, 'heal_', 'team')
  const [buffCritRate_Value, buffCritRate_partialCond] = generateBuffStat(key, 'critRate_', 'team')
  const [buffCritDMG_Value, buffCritDMG_partialCond] = generateBuffStat(key, 'critDMG_', 'team')
  const [buffDmgMulti_Value, buffDmgMulti_partialCond] = generateBuffStat(key, 'dmgMultiplier_', 'team')
  const [buffPhysical_dmg_Value, buffPhysical_dmg_partialCond] = generateBuffStat(key, 'physical_dmg_', 'team')
  const [buffAnemo_dmg_Value, buffAnemo_dmg_partialCond] = generateBuffStat(key, 'anemo_dmg_', 'team')
  const [buffGeo_dmg_Value, buffGeo_dmg_partialCond] = generateBuffStat(key, 'geo_dmg_', 'team')
  const [buffElectro_dmg_Value, buffElectro_dmg_partialCond] = generateBuffStat(key, 'electro_dmg_', 'team')
  const [buffDendro_dmg_Value, buffDendro_dmg_partialCond] = generateBuffStat(key, 'dendro_dmg_', 'team')
  const [buffHydro_dmg_Value, buffHydro_dmg_partialCond] = generateBuffStat(key, 'hydro_dmg_', 'team')
  const [buffPyro_dmg_Value, buffPyro_dmg_partialCond] = generateBuffStat(key, 'pyro_dmg_', 'team')
  const [buffCryo_dmg_Value, buffCryo_dmg_partialCond] = generateBuffStat(key, 'cryo_dmg_', 'team')
  const [buffCommon_dmg_Value, buffCommon_dmg_partialCond] = generateBuffStat(key, 'all_dmg_', 'team')
  const [buffNormal_dmg_Value, buffNormal_dmg_partialCond] = generateBuffStat(key, 'normal_dmg_', 'team')
  const [buffNormal_critRate_Value, buffNormal_critRate_partialCond] = generateBuffStat(key, 'normal_critRate_', 'team')
  const [buffNormal_critDMG_Value, buffNormal_critDMG_partialCond] = generateBuffStat(key, 'normal_critDMG_', 'team')
  const [buffCharged_dmg_Value, buffCharged_dmg_partialCond] = generateBuffStat(key, 'charged_dmg_', 'team')
  const [buffCharged_critRate_Value, buffCharged_critRate_partialCond] = generateBuffStat(key, 'charged_critRate_', 'team')
  const [buffCharged_critDMG_Value, buffCharged_critDMG_partialCond] = generateBuffStat(key, 'charged_critDMG_', 'team')
  const [buffPlunging_dmg_Value, buffPlunging_dmg_partialCond] = generateBuffStat(key, 'plunging_dmg_', 'team')
  const [buffPlunging_critRate_Value, buffPlunging_critRate_partialCond] = generateBuffStat(key, 'plunging_critRate_', 'team')
  const [buffPlunging_critDMG_Value, buffPlunging_critDMG_partialCond] = generateBuffStat(key, 'plunging_critDMG_', 'team')
  const [buffSkill_dmg_Value, buffSkill_dmg_partialCond] = generateBuffStat(key, 'skill_dmg_', 'team')
  const [buffSkill_critRate_Value, buffSkill_critRate_partialCond] = generateBuffStat(key, 'skill_critRate_', 'team')
  const [buffSkill_critDMG_Value, buffSkill_critDMG_partialCond] = generateBuffStat(key, 'skill_critDMG_', 'team')
  const [buffBurst_dmg_Value, buffBurst_dmg_partialCond] = generateBuffStat(key, 'burst_dmg_', 'team')
  const [buffBurst_critRate_Value, buffBurst_critRate_partialCond] = generateBuffStat(key, 'burst_critRate_', 'team')
  const [buffBurst_critDMG_Value, buffBurst_critDMG_partialCond] = generateBuffStat(key, 'burst_critDMG_', 'team')
  const [buffLunarBaseDmg_Value, buffLunarBaseDmg_partialCond] = generateBuffStat(key, 'lunar_base_dmg_', 'team')
  const buffLunarBaseDmg_obj = objKeyValMap(allLunarReactionKeys, (k) => [`${k}_baseDmg_`, { ...buffLunarBaseDmg_Value, }, ])
  const [buffLunarbloomBonus_Value, buffLunarbloomBonus_partialCond] = generateBuffStat(key, 'lunarbloom_dmg_', 'team')
  const [buffLunarbloom_critRate_Value, buffLunarbloom_critRate_partialCond] = generateBuffStat(key, 'lunarbloom_critRate_', 'team')
  const [buffLunarbloom_critDMG_Value, buffLunarbloom_critDMG_partialCond] = generateBuffStat(key, 'lunarbloom_critDMG_', 'team')
  const [buffLunarchargedBonus_Value, buffLunarchargedBonus_partialCond] = generateBuffStat(key, 'lunarcharged_dmg_', 'team')
  const [buffLunarcharged_critRate_Value, buffLunarcharged_critRate_partialCond] = generateBuffStat(key, 'lunarcharged_critRate_', 'team')
  const [buffLunarcharged_critDMG_Value, buffLunarcharged_critDMG_partialCond] = generateBuffStat(key, 'lunarcharged_critDMG_', 'team')
  const [buffLunarcrystallizeBonus_Value, buffLunarcrystallizeBonus_partialCond] = generateBuffStat(key, 'lunarcrystallize_dmg_', 'team')
  const [buffLunarcrystallize_critRate_Value, buffLunarcrystallize_critRate_partialCond] = generateBuffStat(key, 'lunarcrystallize_critRate_', 'team')
  const [buffLunarcrystallize_critDMG_Value, buffLunarcrystallize_critDMG_partialCond] = generateBuffStat(key, 'lunarcrystallize_critDMG_', 'team')

  const [resPhysical_Value, resPhysical_partialCond] = generateDefuffRes(key, 'physical')
  const [resAnemo_Value, resAnemo_partialCond] = generateDefuffRes(key, 'anemo')
  const [resGeo_Value, resGeo_partialCond] = generateDefuffRes(key, 'geo')
  const [resElectro_Value, resElectro_partialCond] = generateDefuffRes(key, 'electro')
  const [resDendro_Value, resDendro_partialCond] = generateDefuffRes(key, 'dendro')
  const [resHydro_Value, resHydro_partialCond] = generateDefuffRes(key, 'hydro')
  const [resPyro_Value, resPyro_partialCond] = generateDefuffRes(key, 'pyro')
  const [resCryo_Value, resCryo_partialCond] = generateDefuffRes(key, 'cryo')

  const [enemyDefRed_Value, enemyDefRed_partialCond] = generateDebuffDef(key, 'enemyDefRed_')
  const [enemyDefIgn_Value, enemyDefIgn_partialCond] = generateDebuffDef(key, 'enemyDefIgn_')

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
      skillAtkDmg: dmgNode('atk', dm.skill.dmgScale, 'skill'),
      skillDefDmg: dmgNode('def', dm.skill.dmgScale, 'skill'),
      skillHpDmg: dmgNode('hp', dm.skill.dmgScale.map(x => x / 100), 'skill'),
      skillEmDmg: dmgNode('eleMas', dm.skill.dmgScale, 'skill'),
      skillAtkDmgLunarbloom: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'atk',
        'lunarbloom'
      ),
      skillAtkDmgLunarcharged: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'atk',
        'lunarcharged'
      ),
      skillAtkDmgLunarcrystallize: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'atk',
        'lunarcrystallize'
      ),
      skillDefDmgLunarbloom: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'def',
        'lunarbloom'
      ),
      skillDefDmgLunarcharged: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'def',
        'lunarcharged'
      ),
      skillDefDmgLunarcrystallize: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'def',
        'lunarcrystallize'
      ),
      skillHpDmgLunarbloom: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale.map(x => x / 100), { unit: '%' }),
        'hp',
        'lunarbloom'
      ),
      skillHpDmgLunarcharged: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale.map(x => x / 100), { unit: '%' }),
        'hp',
        'lunarcharged'
      ),
      skillHpDmgLunarcrystallize: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale.map(x => x / 100), { unit: '%' }),
        'hp',
        'lunarcrystallize'
      ),
      skillEmDmgLunarbloom: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'eleMas',
        'lunarbloom'
      ),
      skillEmDmgLunarcharged: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'eleMas',
        'lunarcharged'
      ),
      skillEmDmgLunarcrystallize: lunarDmg(
        subscript(input.total.skillIndex, dm.skill.dmgReactionScale, { unit: '%' }),
        'eleMas',
        'lunarcrystallize'
      ),
    },
    burst: {
      skillAtkDmg: dmgNode('atk', dm.burst.dmgScale, 'burst'),
      skillDefDmg: dmgNode('def', dm.burst.dmgScale, 'burst'),
      skillHpDmg: dmgNode('hp', dm.burst.dmgScale.map(x => x / 100), 'burst'),
      skillEmDmg: dmgNode('eleMas', dm.burst.dmgScale, 'burst'),
      skillAtkDmgLunarbloom: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'atk',
        'lunarbloom'
      ),
      skillAtkDmgLunarcharged: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'atk',
        'lunarcharged'
      ),
      skillAtkDmgLunarcrystallize: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'atk',
        'lunarcrystallize'
      ),
      skillDefDmgLunarbloom: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'def',
        'lunarbloom'
      ),
      skillDefDmgLunarcharged: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'def',
        'lunarcharged'
      ),
      skillDefDmgLunarcrystallize: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'def',
        'lunarcrystallize'
      ),
      skillHpDmgLunarbloom: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale.map(x => x / 100), { unit: '%' }),
        'hp',
        'lunarbloom'
      ),
      skillHpDmgLunarcharged: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale.map(x => x / 100), { unit: '%' }),
        'hp',
        'lunarcharged'
      ),
      skillHpDmgLunarcrystallize: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale.map(x => x / 100), { unit: '%' }),
        'hp',
        'lunarcrystallize'
      ),
      skillEmDmgLunarbloom: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'eleMas',
        'lunarbloom'
      ),
      skillEmDmgLunarcharged: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'eleMas',
        'lunarcharged'
      ),
      skillEmDmgLunarcrystallize: lunarDmg(
        subscript(input.total.burstIndex, dm.burst.dmgReactionScale, { unit: '%' }),
        'eleMas',
        'lunarcrystallize'
      ),
    },
  }

  const burstC3 = greaterEq(input.constellation, 3, 3)
  const skillC5 = greaterEq(input.constellation, 5, 3)

  const data = dataObjForCharacterSheet(key, dmgFormulas, {
    premod: {
      burstBoost: burstC3,
      skillBoost: skillC5,
      hp_: sum(equal(ascensionStatValueNode, 'hp_', infoMut(percent(ascensionStatValues['hp_']), { path: 'hp_' })), selfHp_Value),
      atk_: sum(equal(ascensionStatValueNode, 'atk_', infoMut(percent(ascensionStatValues['atk_']), { path: 'atk_' })), selfAtk_Value),
      def_: sum(equal(ascensionStatValueNode, 'def_', infoMut(percent(ascensionStatValues['def_']), { path: 'def_' })), selfDef_Value),
      eleMas: sum(equal(ascensionStatValueNode, 'eleMas', infoMut(constant(ascensionStatValues['eleMas']), { path: 'eleMas' })), selfEm_Value),
      enerRech_: sum(equal(ascensionStatValueNode, 'enerRech_', infoMut(percent(ascensionStatValues['enerRech_']), { path: 'enerRech_' })), selfEnerRech_Value),
      heal_: sum(equal(ascensionStatValueNode, 'heal_', infoMut(percent(ascensionStatValues['heal_']), { path: 'heal_' })), selfHeal_Value),
      critRate_: sum(equal(ascensionStatValueNode, 'critRate_', infoMut(percent(ascensionStatValues['critRate_']), { path: 'critRate_' })), selfCritRate_Value),
      critDMG_: sum(equal(ascensionStatValueNode, 'critDMG_', infoMut(percent(ascensionStatValues['critDMG_']), { path: 'critDMG_' })), selfCritDMG_Value),
      dmgMultiplier_: selfDmgMulti_Value,
      physical_dmg_: sum(equal(ascensionStatValueNode, 'physical_dmg_', infoMut(percent(ascensionStatValues['physical_dmg_']), { path: 'physical_dmg_' })), selfPhysical_dmg_Value),
      anemo_dmg_: sum(equal(ascensionStatValueNode, 'anemo_dmg_', infoMut(percent(ascensionStatValues['anemo_dmg_']), { path: 'anemo_dmg_' })), selfAnemo_dmg_Value),
      geo_dmg_: sum(equal(ascensionStatValueNode, 'geo_dmg_', infoMut(percent(ascensionStatValues['geo_dmg_']), { path: 'geo_dmg_' })), selfGeo_dmg_Value),
      electro_dmg_: sum(equal(ascensionStatValueNode, 'electro_dmg_', infoMut(percent(ascensionStatValues['electro_dmg_']), { path: 'electro_dmg_' })), selfElectro_dmg_Value),
      hydro_dmg_: sum(equal(ascensionStatValueNode, 'hydro_dmg_', infoMut(percent(ascensionStatValues['hydro_dmg_']), { path: 'hydro_dmg_' })), selfHydro_dmg_Value),
      pyro_dmg_: sum(equal(ascensionStatValueNode, 'pyro_dmg_', infoMut(percent(ascensionStatValues['pyro_dmg_']), { path: 'pyro_dmg_' })), selfPyro_dmg_Value),
      cryo_dmg_: sum(equal(ascensionStatValueNode, 'cryo_dmg_', infoMut(percent(ascensionStatValues['cryo_dmg_']), { path: 'cryo_dmg_' })), selfCryo_dmg_Value),
      dendro_dmg_: sum(equal(ascensionStatValueNode, 'dendro_dmg_', infoMut(percent(ascensionStatValues['dendro_dmg_']), { path: 'dendro_dmg_' })), selfDendro_dmg_Value),
      all_dmg_: selfCommon_dmg_Value,
      normal_dmg_: selfNormal_dmg_Value,
      normal_critRate_: selfNormal_critRate_Value,
      normal_critDMG_: selfNormal_critDMG_Value,
      charged_dmg_: selfCharged_dmg_Value,
      charged_critRate_: selfCharged_critRate_Value,
      charged_critDMG_: selfCharged_critDMG_Value,
      plunging_dmg_: selfPlunging_dmg_Value,
      plunging_critRate_: selfPlunging_critRate_Value,
      plunging_critDMG_: selfPlunging_critDMG_Value,
      skill_dmg_: selfSkill_dmg_Value,
      skill_critRate_: selfSkill_critRate_Value,
      skill_critDMG_: selfSkill_critDMG_Value,
      burst_dmg_: selfBurst_dmg_Value,
      burst_critRate_: selfBurst_critRate_Value,
      burst_critDMG_: selfBurst_critDMG_Value,
      lunarbloom_dmg_: selfLunarbloomBonus_Value,
      lunarbloom_critRate_: selfLunarbloom_critRate_Value,
      lunarbloom_critDMG_: selfLunarbloom_critDMG_Value,
      lunarcharged_dmg_: selfLunarchargedBonus_Value,
      lunarcharged_critRate_: selfLunarcharged_critRate_Value,
      lunarcharged_critDMG_: selfLunarcharged_critDMG_Value,
      lunarcrystallize_dmg_: selfLunarcrystallizeBonus_Value,
      lunarcrystallize_critRate_: selfLunarcrystallize_critRate_Value,
      lunarcrystallize_critDMG_: selfLunarcrystallize_critDMG_Value,
      enemyDefIgn_: enemyDefIgn_Value,
    },
    base: {
      atk: greaterEq(bAtk_Value, 0, bAtk_Value),
      def: greaterEq(bDef_Value, 0, bDef_Value),
      hp: greaterEq(bHp_Value, 0, bHp_Value),
    },
    infusion: {
      nonOverridableSelf: infusion,
    },
    teamBuff: {
      premod: {
        atk_: sum(buffAtk_Value, singleAtk_Value),
        def_: sum(buffDef_Value, singleDef_Value),
        hp_: sum(buffHp_Value, singleHp_Value),
        eleMas: sum(buffEm_Value, singleEm_Value),
        enerRech_: sum(buffEnerRech_Value, singleEnerRech_Value),
        heal_: sum(buffHeal_Value, singleHeal_Value),
        critRate_: sum(buffCritRate_Value, singleCritRate_Value),
        critDMG_: sum(buffCritDMG_Value, singleCritDMG_Value),
        dmgMultiplier_: sum(buffDmgMulti_Value, singleDmgMulti_Value),
        physical_dmg_: sum(buffPhysical_dmg_Value, singlePhysical_dmg_Value),
        anemo_dmg_: sum(buffAnemo_dmg_Value, singleAnemo_dmg_Value),
        geo_dmg_: sum(buffGeo_dmg_Value, singleGeo_dmg_Value),
        electro_dmg_: sum(buffElectro_dmg_Value, singleElectro_dmg_Value),
        hydro_dmg_: sum(buffHydro_dmg_Value, singleHydro_dmg_Value),
        pyro_dmg_: sum(buffPyro_dmg_Value, singlePyro_dmg_Value),
        cryo_dmg_: sum(buffCryo_dmg_Value, singleCryo_dmg_Value),
        dendro_dmg_: sum(buffDendro_dmg_Value, singleDendro_dmg_Value),
        all_dmg_: sum(buffCommon_dmg_Value, singleCommon_dmg_Value),
        normal_dmg_: sum(buffNormal_dmg_Value, singleNormal_dmg_Value),
        normal_critRate_: sum(buffNormal_critRate_Value, singleNormal_critRate_Value),
        normal_critDMG_: sum(buffNormal_critDMG_Value, singleNormal_critDMG_Value),
        charged_dmg_: sum(buffCharged_dmg_Value, singleCharged_dmg_Value),
        charged_critRate_: sum(buffCharged_critRate_Value, singleCharged_critRate_Value),
        charged_critDMG_: sum(buffCharged_critDMG_Value, singleCharged_critDMG_Value),
        plunging_dmg_: sum(buffPlunging_dmg_Value, singlePlunging_dmg_Value),
        plunging_critRate_: sum(buffPlunging_critRate_Value, singlePlunging_critRate_Value),
        plunging_critDMG_: sum(buffPlunging_critDMG_Value, singlePlunging_critDMG_Value),
        skill_dmg_: sum(buffSkill_dmg_Value, singleSkill_dmg_Value),
        skill_critRate_: sum(buffSkill_critRate_Value, singleSkill_critRate_Value),
        skill_critDMG_: sum(buffSkill_critDMG_Value, singleSkill_critDMG_Value),
        burst_dmg_: sum(buffBurst_dmg_Value, singleBurst_dmg_Value),
        burst_critRate_: sum(buffBurst_critRate_Value, singleBurst_critRate_Value),
        burst_critDMG_: sum(buffBurst_critDMG_Value, singleBurst_critDMG_Value),
        ...buffLunarBaseDmg_obj,
        lunarbloom_dmg_: sum(buffLunarbloomBonus_Value, singleLunarbloomBonus_Value),
        lunarbloom_critRate_: sum(buffLunarbloom_critRate_Value, singleLunarbloom_critRate_Value),
        lunarbloom_critDMG_: sum(buffLunarbloom_critDMG_Value, singleLunarbloom_critDMG_Value),
        lunarcharged_dmg_: sum(buffLunarchargedBonus_Value, singleLunarchargedBonus_Value),
        lunarcharged_critRate_: sum(buffLunarcharged_critRate_Value, singleLunarcharged_critRate_Value),
        lunarcharged_critDMG_: sum(buffLunarcharged_critDMG_Value, singleLunarcharged_critDMG_Value),
        lunarcrystallize_dmg_: sum(buffLunarcrystallizeBonus_Value, singleLunarcrystallizeBonus_Value),
        lunarcrystallize_critRate_: sum(buffLunarcrystallize_critRate_Value, singleLunarcrystallize_critRate_Value),
        lunarcrystallize_critDMG_: sum(buffLunarcrystallize_critDMG_Value, singleLunarcrystallize_critDMG_Value),
        geo_enemyRes_: resGeo_Value,
        hydro_enemyRes_: resHydro_Value,
        pyro_enemyRes_: resPyro_Value,
        cryo_enemyRes_: resCryo_Value,
        electro_enemyRes_: resElectro_Value,
        dendro_enemyRes_: resDendro_Value,
        anemo_enemyRes_: resAnemo_Value,
        physical_enemyRes_: resPhysical_Value,
        enemyDefRed_: enemyDefRed_Value,
      },
    },
  })

  const sheet: TalentSheet = {
    auto: ct.talentTem('auto', [
      ct.condTem('auto', {
        value: condInfusion,
        path: condInfusionPath,
        name: ct.ch('infusion.enter'),
        states: {
          on: {
            fields: [
              /*
              {
                text: st('infusion.' + elementKey),
                variant: elementKey,
              },
              */
            ],
          },
        },
      }),
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
            node: infoMut(dmgFormulas.skill.skillAtkDmg, {
              name: ct.chg('skill.skillParams.10'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillAtkDmgLunarbloom, {
              name: ct.chg('skill.skillParams.14'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillAtkDmgLunarcharged, {
              name: ct.chg('skill.skillParams.15'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillAtkDmgLunarcrystallize, {
              name: ct.chg('skill.skillParams.16'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillDefDmg, {
              name: ct.chg('skill.skillParams.11'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillDefDmgLunarbloom, {
              name: ct.chg('skill.skillParams.17'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillDefDmgLunarcharged, {
              name: ct.chg('skill.skillParams.18'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillDefDmgLunarcrystallize, {
              name: ct.chg('skill.skillParams.19'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillHpDmg, {
              name: ct.chg('skill.skillParams.12'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillHpDmgLunarbloom, {
              name: ct.chg('skill.skillParams.20'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillHpDmgLunarcharged, {
              name: ct.chg('skill.skillParams.21'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillHpDmgLunarcrystallize, {
              name: ct.chg('skill.skillParams.22'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillEmDmg, {
              name: ct.chg('skill.skillParams.13'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillEmDmgLunarbloom, {
              name: ct.chg('skill.skillParams.23'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillEmDmgLunarcharged, {
              name: ct.chg('skill.skillParams.24'),
            }),
          },
          {
            node: infoMut(dmgFormulas.skill.skillEmDmgLunarcrystallize, {
              name: ct.chg('skill.skillParams.25'),
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
            node: infoMut(dmgFormulas.burst.skillAtkDmg, {
              name: ct.chg('burst.skillParams.10'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillAtkDmgLunarbloom, {
              name: ct.chg('burst.skillParams.14'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillAtkDmgLunarcharged, {
              name: ct.chg('burst.skillParams.15'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillAtkDmgLunarcrystallize, {
              name: ct.chg('burst.skillParams.16'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillDefDmg, {
              name: ct.chg('burst.skillParams.11'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillDefDmgLunarbloom, {
              name: ct.chg('burst.skillParams.17'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillDefDmgLunarcharged, {
              name: ct.chg('burst.skillParams.18'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillDefDmgLunarcrystallize, {
              name: ct.chg('burst.skillParams.19'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillHpDmg, {
              name: ct.chg('burst.skillParams.12'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillHpDmgLunarbloom, {
              name: ct.chg('burst.skillParams.20'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillHpDmgLunarcharged, {
              name: ct.chg('burst.skillParams.21'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillHpDmgLunarcrystallize, {
              name: ct.chg('burst.skillParams.22'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillEmDmg, {
              name: ct.chg('burst.skillParams.13'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillEmDmgLunarbloom, {
              name: ct.chg('burst.skillParams.23'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillEmDmgLunarcharged, {
              name: ct.chg('burst.skillParams.24'),
            }),
          },
          {
            node: infoMut(dmgFormulas.burst.skillEmDmgLunarcrystallize, {
              name: ct.chg('burst.skillParams.25'),
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
      ct.condTem('passive1', selfAtk_partialCond),
      ct.condTem('passive1', selfDef_partialCond),
      ct.condTem('passive1', selfHp_partialCond),
      ct.condTem('passive1', selfEm_partialCond),
      ct.condTem('passive1', selfEnerRech_partialCond),
      ct.condTem('passive1', selfHeal_partialCond),
      ct.condTem('passive1', selfCritRate_partialCond),
      ct.condTem('passive1', selfCritDMG_partialCond),
      ct.condTem('passive1', selfDmgMulti_partialCond),
      ct.condTem('passive1', selfPhysical_dmg_partialCond),
      ct.condTem('passive1', selfAnemo_dmg_partialCond),
      ct.condTem('passive1', selfGeo_dmg_partialCond),
      ct.condTem('passive1', selfElectro_dmg_partialCond),
      ct.condTem('passive1', selfDendro_dmg_partialCond),
      ct.condTem('passive1', selfHydro_dmg_partialCond),
      ct.condTem('passive1', selfPyro_dmg_partialCond),
      ct.condTem('passive1', selfCryo_dmg_partialCond),
      ct.condTem('passive1', selfCommon_dmg_partialCond),
      ct.condTem('passive1', selfNormal_dmg_partialCond),
      ct.condTem('passive1', selfNormal_critRate_partialCond),
      ct.condTem('passive1', selfNormal_critDMG_partialCond),
      ct.condTem('passive1', selfCharged_dmg_partialCond),
      ct.condTem('passive1', selfCharged_critRate_partialCond),
      ct.condTem('passive1', selfCharged_critDMG_partialCond),
      ct.condTem('passive1', selfPlunging_dmg_partialCond),
      ct.condTem('passive1', selfPlunging_critRate_partialCond),
      ct.condTem('passive1', selfPlunging_critDMG_partialCond),
      ct.condTem('passive1', selfSkill_dmg_partialCond),
      ct.condTem('passive1', selfSkill_critRate_partialCond),
      ct.condTem('passive1', selfSkill_critDMG_partialCond),
      ct.condTem('passive1', selfBurst_dmg_partialCond),
      ct.condTem('passive1', selfBurst_critRate_partialCond),
      ct.condTem('passive1', selfBurst_critDMG_partialCond),
      ct.condTem('passive1', selfLunarbloomBonus_partialCond),
      ct.condTem('passive1', selfLunarbloom_critRate_partialCond),
      ct.condTem('passive1', selfLunarbloom_critDMG_partialCond),
      ct.condTem('passive1', selfLunarchargedBonus_partialCond),
      ct.condTem('passive1', selfLunarcharged_critRate_partialCond),
      ct.condTem('passive1', selfLunarcharged_critDMG_partialCond),
      ct.condTem('passive1', selfLunarcrystallizeBonus_partialCond),
      ct.condTem('passive1', selfLunarcrystallize_critRate_partialCond),
      ct.condTem('passive1', selfLunarcrystallize_critDMG_partialCond),
      ct.fieldsTem('passive1', {
        fields: [
          { node: selfAtk_Value, },
          { node: selfDef_Value, },
          { node: selfHp_Value, },
          { node: selfEm_Value, },
          { node: selfEnerRech_Value, },
          { node: selfHeal_Value, },
          { node: selfCritRate_Value, },
          { node: selfCritDMG_Value, },
          { node: selfDmgMulti_Value, },
          { node: selfPhysical_dmg_Value, },
          { node: selfAnemo_dmg_Value, },
          { node: selfGeo_dmg_Value, },
          { node: selfElectro_dmg_Value, },
          { node: selfDendro_dmg_Value, },
          { node: selfHydro_dmg_Value, },
          { node: selfPyro_dmg_Value, },
          { node: selfCryo_dmg_Value, },
          { node: selfCommon_dmg_Value, },
          { node: selfNormal_dmg_Value, },
          { node: selfNormal_critRate_Value, },
          { node: selfNormal_critDMG_Value, },
          { node: selfCharged_dmg_Value, },
          { node: selfCharged_critRate_Value, },
          { node: selfCharged_critDMG_Value, },
          { node: selfPlunging_dmg_Value, },
          { node: selfPlunging_critRate_Value, },
          { node: selfPlunging_critDMG_Value, },
          { node: selfSkill_dmg_Value, },
          { node: selfSkill_critRate_Value, },
          { node: selfSkill_critDMG_Value, },
          { node: selfBurst_dmg_Value, },
          { node: selfBurst_critRate_Value, },
          { node: selfBurst_critDMG_Value, },
          { node: selfLunarbloomBonus_Value, },
          { node: selfLunarbloom_critRate_Value, },
          { node: selfLunarbloom_critDMG_Value, },
          { node: selfLunarchargedBonus_Value, },
          { node: selfLunarcharged_critRate_Value, },
          { node: selfLunarcharged_critDMG_Value, },
          { node: selfLunarcrystallizeBonus_Value, },
          { node: selfLunarcrystallize_critRate_Value, },
          { node: selfLunarcrystallize_critDMG_Value, },
        ]
      }),
    ]),
    passive2: ct.talentTem('passive2', [
      ct.condTem('passive2', singleAtk_partialCond),
      ct.condTem('passive2', singleDef_partialCond),
      ct.condTem('passive2', singleHp_partialCond),
      ct.condTem('passive2', singleEm_partialCond),
      ct.condTem('passive2', singleEnerRech_partialCond),
      ct.condTem('passive2', singleHeal_partialCond),
      ct.condTem('passive2', singleCritRate_partialCond),
      ct.condTem('passive2', singleCritDMG_partialCond),
      ct.condTem('passive2', singleDmgMulti_partialCond),
      ct.condTem('passive2', singlePhysical_dmg_partialCond),
      ct.condTem('passive2', singleAnemo_dmg_partialCond),
      ct.condTem('passive2', singleGeo_dmg_partialCond),
      ct.condTem('passive2', singleElectro_dmg_partialCond),
      ct.condTem('passive2', singleDendro_dmg_partialCond),
      ct.condTem('passive2', singleHydro_dmg_partialCond),
      ct.condTem('passive2', singlePyro_dmg_partialCond),
      ct.condTem('passive2', singleCryo_dmg_partialCond),
      ct.condTem('passive2', singleCommon_dmg_partialCond),
      ct.condTem('passive2', singleNormal_dmg_partialCond),
      ct.condTem('passive2', singleNormal_critRate_partialCond),
      ct.condTem('passive2', singleNormal_critDMG_partialCond),
      ct.condTem('passive2', singleCharged_dmg_partialCond),
      ct.condTem('passive2', singleCharged_critRate_partialCond),
      ct.condTem('passive2', singleCharged_critDMG_partialCond),
      ct.condTem('passive2', singlePlunging_dmg_partialCond),
      ct.condTem('passive2', singlePlunging_critRate_partialCond),
      ct.condTem('passive2', singlePlunging_critDMG_partialCond),
      ct.condTem('passive2', singleSkill_dmg_partialCond),
      ct.condTem('passive2', singleSkill_critRate_partialCond),
      ct.condTem('passive2', singleSkill_critDMG_partialCond),
      ct.condTem('passive2', singleBurst_dmg_partialCond),
      ct.condTem('passive2', singleBurst_critRate_partialCond),
      ct.condTem('passive2', singleBurst_critDMG_partialCond),
      ct.condTem('passive2', singleLunarbloomBonus_partialCond),
      ct.condTem('passive2', singleLunarbloom_critRate_partialCond),
      ct.condTem('passive2', singleLunarbloom_critDMG_partialCond),
      ct.condTem('passive2', singleLunarchargedBonus_partialCond),
      ct.condTem('passive2', singleLunarcharged_critRate_partialCond),
      ct.condTem('passive2', singleLunarcharged_critDMG_partialCond),
      ct.condTem('passive2', singleLunarcrystallizeBonus_partialCond),
      ct.condTem('passive2', singleLunarcrystallize_critRate_partialCond),
      ct.condTem('passive2', singleLunarcrystallize_critDMG_partialCond),
      ct.fieldsTem('passive2', {
        fields: [
          { node: singleAtk_valueRaw, },
          { node: singleDef_valueRaw, },
          { node: singleHp_valueRaw, },
          { node: singleEm_valueRaw, },
          { node: singleEnerRech_valueRaw, },
          { node: singleHeal_valueRaw, },
          { node: singleCritRate_valueRaw, },
          { node: singleCritDMG_valueRaw, },
          { node: singleDmgMulti_valueRaw, },
          { node: singlePhysical_dmg_valueRaw, },
          { node: singleAnemo_dmg_valueRaw, },
          { node: singleGeo_dmg_valueRaw, },
          { node: singleElectro_dmg_valueRaw, },
          { node: singleDendro_dmg_valueRaw, },
          { node: singleHydro_dmg_valueRaw, },
          { node: singlePyro_dmg_valueRaw, },
          { node: singleCryo_dmg_valueRaw, },
          { node: singleCommon_dmg_valueRaw, },
          { node: singleNormal_dmg_valueRaw, },
          { node: singleNormal_critRate_valueRaw, },
          { node: singleNormal_critDMG_valueRaw, },
          { node: singleCharged_dmg_valueRaw, },
          { node: singleCharged_critRate_valueRaw, },
          { node: singleCharged_critDMG_valueRaw, },
          { node: singlePlunging_dmg_valueRaw, },
          { node: singlePlunging_critRate_valueRaw, },
          { node: singlePlunging_critDMG_valueRaw, },
          { node: singleSkill_dmg_valueRaw, },
          { node: singleSkill_critRate_valueRaw, },
          { node: singleSkill_critDMG_valueRaw, },
          { node: singleBurst_dmg_valueRaw, },
          { node: singleBurst_critRate_valueRaw, },
          { node: singleBurst_critDMG_valueRaw, },
          { node: singleLunarbloomBonus_valueRaw, },
          { node: singleLunarbloom_critRate_valueRaw, },
          { node: singleLunarbloom_critDMG_valueRaw, },
          { node: singleLunarchargedBonus_valueRaw, },
          { node: singleLunarcharged_critRate_valueRaw, },
          { node: singleLunarcharged_critDMG_valueRaw, },
          { node: singleLunarcrystallizeBonus_valueRaw, },
          { node: singleLunarcrystallize_critRate_valueRaw, },
          { node: singleLunarcrystallize_critDMG_valueRaw, },
        ]
      }),
    ]),
    passive3: ct.talentTem('passive3', [
      ct.condTem('passive3', bAtk_x00_partialCond),
      ct.condTem('passive3', bAtk_xx_partialCond),
      ct.condTem('passive3', bDef_x00_partialCond),
      ct.condTem('passive3', bDef_xx_partialCond),
      ct.condTem('passive3', bHp_x00_partialCond),
      ct.condTem('passive3', bHp_xx_partialCond),
      ct.fieldsTem('passive3', {
        fields: [
          { node: bAtk_Value, },
          { node: bDef_Value, },
          { node: bHp_Value, },
        ]
      }),
      ct.condTem('passive3', ascensionStat_partialCond),
    ]),
    constellation1: ct.talentTem('constellation1', [
      ct.condTem('constellation1', buffAtk_partialCond),
      ct.condTem('constellation1', buffDef_partialCond),
      ct.condTem('constellation1', buffHp_partialCond),
      ct.condTem('constellation1', buffEm_partialCond),
      ct.condTem('constellation1', buffEnerRech_partialCond),
      ct.condTem('constellation1', buffHeal_partialCond),
      ct.condTem('constellation1', buffCritRate_partialCond),
      ct.condTem('constellation1', buffCritDMG_partialCond),
      ct.condTem('constellation1', buffDmgMulti_partialCond),
      ct.condTem('constellation1', buffPhysical_dmg_partialCond),
      ct.condTem('constellation1', buffAnemo_dmg_partialCond),
      ct.condTem('constellation1', buffGeo_dmg_partialCond),
      ct.condTem('constellation1', buffElectro_dmg_partialCond),
      ct.condTem('constellation1', buffDendro_dmg_partialCond),
      ct.condTem('constellation1', buffHydro_dmg_partialCond),
      ct.condTem('constellation1', buffPyro_dmg_partialCond),
      ct.condTem('constellation1', buffCryo_dmg_partialCond),
      ct.condTem('constellation1', buffCommon_dmg_partialCond),
      ct.condTem('constellation1', buffNormal_dmg_partialCond),
      ct.condTem('constellation1', buffNormal_critRate_partialCond),
      ct.condTem('constellation1', buffNormal_critDMG_partialCond),
      ct.condTem('constellation1', buffCharged_dmg_partialCond),
      ct.condTem('constellation1', buffCharged_critRate_partialCond),
      ct.condTem('constellation1', buffCharged_critDMG_partialCond),
      ct.condTem('constellation1', buffPlunging_dmg_partialCond),
      ct.condTem('constellation1', buffPlunging_critRate_partialCond),
      ct.condTem('constellation1', buffPlunging_critDMG_partialCond),
      ct.condTem('constellation1', buffSkill_dmg_partialCond),
      ct.condTem('constellation1', buffSkill_critRate_partialCond),
      ct.condTem('constellation1', buffSkill_critDMG_partialCond),
      ct.condTem('constellation1', buffBurst_dmg_partialCond),
      ct.condTem('constellation1', buffBurst_critRate_partialCond),
      ct.condTem('constellation1', buffBurst_critDMG_partialCond),
      ct.condTem('constellation1', buffLunarBaseDmg_partialCond),
      ct.condTem('constellation1', buffLunarbloomBonus_partialCond),
      ct.condTem('constellation1', buffLunarbloom_critRate_partialCond),
      ct.condTem('constellation1', buffLunarbloom_critDMG_partialCond),
      ct.condTem('constellation1', buffLunarchargedBonus_partialCond),
      ct.condTem('constellation1', buffLunarcharged_critRate_partialCond),
      ct.condTem('constellation1', buffLunarcharged_critDMG_partialCond),
      ct.condTem('constellation1', buffLunarcrystallizeBonus_partialCond),
      ct.condTem('constellation1', buffLunarcrystallize_critRate_partialCond),
      ct.condTem('constellation1', buffLunarcrystallize_critDMG_partialCond),
      ct.fieldsTem('constellation1', {
        fields: [
          { node: buffAtk_Value, },
          { node: buffDef_Value, },
          { node: buffHp_Value, },
          { node: buffEm_Value, },
          { node: buffEnerRech_Value, },
          { node: buffHeal_Value, },
          { node: buffCritRate_Value, },
          { node: buffCritDMG_Value, },
          { node: buffDmgMulti_Value, },
          { node: buffPhysical_dmg_Value, },
          { node: buffAnemo_dmg_Value, },
          { node: buffGeo_dmg_Value, },
          { node: buffElectro_dmg_Value, },
          { node: buffDendro_dmg_Value, },
          { node: buffHydro_dmg_Value, },
          { node: buffPyro_dmg_Value, },
          { node: buffCryo_dmg_Value, },
          { node: buffCommon_dmg_Value, },
          { node: buffNormal_dmg_Value, },
          { node: buffNormal_critRate_Value, },
          { node: buffNormal_critDMG_Value, },
          { node: buffCharged_dmg_Value, },
          { node: buffCharged_critRate_Value, },
          { node: buffCharged_critDMG_Value, },
          { node: buffPlunging_dmg_Value, },
          { node: buffPlunging_critRate_Value, },
          { node: buffPlunging_critDMG_Value, },
          { node: buffSkill_dmg_Value, },
          { node: buffSkill_critRate_Value, },
          { node: buffSkill_critDMG_Value, },
          { node: buffBurst_dmg_Value, },
          { node: buffBurst_critRate_Value, },
          { node: buffBurst_critDMG_Value, },
          ...Object.values(buffLunarBaseDmg_obj).map((node) => ({ node })),
          { node: buffLunarbloomBonus_Value, },
          { node: buffLunarbloom_critRate_Value, },
          { node: buffLunarbloom_critDMG_Value, },
          { node: buffLunarchargedBonus_Value, },
          { node: buffLunarcharged_critRate_Value, },
          { node: buffLunarcharged_critDMG_Value, },
          { node: buffLunarcrystallizeBonus_Value, },
          { node: buffLunarcrystallize_critRate_Value, },
          { node: buffLunarcrystallize_critDMG_Value, },
        ]
      }),
    ]),
    constellation2: ct.talentTem('constellation2', [
      ct.condTem('constellation2', resPhysical_partialCond),
      ct.condTem('constellation2', resAnemo_partialCond),
      ct.condTem('constellation2', resGeo_partialCond),
      ct.condTem('constellation2', resElectro_partialCond),
      ct.condTem('constellation2', resDendro_partialCond),
      ct.condTem('constellation2', resHydro_partialCond),
      ct.condTem('constellation2', resPyro_partialCond),
      ct.condTem('constellation2', resCryo_partialCond),
      ct.fieldsTem('constellation2', {
        fields: [
          { node: resPhysical_Value, },
          { node: resAnemo_Value, },
          { node: resGeo_Value, },
          { node: resElectro_Value, },
          { node: resDendro_Value, },
          { node: resHydro_Value, },
          { node: resPyro_Value, },
          { node: resCryo_Value, },
        ]
      }),
      ct.condTem('constellation2', enemyDefRed_partialCond),
      ct.condTem('constellation2', enemyDefIgn_partialCond),
      ct.fieldsTem('constellation2', {
        fields: [
          { node: enemyDefRed_Value, },
          { node: enemyDefIgn_Value, },
        ]
      }),
    ]),
    constellation3: ct.talentTem('constellation3', [
      { fields: [{ node: burstC3 }] },
    ]),
    constellation4: ct.talentTem('constellation4', [
    ]),
    constellation5: ct.talentTem('constellation5', [
      { fields: [{ node: skillC5 }] },
    ]),
    constellation6: ct.talentTem('constellation6', [
    ]),
  }
  return new CharacterSheet(sheet, data)
}
