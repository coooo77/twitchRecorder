import path from 'path'
import { ITargetUsers } from '../types/user'
import AuthService from './authService'
import FilesSystem from "./fileSystem"

export default class ModelSystem {
  private static targetUsersName = 'targetUsers'

  private static modelPath() {
    return path.join(__dirname, '../model/', AuthService.userID)
  }

  public static defaultTargetUsers: ITargetUsers = {
    _comment: "record setting for streamers",
    targets: {}
  }

  public static get targetUsers() {
    return FilesSystem.getOrCreateFile(
      ModelSystem.modelPath(), ModelSystem.targetUsersName, ModelSystem.defaultTargetUsers
    )
  }

  public static set targetUsers(users: ITargetUsers) {
    FilesSystem.saveFile(ModelSystem.modelPath(), ModelSystem.targetUsersName, users)
  }
}