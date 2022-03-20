import {
  IUserConfig,
  IRecordConfig,
  IProcessSetting,
  ICheckDiskSpaceAction,
} from '../types/configuration'
import { ipcMain } from 'electron'
import ModelSystem from './modelSystem'
import { IRecordSetting } from '../types/record'

export default class ConfigSystem {
  public static fileName = 'configuration'

  private static recordSettingPrototype: IRecordSetting = {
    enableRecord: true,
    enableNotify: true,
    vodIsStopRecordStream: true,
    vodGetStreamIfNoVod: true,
    vodMode: 'countDown',
    vodCountDownInMinutes: 60,
    vodTimeZone: [3, 0, 0],
    vodFileNameTemplate: '{channel}_TwitchVOD_{date}_{duration}',
    recordType: ['stream', 'vod'],
    checkStreamContentTypeEnable: true,
    checkStreamContentTypeTargetGameNames: 'Art;Just Chatting;',
    fileNameTemplate: '{channel}_TwitchLive_{date}',
  }

  private static checkDiskSpaceAction: ICheckDiskSpaceAction = {
    isActive: true,
    unit: 'GB',
    number: 25,
    digit: 2,
  }

  private static recordConfig: IRecordConfig = {
    checkStreamInterval: 1000 * 30,
    dirToSaveRecord: '',
    maxTryTimes: 5,
    numOfDownloadLimit: 10,
  }

  private static processSetting: IProcessSetting = {
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
  }

  public static defaultConfig: IUserConfig = {
    recordConfig: ConfigSystem.recordConfig,
    processSetting: ConfigSystem.processSetting,
    checkDiskSpaceAction: ConfigSystem.checkDiskSpaceAction,
    recordSettingPrototype: ConfigSystem.recordSettingPrototype,
  }

  public static listener() {
    ipcMain.handle('getUserConfig', () => ModelSystem.configuration)

    ipcMain.handle('editUserConfig', async (event, args: IUserConfig) => {
      ModelSystem.configuration = args
    })
  }
}
