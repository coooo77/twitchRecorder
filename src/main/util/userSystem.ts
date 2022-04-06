import { ipcMain } from 'electron'
import ModelSystem from './modelSystem'
import { IGetUsersResponse } from '../types/record'
import { ITargetUser, ITargetUsers } from '../types/user'

export type TInvalidEditKeyName =
  | 'login'
  | 'displayName'
  | 'profileImg'
  | 'offlineImg'
  | 'lastStreamTime'

type UserID = string

export default class UserSystem {
  public static fileName = 'targetUsers'

  public static defaultTargetUsers: ITargetUsers = {
    _comment: 'record setting for streamers',
    targets: {},
  }

  public static defaultTargetUser(): ITargetUser {
    const { recordSettingPrototype, videoProcessSettingPrototype } =
      ModelSystem.configuration

    return {
      id: '',
      login: '',
      displayName: '',
      profileImg: '',
      offlineImg: '',
      status: {
        isOnline: false,
        isRecording: false,
      },
      recordSetting: recordSettingPrototype,
      videoProcessSetting: videoProcessSettingPrototype,
    }
  }

  /** @returns {boolean} is add user successfully */
  public static addUser(users: IGetUsersResponse[]) {
    try {
      if (users.length === 0) return false

      const targetUsers = ModelSystem.targetUsers

      const newUsers = users.reduce((acc, user) => {
        if (targetUsers.targets[user.id] === undefined) {
          acc[user.id] = {
            ...UserSystem.defaultTargetUser(),
            id: user.id,
            login: user.login,
            displayName: user.display_name,
            profileImg: user.profile_image_url,
            offlineImg: user.offline_image_url,
          }
        }

        return acc
      }, {} as { [key: string]: ITargetUser })

      targetUsers.targets = Object.assign(targetUsers.targets, newUsers)

      ModelSystem.targetUsers = targetUsers

      return true
    } catch (error) {
      // TODO: error log
      console.error(error)

      return false
    }
  }

  /** @returns {boolean} is edit user successfully */
  public static editUsers(users: ITargetUser[]) {
    try {
      if (users.length === 0) return false

      const targetUsers = ModelSystem.targetUsers

      for (let user of users) {
        if (user.id in targetUsers.targets) {
          targetUsers.targets[user.id] = {
            ...targetUsers.targets[user.id],
            ...user,
          }
        }
      }

      ModelSystem.targetUsers = targetUsers

      return true
    } catch (error) {
      // TODO: error log
      console.error(error)

      return false
    }
  }

  /** @returns {boolean} is delete user successfully */
  public static deleteUsers(usersID: string[]) {
    try {
      if (usersID.length === 0) return false

      const targetUsers = ModelSystem.targetUsers

      for (let userID of usersID) {
        if (targetUsers.targets[userID]) delete targetUsers.targets[userID]
      }

      ModelSystem.targetUsers = targetUsers

      return true
    } catch (error) {
      // TODO: error log
      console.error(error)

      return false
    }
  }

  public static listener() {
    ipcMain.handle(
      'addTargetUsers',
      (event, args: { data: IGetUsersResponse[] }) =>
        UserSystem.addUser(args.data)
    )

    ipcMain.handle('getTargetUsers', () => ModelSystem.targetUsers)

    ipcMain.handle(
      'editTargetUsers',
      async (event, args: ITargetUser[]) => await UserSystem.editUsers(args)
    )

    ipcMain.handle(
      'deleteTargetUsers',
      async (event, args: UserID[]) => await UserSystem.deleteUsers(args)
    )
  }
}
