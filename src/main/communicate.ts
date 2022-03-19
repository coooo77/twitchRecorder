import { ipcMain } from 'electron'
import AppProcess from './appProcess'
import AuthProcess from './authProcess'
import { ITargetUser } from './types/user'
import AuthService from './util/authService'
import ModelSystem from './util/modelSystem'
import { IGetUsersResponse } from './types/record'
import UserSystem from './util/userSystem'

type UserID = string

export default class Communicate {
  appProcess: AppProcess

  authProcess: AuthProcess

  authService: AuthService

  constructor(
    authService: AuthService,
    appProcess: AppProcess,
    authProcess: AuthProcess
  ) {
    this.appProcess = appProcess

    this.authProcess = authProcess

    this.authService = authService
  }

  public listenerInitiation() {
    this.refreshTokens()

    this.logoutHandler()

    this.getAccessToken()

    this.getTargetUsers()

    this.addTargetUsers()

    this.editTargetUsers()

    this.deleteTargetUsers()
  }

  /**
   * logout() delay and createAuthWindow() fail to work
   *
   * logout must be after createAuthWindow
   * */
  private logoutHandler() {
    ipcMain.on('logout', async (event, args) => {
      this.appProcess.destroyAppWin()

      this.authProcess.createAuthWindow()

      await AuthService.logout()
    })
  }

  private refreshTokens() {
    ipcMain.handle(
      'refreshTokens',
      async () => await AuthService.refreshTokens()
    )
  }

  private getAccessToken() {
    ipcMain.handle('getAccessToken', () => AuthService.accessToken)
  }

  private getTargetUsers() {
    ipcMain.handle('getTargetUsers', () => ModelSystem.targetUsers)
  }

  private addTargetUsers() {
    ipcMain.handle(
      'addTargetUsers',
      (event, args: { data: IGetUsersResponse[] }) =>
        UserSystem.addUser(args.data)
    )
  }

  private editTargetUsers() {
    ipcMain.handle(
      'editTargetUsers',
      async (event, args: ITargetUser[]) => await UserSystem.editUsers(args)
    )
  }

  private deleteTargetUsers() {
    ipcMain.handle(
      'deleteTargetUsers',
      async (event, args: UserID[]) => await UserSystem.deleteUsers(args)
    )
  }
}
