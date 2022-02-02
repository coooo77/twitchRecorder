import { ipcMain } from "electron";
import AppProcess from "./appProcess";
import AuthProcess from "./authProcess";
import AuthService from "./util/authService";

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
    this.logoutHandler()
  }

  /** 
   * this.authService.logout() delay and this.authProcess.createAuthWindow() fail to work 
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
}