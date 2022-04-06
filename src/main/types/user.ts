import { IVideoProcessSetting } from "./configuration";
import { IRecordSetting, IUserStatus } from "./record";

export interface ITargetUser {
  id: string
  login: string
  displayName: string
  profileImg: string
  offlineImg: string
  status: IUserStatus
  lastStreamTime?: string
  recordSetting: IRecordSetting
  videoProcessSetting: IVideoProcessSetting
}

export interface ITargetUsers {
  _comment?: string
  targets: { [key: string]: ITargetUser }
}