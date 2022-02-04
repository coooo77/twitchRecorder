import { ITargetUser } from "../types/user";
import { IGetUsersResponse } from "../types/record";
import ModelSystem from "./modelSystem";

export default class UserSystem {
  public static defaultTargetUser: ITargetUser = {
    id: '',
    login: '',
    displayName: '',
    profileImg: '',
    offlineImg: '',
    status: {
      isOnline: false,
      isRecording: false
    },
    recordSetting: {
      enableRecord: true,
      vod: {
        mode: 'countDown',
        timeZone: '03:00:00',
        getStreamIfNoVod: true,
        isStopRecordStream: true,
        countDownInMinutes: 60
      },
      recordType: ['stream', 'vod'],
      checkStreamContentType: {
        enable: true,
        targetGameNames: ['Art', 'Just Chatting']
      },
      fileNameTemplate: '{channel}_TwitchLive_{date}_{duration}'
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
            ...UserSystem.defaultTargetUser,
            id: user.id,
            login: user.login,
            displayName: user.display_name,
            profileImg: user.profile_image_url,
            offlineImg: user.offline_image_url
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
}