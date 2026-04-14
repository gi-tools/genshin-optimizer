import type {
  CharacterKey,
  CharacterSheetKey,
  GenderKey,
  SimCharacterKey,
  TravelerKey,
} from '@genshin-optimizer/gi/consts'
import { allTravelerKeys } from '@genshin-optimizer/gi/consts'
import Aino from './Aino'
import Albedo from './Albedo'
import Alhaitham from './Alhaitham'
import Aloy from './Aloy'
import Alyosha from './Alyosha'
import Amber from './Amber'
import AratakiItto from './AratakiItto'
import Arlecchino from './Arlecchino'
import Baizhu from './Baizhu'
import Barbara from './Barbara'
import Beidou from './Beidou'
import Bennett from './Bennett'
import Candace from './Candace'
import type { CharacterSheet } from './CharacterSheet'
import Charlotte from './Charlotte'
import Chasca from './Chasca'
import Chevreuse from './Chevreuse'
import Chiori from './Chiori'
import Chongyun from './Chongyun'
import Citlali from './Citlali'
import Clorinde from './Clorinde'
import Collei from './Collei'
import Columbina from './Columbina'
import Cyno from './Cyno'
import Dahlia from './Dahlia'
import Dehya from './Dehya'
import Diluc from './Diluc'
import Diona from './Diona'
import Dori from './Dori'
import Durin from './Durin'
import Emilie from './Emilie'
import Escoffier from './Escoffier'
import Eula from './Eula'
import Faruzan from './Faruzan'
import Fischl from './Fischl'
import Flins from './Flins'
import Freminet from './Freminet'
import Furina from './Furina'
import Gaming from './Gaming'
import Ganyu from './Ganyu'
import Gorou from './Gorou'
import HuTao from './HuTao'
import Iansan from './Iansan'
import Ifa from './Ifa'
import Illuga from './Illuga'
import Ineffa from './Ineffa'
import Jahoda from './Jahoda'
import Jean from './Jean'
import Kachina from './Kachina'
import KaedeharaKazuha from './KaedeharaKazuha'
import Kaeya from './Kaeya'
import KamisatoAyaka from './KamisatoAyaka'
import KamisatoAyato from './KamisatoAyato'
import Kaveh from './Kaveh'
import Keqing from './Keqing'
import Kinich from './Kinich'
import Kirara from './Kirara'
import Klee from './Klee'
import KujouSara from './KujouSara'
import KukiShinobu from './KukiShinobu'
import LanYan from './LanYan'
import Lauma from './Lauma'
import Layla from './Layla'
import Linnea from './Linnea'
import Lisa from './Lisa'
import Lohen from './Lohen'
import Lynette from './Lynette'
import Lyney from './Lyney'
import Mavuika from './Mavuika'
import Mika from './Mika'
import Mona from './Mona'
import Mualani from './Mualani'
import Nahida from './Nahida'
import Navia from './Navia'
import Nefer from './Nefer'
import Neuvillette from './Neuvillette'
import Nicole from './Nicole'
import Nilou from './Nilou'
import Ningguang from './Ningguang'
import Noelle from './Noelle'
import Odette from './Odette'
import Ororon from './Ororon'
import Prune from './Prune'
import Qiqi from './Qiqi'
import RaidenShogun from './RaidenShogun'
import Razor from './Razor'
import Rosaria from './Rosaria'
import Sandrone from './Sandrone'
import SangonomiyaKokomi from './SangonomiyaKokomi'
import Sayu from './Sayu'
import Sethos from './Sethos'
import Shenhe from './Shenhe'
import ShikanoinHeizou from './ShikanoinHeizou'
import Sigewinne from './Sigewinne'
import Skirk from './Skirk'
import Somnia from './Somnia'
import { generateSim } from './_generateSim'
import Sucrose from './Sucrose'
import Tartaglia from './Tartaglia'
import Thoma from './Thoma'
import Tighnari from './Tighnari'
import TravelerAnemoF from './TravelerAnemoF'
import TravelerAnemoM from './TravelerAnemoM'
import TravelerCryoF from './TravelerCryoF'
import TravelerCryoM from './TravelerCryoM'
import TravelerDendroF from './TravelerDendroF'
import TravelerDendroM from './TravelerDendroM'
import TravelerElectroF from './TravelerElectroF'
import TravelerElectroM from './TravelerElectroM'
import TravelerGeoF from './TravelerGeoF'
import TravelerGeoM from './TravelerGeoM'
import TravelerHydroF from './TravelerHydroF'
import TravelerHydroM from './TravelerHydroM'
import TravelerPyroF from './TravelerPyroF'
import TravelerPyroM from './TravelerPyroM'
import Varesa from './Varesa'
import Varka from './Varka'
import Venti from './Venti'
import Wanderer from './Wanderer'
import Wriothesley from './Wriothesley'
import Xiangling from './Xiangling'
import Xianyun from './Xianyun'
import Xiao from './Xiao'
import Xilonen from './Xilonen'
import Xingqiu from './Xingqiu'
import Xinyan from './Xinyan'
import YaeMiko from './YaeMiko'
import Yanfei from './Yanfei'
import Yaoyao from './Yaoyao'
import Yelan from './Yelan'
import Yoimiya from './Yoimiya'
import YumemizukiMizuki from './YumemizukiMizuki'
import YunJin from './YunJin'
import Zhongli from './Zhongli'
import Zibai from './Zibai'

const simCharacters: Record<SimCharacterKey, CharacterSheet> = {
  Sim_AnemoSword: generateSim('Sim_AnemoSword'),
  Sim_GeoSword: generateSim('Sim_GeoSword'),
  Sim_ElectroSword: generateSim('Sim_ElectroSword'),
  Sim_HydroSword: generateSim('Sim_HydroSword'),
  Sim_PyroSword: generateSim('Sim_PyroSword'),
  Sim_CryoSword: generateSim('Sim_CryoSword'),
  Sim_DendroSword: generateSim('Sim_DendroSword'),
  Sim_AnemoClaymore: generateSim('Sim_AnemoClaymore'),
  Sim_GeoClaymore: generateSim('Sim_GeoClaymore'),
  Sim_ElectroClaymore: generateSim('Sim_ElectroClaymore'),
  Sim_HydroClaymore: generateSim('Sim_HydroClaymore'),
  Sim_PyroClaymore: generateSim('Sim_PyroClaymore'),
  Sim_CryoClaymore: generateSim('Sim_CryoClaymore'),
  Sim_DendroClaymore: generateSim('Sim_DendroClaymore'),
  Sim_AnemoPolearm: generateSim('Sim_AnemoPolearm'),
  Sim_GeoPolearm: generateSim('Sim_GeoPolearm'),
  Sim_ElectroPolearm: generateSim('Sim_ElectroPolearm'),
  Sim_HydroPolearm: generateSim('Sim_HydroPolearm'),
  Sim_PyroPolearm: generateSim('Sim_PyroPolearm'),
  Sim_CryoPolearm: generateSim('Sim_CryoPolearm'),
  Sim_DendroPolearm: generateSim('Sim_DendroPolearm'),
  Sim_AnemoBow: generateSim('Sim_AnemoBow'),
  Sim_GeoBow: generateSim('Sim_GeoBow'),
  Sim_ElectroBow: generateSim('Sim_ElectroBow'),
  Sim_HydroBow: generateSim('Sim_HydroBow'),
  Sim_PyroBow: generateSim('Sim_PyroBow'),
  Sim_CryoBow: generateSim('Sim_CryoBow'),
  Sim_DendroBow: generateSim('Sim_DendroBow'),
  Sim_AnemoCatalyst: generateSim('Sim_AnemoCatalyst'),
  Sim_GeoCatalyst: generateSim('Sim_GeoCatalyst'),
  Sim_ElectroCatalyst: generateSim('Sim_ElectroCatalyst'),
  Sim_HydroCatalyst: generateSim('Sim_HydroCatalyst'),
  Sim_PyroCatalyst: generateSim('Sim_PyroCatalyst'),
  Sim_CryoCatalyst: generateSim('Sim_CryoCatalyst'),
  Sim_DendroCatalyst: generateSim('Sim_DendroCatalyst'),
} as const

const characters: Record<CharacterSheetKey, CharacterSheet> = {
  ...simCharacters,
  Aino,
  Albedo,
  Alhaitham,
  Aloy,
  Alyosha,
  Amber,
  AratakiItto,
  Arlecchino,
  Baizhu,
  Barbara,
  Beidou,
  Bennett,
  Candace,
  Charlotte,
  Chasca,
  Chevreuse,
  Chiori,
  Chongyun,
  Citlali,
  Clorinde,
  Collei,
  Columbina,
  Cyno,
  Dahlia,
  Dehya,
  Diluc,
  Diona,
  Dori,
  Durin,
  Emilie,
  Escoffier,
  Eula,
  Faruzan,
  Fischl,
  Flins,
  Freminet,
  Furina,
  Gaming,
  Ganyu,
  Gorou,
  HuTao,
  Iansan,
  Ifa,
  Illuga,
  Ineffa,
  Jahoda,
  Jean,
  Kachina,
  KaedeharaKazuha,
  Kaeya,
  KamisatoAyaka,
  KamisatoAyato,
  Kaveh,
  Keqing,
  Kinich,
  Kirara,
  Klee,
  KujouSara,
  KukiShinobu,
  LanYan,
  Lauma,
  Layla,
  Linnea,
  Lisa,
  Lohen,
  Lynette,
  Lyney,
  Mavuika,
  Mika,
  Mona,
  Mualani,
  Nahida,
  Navia,
  Nefer,
  Neuvillette,
  Nicole,
  Nilou,
  Ningguang,
  Noelle,
  Odette,
  Ororon,
  Prune,
  Qiqi,
  RaidenShogun,
  Razor,
  Rosaria,
  Sandrone,
  SangonomiyaKokomi,
  Sayu,
  Sethos,
  Shenhe,
  ShikanoinHeizou,
  Sigewinne,
  Skirk,
  Somnia,
  Sucrose,
  Tartaglia,
  Thoma,
  Tighnari,
  TravelerAnemoF,
  TravelerAnemoM,
  TravelerCryoF,
  TravelerCryoM,
  TravelerGeoF,
  TravelerGeoM,
  TravelerElectroF,
  TravelerElectroM,
  TravelerDendroF,
  TravelerDendroM,
  TravelerHydroF,
  TravelerHydroM,
  TravelerPyroF,
  TravelerPyroM,
  Varesa,
  Varka,
  Venti,
  Wanderer,
  Wriothesley,
  Xiangling,
  Xianyun,
  Xiao,
  Xilonen,
  Xingqiu,
  Xinyan,
  YaeMiko,
  Yanfei,
  Yaoyao,
  Yelan,
  Yoimiya,
  YumemizukiMizuki,
  YunJin,
  Zhongli,
  Zibai,
} as const
export function getCharSheet(charKey: CharacterKey, gender: GenderKey) {
  return characters[charKeyToCharSheetKey(charKey, gender)]
}

function charKeyToCharSheetKey(
  charKey: CharacterKey,
  gender: GenderKey
): CharacterSheetKey {
  if (allTravelerKeys.includes(charKey as TravelerKey))
    return `${charKey}${gender}` as CharacterSheetKey
  else return charKey as CharacterSheetKey
}

export default characters
