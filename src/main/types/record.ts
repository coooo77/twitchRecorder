export interface ICheckTypeOption {
  isActive: boolean
  targetType: string[]
}

export type recordType =
  | 'vod'
  | 'stream'

export type recordMode =
  | 'queue'
  | 'manual'
  | 'offLine'
  | 'timeZone'
  | 'countDown'

export interface IRecordVodOption {
  // disable record stream while vod is available
  isStopRecordStream: boolean
  // enable record stream while vod is not available
  getStreamIfNoVod: boolean
  mode: recordMode
  countDownInMinutes: number
  timeZone: string
}

export interface ICheckStreamContentType {
  enable: boolean
  targetGameNames: string[]
}

export interface IUserStatus {
  isOnline: boolean
  isRecording: boolean
  streamStartedAt?: string
}

export interface IRecordSetting {
  enableRecord: boolean
  vod: IRecordVodOption
  recordType: recordType[]
  offlineTimesToCheck?: number
  checkStreamContentType: ICheckStreamContentType
  fileNameTemplate: string
}

export interface IGetUsersResponse {
  id: string
  login: string
  display_name: string
  profile_image_url: string
  offline_image_url: string
}
