import {
  ipcMain,
  dialog,
  OpenDialogSyncOptions,
  SaveDialogSyncOptions,
} from 'electron'

export default class MainProcessDialog {
  public static listener() {
    ipcMain.handle('showOpenDialog', (event, args: OpenDialogSyncOptions) =>
      dialog.showOpenDialogSync(args)
    )

    ipcMain.handle('showSaveDialog', (event, args: SaveDialogSyncOptions) =>
      dialog.showSaveDialogSync(args)
    )
  }
}
