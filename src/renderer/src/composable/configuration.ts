import Notify from '../util/notify'
import { IUserConfig } from '../../../main/types/configuration'

export function handleConfig() {
  const { invoke } = window.ipcRenderer

  const configuration = ref<undefined | IUserConfig>()

  const getConfiguration = async () => {
    try {
      const config = (await invoke('getUserConfig')) as IUserConfig

      if (!config) return Notify.warn('Fail to fetch user config')

      configuration.value = config

      return config
    } catch (error) {
      console.error(error)

      Notify.warn('Error occurred when fetching user config')
    }
  }

  const editConfiguration = async (value: IUserConfig) => {
    const result = (await invoke('editUserConfig', value)) as boolean

    const message = result ? 'success' : 'fail'

    Notify.send(`Edit config ${message}`, result)

    return result
  }

  return {
    configuration,
    getConfiguration,
    editConfiguration,
  }
}
