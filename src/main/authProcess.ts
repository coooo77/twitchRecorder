import AppProcess from "./appProcess";
import AuthService from "./util/authService";
import { BrowserWindow, WebRequestFilter } from 'electron'

export default class AuthProcess {
  appProcess: AppProcess

  authService: AuthService

  authWindow: null | BrowserWindow = null

  constructor(authService: AuthService, appProcess: AppProcess) {
    this.authService = authService

    this.appProcess = appProcess
  }

  public createAuthWindow() {
    this.destroyAuthWin()

    this.authWindow = new BrowserWindow({
      width: 1440,
      height: 900,
      webPreferences: {
        nodeIntegration: false
      }
    })

    this.authWindow.loadURL(AuthService.authenticationURL())

    const { session: { webRequest } } = this.authWindow.webContents

    const filter: WebRequestFilter = { urls: [`${import.meta.env.VITE_REDIRECT_URL}*`] }

    webRequest.onBeforeRequest(filter, this.handleRequest.bind(this))

    this.authWindow.once('closed', () => this.authWindow = null)
  }

  private async handleRequest(param: { url: string }) {
    await AuthService.loadTokens(param.url)

    await AuthService.getUserInfo()

    this.appProcess.initiation()

    return this.destroyAuthWin()
  }

  private destroyAuthWin() {
    if (!this.authWindow) return

    this.authWindow.close()

    this.authWindow = null
  }

  public createLogoutWindow() {
    const logoutWindow = new BrowserWindow({
      show: false
    })

    logoutWindow.on('ready-to-show', async () => {
      logoutWindow.close()

      await AuthService.logout()
    })
  }
}