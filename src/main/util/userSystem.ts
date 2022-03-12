import { ITargetUser } from "../types/user";
import { IGetUsersResponse } from "../types/record";
import ModelSystem from "./modelSystem";

export type TInvalidEditKeyName =
  | "login"
  | "displayName"
  | "profileImg"
  | "offlineImg"
  | "lastStreamTime";

export default class UserSystem {
  public static defaultTargetUser: ITargetUser = {
    id: "",
    login: "",
    displayName: "",
    profileImg: "",
    offlineImg: "",
    status: {
      isOnline: false,
      isRecording: false,
    },
    recordSetting: {
      enableRecord: true,
      enableNotify: true,
      vodIsStopRecordStream: true,
      vodGetStreamIfNoVod: true,
      vodMode: "countDown",
      vodCountDownInMinutes: 60,
      vodTimeZone: [3, 0, 0],
      vodFileNameTemplate: "{channel}_TwitchVOD_{date}_{duration}",
      recordType: ["stream", "vod"],
      checkStreamContentTypeEnable: true,
      checkStreamContentTypeTargetGameNames: "Art;Just Chatting;",
      fileNameTemplate: "{channel}_TwitchLive_{date}",
    },
  };

  /** @returns {boolean} is add user successfully */
  public static addUser(users: IGetUsersResponse[]) {
    try {
      if (users.length === 0) return false;

      const targetUsers = ModelSystem.targetUsers;

      const newUsers = users.reduce((acc, user) => {
        if (targetUsers.targets[user.id] === undefined) {
          acc[user.id] = {
            ...UserSystem.defaultTargetUser,
            id: user.id,
            login: user.login,
            displayName: user.display_name,
            profileImg: user.profile_image_url,
            offlineImg: user.offline_image_url,
          };
        }

        return acc;
      }, {} as { [key: string]: ITargetUser });

      targetUsers.targets = Object.assign(targetUsers.targets, newUsers);

      ModelSystem.targetUsers = targetUsers;

      return true;
    } catch (error) {
      // TODO: error log
      console.error(error);

      return false;
    }
  }

  /** @returns {boolean} is edit user successfully */
  public static editUsers(users: ITargetUser[]) {
    try {
      if (users.length === 0) return false;

      const targetUsers = ModelSystem.targetUsers;

      for (let user of users) {
        if (user.id in targetUsers.targets) {
          targetUsers.targets[user.id] = {
            ...targetUsers.targets[user.id],
            ...user,
          };
        }
      }

      ModelSystem.targetUsers = targetUsers;

      return true;
    } catch (error) {
      // TODO: error log
      console.error(error);

      return false;
    }
  }
}
