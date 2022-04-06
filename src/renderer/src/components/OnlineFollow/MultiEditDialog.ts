import { IRecordSetting } from '../../../../main/types/record'
import { IVideoProcessSetting } from '../../../../main/types/configuration'

export type SettingToUpdate = Partial<
  Omit<IRecordSetting, 'offlineTimesToCheck'>
>

export type VideoProcessSettingToUpDate = Partial<IVideoProcessSetting>
