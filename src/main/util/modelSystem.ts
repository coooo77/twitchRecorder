import path from 'path'
import { ITargetUser, ITargetUsers } from '../types/user'
import FilesSystem from "./fileSystem"

export default class ModelSystem {
  private static modelPath = path.join(__dirname, '../model')

  public static defaultTargetUsers: ITargetUsers = {
    _comment: "record setting for streamers",
    targets: {}
  }

  public static get targetUsers() {
    return FilesSystem.getOrCreateFile(ModelSystem.modelPath, 'targetUsers', ModelSystem.defaultTargetUsers)
  }

  public static set targetUsers(users: ITargetUsers) {
    FilesSystem.saveFile(ModelSystem.modelPath, 'targetUsers', users)
  }
}