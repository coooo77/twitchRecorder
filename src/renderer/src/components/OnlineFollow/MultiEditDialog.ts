import { IRecordSetting } from '../../../../main/types/record'

export type SettingToUpdate = Partial<
  Omit<IRecordSetting, 'offlineTimesToCheck'>
>
