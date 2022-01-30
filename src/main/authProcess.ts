import AppProcess from "./appProcess";
import AuthService from "./authService";
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
      width: 1000,
      height: 600,
      webPreferences: {
        nodeIntegration: false
      }
    })

    this.authWindow.loadURL(this.authService.authenticationURL())

    const { session: { webRequest } } = this.authWindow.webContents

    const filter: WebRequestFilter = { urls: [`${import.meta.env.VITE_REDIRECT_URL}*`] }

    webRequest.onBeforeRequest(filter, this.handleRequest.bind(this))

    this.authWindow.on('closed', () => this.authWindow = null)
  }

  private async handleRequest(param: { url: string }) {
    await this.authService.loadTokens(param.url)

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

      await this.authService.logout()
    })
  }
}