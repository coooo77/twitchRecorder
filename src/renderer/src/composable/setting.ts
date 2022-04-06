import {
  IUserConfig,
  screenshotTimestampTypes,
} from '../../../main/types/configuration'
import Notify from '../util/notify'
import { handleConfig } from './configuration'
import { importJSONFile, exportJSONFile } from '../util/common'

export function handleSetting() {
  const { getConfiguration, editConfiguration } = handleConfig()

  const isFormChanged = ref(false)

  const form = ref<IUserConfig>()

  const screenshotTimestampValue = ref('')

  const screenshotTimestampTypesSelected = ref(
    screenshotTimestampTypes[0].value
  )

  const checkDiskSpaceInfo = computed(() => {
    if (!form.value) return 'No limit'

    const { unit, number, isActive } = form.value.checkDiskSpaceAction

    if (number === 0 || !isActive) return 'No limit'

    return `Stop record when disk space is lower than ${number} ${unit}`
  })

  const checkVODIntegrityInfo = computed(() => {
    if (!form.value) return 'No limit'

    const { LossOfVODDurationAllowed, IntegrityCheck, IntegrityCheckUnit } =
      form.value.downloadVODSetting

    if (!IntegrityCheck || LossOfVODDurationAllowed === 0) return 'No limit'

    return `Download VOD again when loss ${LossOfVODDurationAllowed} ${IntegrityCheckUnit} of duration`
  })

  const screenshotTimestampValues = (data: (string | number)[]) =>
    data.map((i) => ({
      value: i,
      displayName: typeof i === 'number' ? i + 's' : i,
    }))

  watch(
    form,
    (newVal, oldVal) => {
      if (oldVal === undefined) return

      isFormChanged.value = true
    },
    { deep: true }
  )

  const fetchConfig = async () => {
    const config = await getConfiguration()

    if (config) form.value = config
  }

  const getDirPath = async () => {
    const res = (await window.ipcRenderer.invoke('showOpenDialog', {
      properties: ['openDirectory'],
    })) as string[] | undefined

    return res?.[0] || ''
  }

  const getFilePath = async () => {
    const res = (await window.ipcRenderer.invoke('showOpenDialog', {
      filters: [
        { name: 'Exe Files', extensions: ['exe'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      properties: ['openFile'],
    })) as string[] | undefined

    return res?.[0] || ''
  }

  const saveConfig = async () => {
    if (!form.value) return

    const res = await editConfiguration(JSON.parse(JSON.stringify(form.value)))

    if (res) isFormChanged.value = false
  }

  const importConfig = async () => {
    const res = await importJSONFile('importConfig')

    if (res) await fetchConfig()
  }

  const exportConfig = async () => {
    if (!form.value) return

    await exportJSONFile('exportConfig', 'config', 'Export Config')
  }

  // TODO: Dialog確認
  const setDefault = async () => {
    const res = await window.ipcRenderer.invoke('setDefault')

    const message = res ? 'Default config is set' : 'Fail to set Config'

    Notify.send(message, res)

    if (res) await fetchConfig()
  }

  const getScreenshotTimestamp = () => {
    let exportValue: undefined | string | number

    const inputValue = screenshotTimestampValue.value

    const ValidateDecimalNumbers = /^(\d+\.?\d{0,9}|\.\d{1,9})$/

    const isValidateDecimalNumbers = ValidateDecimalNumbers.test(inputValue)

    screenshotTimestampValue.value = ''

    if (!inputValue.trim() || inputValue === '0') return exportValue

    switch (screenshotTimestampTypesSelected.value) {
      case 'second':
        if (!Number.isNaN(+inputValue) && isValidateDecimalNumbers)
          exportValue = +inputValue

        break
      case 'percentage':
        if (+inputValue <= 100 && isValidateDecimalNumbers)
          exportValue = inputValue + '%'

        break
      case 'timestamp':
        // @see https://tinyurl.com/2p8bdmsk
        const isTimestampType =
          /(?:([0-5]?[0-9]):)?([0-5]?[0-9]):([0-5][0-9])\.?\d{0,9}|\.\d{1,9}/

        if (isTimestampType.test(inputValue)) exportValue = inputValue

        break
      default:
        break
    }

    return exportValue
  }

  onMounted(fetchConfig)

  return {
    form,
    isFormChanged,
    checkDiskSpaceInfo,
    checkVODIntegrityInfo,
    screenshotTimestampValue,
    screenshotTimestampValues,
    screenshotTimestampTypesSelected,
    getDirPath,
    getFilePath,
    setDefault,
    saveConfig,
    importConfig,
    exportConfig,
    getScreenshotTimestamp,
  }
}
