import { app } from 'electron'
import AppProcess from './appProcess'
import AuthProcess from './authProcess'
import AuthService from './authService'

const appProcess = new AppProcess()

const authService = new AuthService()

const authProcess = new AuthProcess(authService, appProcess)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  try {
    await authService.refreshTokens()

    appProcess.initiation()
  } catch (error) {
    authProcess.createAuthWindow()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
})
