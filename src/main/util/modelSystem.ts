import path from 'path'
import { ITargetUsers } from '../types/user'
import AuthService from './authService'
import FilesSystem from './fileSystem'
import UserSystem from './userSystem'
import ConfigSystem from './configSystem'

export default class ModelSystem {
  private static modelPath() {
    return path.join(__dirname, '../model/', AuthService.userID)
  }

  public static get targetUsers() {
    return FilesSystem.getOrCreateFile(
      ModelSystem.modelPath(),
      UserSystem.fileName,
      UserSystem.defaultTargetUsers
    )
  }

  public static set targetUsers(users: ITargetUsers) {
    FilesSystem.saveFile(ModelSystem.modelPath(), UserSystem.fileName, users)
  }

  public static get configuration() {
    return FilesSystem.getOrCreateFile(
      ModelSystem.modelPath(),
      ConfigSystem.fileName,
      ConfigSystem.defaultConfig
    )
  }

  public static set configuration(config) {
    FilesSystem.saveFile(ModelSystem.modelPath(), ConfigSystem.fileName, config)
  }
}
