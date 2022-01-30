import os from 'os'
import path from 'path'
import { app, BrowserWindow } from 'electron'

export default class AppProcess {
  appWindow: BrowserWindow | null = null

  private preHandle() {
    const isWin7 = os.release().startsWith('6.1')

    if (isWin7) app.disableHardwareAcceleration()

    if (!app.requestSingleInstanceLock()) {
      app.quit()

      process.exit(0)
    }
  }

  private async createAppWindow() {
    this.appWindow = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.cjs'),
      }
    })

    if (app.isPackaged) {
      this.appWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    } else {
      const pkg = await import('../../package.json')

      const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`

      this.appWindow.loadURL(url)

      this.appWindow.webContents.openDevTools()
    }
  }

  public async initiation() {
    this.preHandle()

    app.whenReady().then(this.createAppWindow.bind(this))

    app.on('window-all-closed', () => {
      this.appWindow = null

      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('second-instance', () => {
      if (this.appWindow) {
        // someone tried to run a second instance, we should focus our window.
        if (this.appWindow.isMinimized()) this.appWindow.restore()
        this.appWindow.focus()
      }
    })

    app.on('activate', () => {
      const allWindows = BrowserWindow.getAllWindows()

      if (allWindows.length) {
        allWindows[0].focus()
      } else {
        this.createAppWindow()
      }
    })

    // @TODO
    // auto update
    /* if (app.isPackaged) {
      app.whenReady()
        .then(() => import('electron-updater'))
        .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
        .catch((e) =>
          // maybe you need to record some log files.
          console.error('Failed check update:', e)
        )
    } */
  }
}