import { IRecordSetting } from './record'

export interface ICheckDiskSpaceAction {
  isActive: boolean
  /** check type. e.g. 200MB, 10GB etc */
  unit: 'MB' | 'GB' | 'TB' | 'percentage'
  /** when spaceLeft is lower than this value, record stops */
  number: number
  /** digit to display on UI */
  digit: number
}

export const checkDiskUnits = ['MB', 'GB', 'TB', 'percentage'] as const

export interface IRecordConfig {
  /** interval for online check (unit: seconds) */
  checkStreamInterval: number
  /** directory path where files save */
  dirToSaveRecord: string
  /** times of offline to Check, if times of offline check is over this value, set user offline */
  maxTryTimes: number
  /** numbers of recorder allow to run, set 0 as unlimited */
  numOfDownloadLimit: number
  /** program to record */
  program: 'streamLink' | 'ffmpeg'
}

export interface IProcessSetting {
  /** directory path where files are converting */
  dirToProcessing: string
  /** directory path where files converted save */
  dirToProcessed: string
  /** suffix for name of muted videos */
  suffixMute: 'mute'
  /** suffix for name of converted videos */
  suffixConvert: 'convert'
  /** suffix for name of combined videos */
  suffixCombine: 'combine'
  /** path of ffmpeg */
  ffmpegPath: string
  /** path of probe */
  probePath: string
  /** minutes to delay processing next video */
  minutesToDelay: number
  /** output file type for process. default: mp4 */
  outputType: string
  /** use bat file or child_process.spawn to handle videos */
  processMethod: 'bat' | 'spawn' | 'spawnPop'
  /** Allow to process videos */
  enable: boolean
}

export interface SelectorOption {
  value: string
  label: string
  disabled?: boolean
}

export const processMethods: SelectorOption[] = [
  {
    value: 'bat',
    label: 'bat',
    disabled: true,
  },
  {
    value: 'spawn',
    label: 'spawn',
  },
  {
    value: 'spawnPop',
    label: 'spawnPop',
    disabled: true,
  },
]

export const programsToRecord: SelectorOption[] = [
  {
    value: 'streamLink',
    label: 'streamLink',
  },
  {
    value: 'ffmpeg',
    label: 'ffmpeg',
    disabled: true,
  },
]

export interface IDownloadVODSetting {
  /** minutes to download VOD again when VOD download is failed  */
  reTryDownloadInterval: number
  /** maximum to download VOD */
  maxReDownloadTimes: number
  /** acceptable amount of loss duration  */
  LossOfVODDurationAllowed: number
  /** check duration while VOD downloaded */
  IntegrityCheck: boolean
  /** unit to check VOD duration */
  IntegrityCheckUnit: 'second' | 'minute' | 'hour' | 'percentage'
}

export const integrityCheckUnits = [
  'second',
  'minute',
  'hour',
  'percentage',
] as const

export interface IUserConfig {
  /** prototype for streamer */
  recordSettingPrototype: IRecordSetting
  /** warning or stop record when volume is insufficient */
  checkDiskSpaceAction: ICheckDiskSpaceAction
  /** define record behavior */
  recordConfig: IRecordConfig
  /** define how to convert videos */
  processSetting: IProcessSetting
  /** define how to handle VOD */
  downloadVODSetting: IDownloadVODSetting
}
