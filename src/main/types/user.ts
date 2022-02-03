import { IRecordSetting, IUserStatus } from "./record";

export interface ITargetUser {
  id: string
  login: string
  displayName: string
  profileImg: string
  offlineImg: string
  status: IUserStatus
  recordSetting: IRecordSetting
}

export interface ITargetUsers {
  _comment?: string
  targets: { [key: string]: ITargetUser }
}