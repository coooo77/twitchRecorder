import fs from 'fs'
import {
  IUserConfig,
  IRecordConfig,
  IProcessSetting,
  ICheckDiskSpaceAction,
  IDownloadVODSetting,
} from '../types/configuration'
import { ipcMain } from 'electron'
import ModelSystem from './modelSystem'
import { IRecordSetting } from '../types/record'

export default class ConfigSystem {
  public static fileName = 'configuration'

  public static recordSettingPrototype: IRecordSetting = {
    enableRecord: true,
    enableNotify: true,
    vodIsStopRecordStream: true,
    vodGetStreamIfNoVod: true,
    vodMode: 'countDown',
    vodCountDownInMinutes: 60,
    vodTimeZone: new Date(2022, 1, 10, 3, 0).toISOString(),
    vodFileNameTemplate: '{channel}_TwitchVOD_{date}_{duration}',
    recordType: ['stream', 'vod'],
    checkStreamContentTypeEnable: true,
    checkStreamContentTypeTargetGameNames: 'Art;Just Chatting;',
    fileNameTemplate: '{channel}_TwitchLive_{date}',
  }

  public static checkDiskSpaceAction: ICheckDiskSpaceAction = {
    isActive: true,
    unit: 'GB',
    number: 25,
    digit: 2,
  }

  public static recordConfig: IRecordConfig = {
    checkStreamInterval: 30,
    dirToSaveRecord: '',
    maxTryTimes: 5,
    numOfDownloadLimit: 10,
    program: 'streamLink',
  }

  public static processSetting: IProcessSetting = {
    dirToProcessing: '',
    dirToProcessed: '',
    suffixMute: 'mute',
    suffixConvert: 'convert',
    suffixCombine: 'combine',
    ffmpegPath: '',
    probePath: '',
    minutesToDelay: 30,
    outputType: 'mp4',
    processMethod: 'spawn',
    enable: true,
  }

  public static downloadVODSetting: IDownloadVODSetting = {
    reTryDownloadInterval: 10,
    maxReDownloadTimes: 10,
    LossOfVODDurationAllowed: 1,
    IntegrityCheck: true,
    IntegrityCheckUnit: 'second',
  }

  public static defaultConfig: IUserConfig = {
    recordConfig: ConfigSystem.recordConfig,
    processSetting: ConfigSystem.processSetting,
    downloadVODSetting: ConfigSystem.downloadVODSetting,
    checkDiskSpaceAction: ConfigSystem.checkDiskSpaceAction,
    recordSettingPrototype: ConfigSystem.recordSettingPrototype,
  }

  public static listener() {
    ipcMain.handle('getUserConfig', () => ModelSystem.configuration)

    ipcMain.handle('editUserConfig', (event, args: IUserConfig) => {
      try {
        ModelSystem.configuration = args

        return true
      } catch {
        return false
      }
    })

    ipcMain.handle('importConfig', (event, pathOfConfig: string) => {
      try {
        const rawData = fs.readFileSync(pathOfConfig).toString()

        ModelSystem.configuration = JSON.parse(rawData)

        return true
      } catch (error) {
        console.error(error)

        return false
      }
    })

    ipcMain.handle('exportConfig', (event, exportPath: string) => {
      try {
        fs.writeFileSync(exportPath, JSON.stringify(ModelSystem.configuration))

        return true
      } catch (error) {
        console.error(error)

        return false
      }
    })

    ipcMain.handle('setDefault', () => {
      try {
        ModelSystem.configuration = ConfigSystem.defaultConfig

        return true
      } catch (error) {
        console.error(error)

        return false
      }
    })

    // Import、Export、Default TODO: 資料驗證
  }
}
