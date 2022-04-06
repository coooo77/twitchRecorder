import Notify from './notify'

/** @see https://tinyurl.com/2p8c8xms */
export function includes<T, U extends T>(
  arr: readonly U[],
  elem: T
): elem is U {
  return arr.includes(elem as any)
}

export const labelWidth = '200px'

export async function getDirPath() {
  const res = (await window.ipcRenderer.invoke('showOpenDialog', {
    properties: ['openDirectory'],
  })) as string[] | undefined

  return res?.[0] || ''
}

export async function getImportJSONPath() {
  const importPath = (await window.ipcRenderer.invoke('showOpenDialog', {
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  })) as string[] | undefined

  return importPath?.[0] || ''
}

export async function getExportJSONPath(exportFileName: string, title: string) {
  const exportPath = (await window.ipcRenderer.invoke('showSaveDialog', {
    title,
    defaultPath: exportFileName,
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })) as string | undefined

  return exportPath || ''
}

/**
 * @param ipcName event name for ipc
 * @returns {boolean} is export successfully
 */
export async function importJSONFile(ipcName: string) {
  const importPath = await getImportJSONPath()

  if (!importPath) return

  const res = await window.ipcRenderer.invoke(ipcName, importPath)

  const message = res ? 'success' : 'fail'

  Notify.send(`Import ${message}`, res)

  return Boolean(res)
}

/**
 * @param ipcName event name for ipc
 * @param exportFileName name of file exported
 * @param title title of dialog
 * @returns {boolean} is export successfully
 */
export async function exportJSONFile(
  ipcName: string,
  exportFileName: string,
  title: string
) {
  const exportPath = await getExportJSONPath(exportFileName, title)

  if (!exportPath) return

  const res = await window.ipcRenderer.invoke(ipcName, exportPath)

  const message = res ? 'success' : 'fail'

  Notify.send(`Export ${message}`, res)

  return Boolean(res)
}
