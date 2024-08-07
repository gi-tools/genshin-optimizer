import type { PropTypeKey } from '../../mapping'
import { propTypeMap } from '../../mapping'
import { readDMJSON } from '../../util'

type AvatarPromoteExcelConfigData = {
  avatarPromoteId: number //2,
  promoteAudio: string //"",
  promoteLevel: number //1,
  scoinCost?: number //20000,
  costItems: Array<
    | {
        id: number //104161,
        count: number //1
      }
    | Record<string, never>
  >
  // [
  //   {
  //     "id": number//104161,
  //     "count": number//1
  //   },
  //   {},
  //   {
  //     "id": number//100055,
  //     "count": number//3
  //   },
  //   {
  //     "id": number//112008,
  //     "count": number//3
  //   }
  // ],
  unlockMaxLevel: number //40,
  addProps: Array<{
    propType: PropTypeKey // "FIGHT_PROP_BASE_HP",
    value: number //858.2550048828125
  }>
  // [
  //   {
  //     "PropType": PropTypeKey// "FIGHT_PROP_BASE_HP",
  //     "Value": number//858.2550048828125
  //   },
  //   {
  //     "PropType": PropTypeKey//"FIGHT_PROP_BASE_DEFENSE",
  //     "Value": number//52.32600021362305
  //   },
  //   {
  //     "PropType": PropTypeKey// "FIGHT_PROP_BASE_ATTACK",
  //     "Value": number//22.82823371887207
  //   },
  //   {
  //     "PropType": PropTypeKey// "FIGHT_PROP_CRITICAL_HURT"
  //     "Value": number
  //   }
  // ],
  requiredPlayerLevel: number // 15
}
const ascensionSrc = JSON.parse(
  readDMJSON('ExcelBinOutput/AvatarPromoteExcelConfigData.json')
) as AvatarPromoteExcelConfigData[]

export type AscensionRecord = {
  props: { [key: string]: number }
  scoinCost: number
  costItems: Array<
    | {
        id: number
        count: number
      }
    | Record<string, never>
  >
  promoteLevel: number
}[]
export type AscensionData = Record<number, AscensionRecord>

const ascensionData = {} as AscensionData
ascensionSrc.forEach((asc) => {
  const {
    avatarPromoteId,
    promoteLevel = 0,
    addProps,
    scoinCost,
    costItems,
  } = asc
  if (!ascensionData[avatarPromoteId]) ascensionData[avatarPromoteId] = []
  ascensionData[avatarPromoteId][promoteLevel] = {
    props: Object.fromEntries(
      addProps.map(({ propType, value = 0 }) => [propTypeMap[propType], value])
    ),
    scoinCost: scoinCost ?? 0,
    costItems,
    promoteLevel,
  }
})

export { ascensionData }
