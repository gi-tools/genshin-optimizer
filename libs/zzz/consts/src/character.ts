// copy from libs\zzz\dm\src\dm\character\characterKeys.json with sussy chars removed
export const allCharacterKeys = [
  'Alice',
  'Anby',
  'Anton',
  'AstraYao',
  'Ben',
  'Billy',
  'Burnice',
  'Caesar',
  'Corin',
  'Ellen',
  'Evelyn',
  'Grace',
  'Harumasa',
  'Hugo',
  'Jane',
  'JuFufu',
  'Koleda',
  'Lighter',
  'Lucy',
  'Lycaon',
  'Miyabi',
  'Nekomata',
  'Nicole',
  'PanYinhu',
  'Piper',
  'Pulchra',
  'Qingyi',
  'Rina',
  'Seth',
  'Soldier0Anby',
  'Soldier11',
  'Soukaku',
  'Trigger',
  'Vivian',
  'Yanagi',
  'Yixuan',
  'Yuzuha',
  'ZhuYuan',
] as const
export type CharacterKey = (typeof allCharacterKeys)[number]

export const allLocationKeys = [...allCharacterKeys, ''] as const
export type LocationKey = (typeof allLocationKeys)[number]

export const allSpecialityKeys = [
  'attack',
  'stun',
  'anomaly',
  'support',
  'defense',
  'rupture',
] as const
export type SpecialityKey = (typeof allSpecialityKeys)[number]

export const allFactionKeys = [
  'RandomPlay',
  'CunningHares',
  'BelebogHeavyIndustries',
  'VictoriaHousekeepingCo',
  'NewEriduDefenseForce',
  'CriminalInvestigationSpecialResponseTeam',
  'SonsOfCalydon',
  'HollowSpecialOoperationsSection6',
  'StarsOfLyra',
  'Mockingbird',
  'YunkuiSummit',
  'SpookShack',
] as const
export type FactionKey = (typeof allFactionKeys)[number]

export const allAttackTypeKeys = ['slash', 'strike', 'pierce'] as const
export type AttackTypeKey = (typeof allAttackTypeKeys)[number]

export const allCharacterRarityKeys = ['S', 'A'] as const
export type CharacterRarityKey = (typeof allCharacterRarityKeys)[number]

export const coreLevel = [15, 25, 35, 45, 55, 60] as const

export const allCoreKeys = ['A', 'B', 'C', 'D', 'E', 'F'] as const
export type CoreKey = (typeof allCoreKeys)[number]

export const allCoreKeysWithNone = [
  'None',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
] as const

export const allSkillKeys = [
  'basic',
  'dodge',
  'assist',
  'special',
  'chain',
] as const
export type SkillKey = (typeof allSkillKeys)[number]
export function isSkillKey(tKey: string): tKey is SkillKey {
  return allSkillKeys.includes(tKey as SkillKey)
}
