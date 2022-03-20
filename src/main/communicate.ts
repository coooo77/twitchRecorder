import { ipcMain } from 'electron'
import AppProcess from './appProcess'
import AuthProcess from './authProcess'
import UserSystem from './util/userSystem'
import AuthService from './util/authService'
import ConfigSystem from './util/configSystem'

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

    UserSystem.listener()

    ConfigSystem.listener()
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
}
