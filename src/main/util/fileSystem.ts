import fs from 'fs'
import path from 'path'

export default class FileSystem {
  public static errorLogPath = path.join(__dirname, '../log')

  public static makeDirIfNotExist(fileLocation: string) {
    const dirNames = fileLocation.split(path.sep)

    let dirPath = ''

    for (let dirName of dirNames) {
      dirPath += dirName + path.sep

      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)
    }
  }

  public static isDirExist(fileLocation: string) {
    return fs.existsSync(fileLocation)
  }

  private static errorHandler(error: any) {
    const log = JSON.parse(JSON.stringify(error))

    log.date = new Date().toLocaleString()

    log.message = error.message || 'no error message'

    FileSystem.saveFile(FileSystem.errorLogPath, `${new Date().getTime()}`, log)
  }

  /**
  * @param fileLocation path of file ex: './model'
  * @param fileName name of file ex: 'user'
  * @param data 
  */
  public static saveFile(fileLocation: string, fileName: string, data: any) {
    try {
      FileSystem.makeDirIfNotExist(fileLocation)

      fs.writeFileSync(`${fileLocation}/${fileName}.json`, JSON.stringify(data), 'utf8')
    } catch (error) {
      FileSystem.errorHandler(error)
    }
  }

  public static getFile(fileLocation: string, fileName: string) {
    try {
      const result = fs.readFileSync(`${fileLocation}\\${fileName}.json`, 'utf8')

      return JSON.parse(result)
    } catch (error) {
      FileSystem.errorHandler(error)
    }
  }

  public static getOrCreateFile<T>(fileLocation: string, fileName: string, defaultData: T):T {
    if (fs.existsSync(`${fileLocation}/${fileName}.json`)) {
      return FileSystem.getFile(fileLocation, fileName)
    }

    FileSystem.saveFile(fileLocation, fileName, defaultData)

    return defaultData
  }
}