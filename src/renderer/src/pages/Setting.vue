<template>
  <div class="setting space-y-2">
    <div class="controller space-x-2">
      <el-button @click="saveConfig" :disabled="!isFormChanged" type="info">
        Save
      </el-button>

      <el-button @click="importConfig" type="primary">Import</el-button>

      <el-button @click="exportConfig" type="primary">Export</el-button>

      <el-button @click="setDefault" type="danger">Default</el-button>
    </div>

    <el-form v-if="form" :model="form" :label-width="labelWidth">
      <el-collapse v-model="activeNames" accordion>
        <!-- recordSettingPrototype -->
        <el-collapse-item title="Record Setting Prototype" name="1">
          <el-divider><strong> General Setting </strong></el-divider>
          <el-form-item label="Enable Record">
            <el-switch v-model="form.recordSettingPrototype.enableRecord" />
          </el-form-item>

          <el-form-item label="Enable Notify">
            <el-switch v-model="form.recordSettingPrototype.enableNotify" />
          </el-form-item>

          <el-form-item label="stream File Name">
            <el-input
              v-model="form.recordSettingPrototype.fileNameTemplate"
              placeholder="Define your file name here"
            />
          </el-form-item>

          <el-form-item label="Record Type">
            <el-checkbox-group
              size="small"
              v-model="form.recordSettingPrototype.recordType"
            >
              <el-checkbox-button
                v-for="item in recordTypeList"
                :key="item"
                :label="item"
              >
                {{ item }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>

          <el-divider><strong> VOD Setting </strong></el-divider>

          <el-form-item label="Is Stop Record Stream">
            <el-switch
              v-model="form.recordSettingPrototype.vodIsStopRecordStream"
            />
          </el-form-item>

          <el-form-item label="Get Stream If No Vod">
            <el-switch
              v-model="form.recordSettingPrototype.vodGetStreamIfNoVod"
            />
          </el-form-item>

          <el-form-item label="VOD mode">
            <el-select
              v-model="form.recordSettingPrototype.vodMode"
              placeholder="Select VOD mode"
            >
              <el-option
                v-for="item in recordModeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="VOD countdown">
            <el-input-number
              v-model="form.recordSettingPrototype.vodCountDownInMinutes"
              :min="1"
              :max="1440"
              size="small"
              class="mr-2"
              controls-position="right"
            />
            minutes
          </el-form-item>

          <el-form-item label="VOD time zone">
            <el-time-picker
              v-model="form.recordSettingPrototype.vodTimeZone"
              placeholder="time zone"
              :clearable="false"
            />
          </el-form-item>

          <el-form-item label="VOD File Name">
            <el-input
              v-model="form.recordSettingPrototype.vodFileNameTemplate"
              placeholder="Define your file name here"
            />
          </el-form-item>

          <el-divider><strong> Check Stream Content </strong></el-divider>

          <el-form-item label="Enable Check Stream Content Type">
            <el-switch
              v-model="form.recordSettingPrototype.checkStreamContentTypeEnable"
            />
          </el-form-item>

          <el-form-item label="check Stream Content Type Target Game Names">
            <el-input
              v-model="
                form.recordSettingPrototype
                  .checkStreamContentTypeTargetGameNames
              "
              type="textarea"
              placeholder="Use semicolon to add game type"
            />
          </el-form-item>
        </el-collapse-item>

        <!-- checkDiskSpaceAction -->
        <el-collapse-item title="Check Disk Space Action" name="2">
          <div class="result m-5">
            <el-card class="grid place-items-center">
              {{ checkDiskSpaceInfo }}
            </el-card>
          </div>

          <el-form-item label="Enable Check Disk Space">
            <el-switch v-model="form.checkDiskSpaceAction.isActive" />
          </el-form-item>

          <div v-show="form.checkDiskSpaceAction.isActive" class="options">
            <el-form-item label="Check Disk Space Unit">
              <el-select
                v-model="form.checkDiskSpaceAction.unit"
                placeholder="Unit to check disk space"
              >
                <el-option
                  v-for="item in checkDiskUnits"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="number to check disk space">
              <el-input-number
                v-model="form.checkDiskSpaceAction.number"
                :min="0"
                :precision="2"
                :step="0.01"
              />
            </el-form-item>

            <el-form-item label="digit to check disk space">
              <el-input-number
                v-model="form.checkDiskSpaceAction.digit"
                :min="0"
                :max="2"
              />
            </el-form-item>
          </div>
        </el-collapse-item>

        <!-- recordConfig -->
        <el-collapse-item title="Record Config" name="3">
          <el-form-item label="Directory to Save Record">
            <div class="layout space-x-2 w-full flex flex-nowrap">
              <el-input
                disabled
                v-model="form.recordConfig.dirToSaveRecord"
                placeholder="No directory available"
              />
              <el-button @click="getDirPath('dirToSaveRecord')"
                >Add Path</el-button
              >
            </div>
          </el-form-item>

          <el-form-item label="check Stream Interval">
            <div class="layout space-x-2 w-full flex">
              <el-input-number
                v-model="form.recordConfig.checkStreamInterval"
                :min="10"
              />
              <div class="unit">sec</div>
            </div>
          </el-form-item>

          <el-form-item label="offline times to check">
            <el-input-number v-model="form.recordConfig.maxTryTimes" :min="0" />
          </el-form-item>

          <el-form-item label="Number of Download Limit">
            <el-input-number
              v-model="form.recordConfig.numOfDownloadLimit"
              :min="0"
            />
          </el-form-item>

          <el-form-item label="Program">
            <el-select
              v-model="form.recordConfig.program"
              placeholder="Program to Record Steam/VOD"
            >
              <el-option
                v-for="item in programsToRecord"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>

        <!-- processSetting -->
        <el-collapse-item title="Download VOD Setting" name="4">
          <div class="result m-5">
            <el-card class="grid place-items-center">
              {{ checkVODIntegrityInfo }}
            </el-card>
          </div>

          <el-form-item label="Enable Check VOD Integrity">
            <el-switch v-model="form.downloadVODSetting.IntegrityCheck" />
          </el-form-item>

          <el-form-item
            v-show="form.downloadVODSetting.IntegrityCheck"
            label="Loss of VOD Duration Allowed"
          >
            <div class="layout space-x-2 w-full flex">
              <el-input-number
                v-model="form.downloadVODSetting.LossOfVODDurationAllowed"
                :min="0"
              />

              <el-select
                v-model="form.downloadVODSetting.IntegrityCheckUnit"
                placeholder="Unit to check integrity"
              >
                <el-option
                  v-for="item in integrityCheckUnits"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="ReTry Download Interval">
            <div class="layout space-x-2 w-full flex">
              <el-input-number
                v-model="form.downloadVODSetting.reTryDownloadInterval"
                :min="0"
              />
              <span>minutes</span>
            </div>
          </el-form-item>

          <el-form-item label="Max ReDownload Times">
            <el-input-number
              v-model="form.downloadVODSetting.maxReDownloadTimes"
              :min="0"
            />
          </el-form-item>
        </el-collapse-item>

        <!-- downloadVODSetting -->
        <el-collapse-item title="Process Setting" name="5">
          <el-form-item label="Enable Process Videos">
            <el-switch v-model="form.processSetting.enable" />
          </el-form-item>

          <el-form-item label="Directory to Process Videos">
            <div class="layout space-x-2 w-full flex flex-nowrap">
              <el-input
                disabled
                v-model="form.processSetting.dirToProcessing"
                placeholder="No directory available"
              />
              <el-button @click="getDirPath('dirToProcessing')"
                >Add Path</el-button
              >
            </div>
          </el-form-item>

          <el-form-item label="Directory to Store Videos processed">
            <div class="layout space-x-2 w-full flex flex-nowrap">
              <el-input
                disabled
                v-model="form.processSetting.dirToProcessed"
                placeholder="No directory available"
              />
              <el-button @click="getDirPath('dirToProcessed')"
                >Add Path</el-button
              >
            </div>
          </el-form-item>

          <el-form-item label="Path of ffmpeg">
            <div class="layout space-x-2 w-full flex flex-nowrap">
              <el-input
                disabled
                v-model="form.processSetting.ffmpegPath"
                placeholder="path of ffmpeg has not set"
              />
              <el-button @click="getFilePath('ffmpegPath')">Add Path</el-button>
            </div>
          </el-form-item>

          <el-form-item label="Path of ffprobe">
            <div class="layout space-x-2 w-full flex flex-nowrap">
              <el-input
                disabled
                v-model="form.processSetting.probePath"
                placeholder="path of ffprobe has not set"
              />
              <el-button @click="getFilePath('probePath')">Add Path</el-button>
            </div>
          </el-form-item>

          <el-form-item label="Suffix of Mute">
            <el-input
              v-model="form.processSetting.suffixMute"
              placeholder="suffix for muted videos"
            />
          </el-form-item>

          <el-form-item label="Suffix of Convert">
            <el-input
              v-model="form.processSetting.suffixConvert"
              placeholder="suffix for converted videos"
            />
          </el-form-item>

          <el-form-item label="Suffix of Combine">
            <el-input
              v-model="form.processSetting.suffixCombine"
              placeholder="suffix for combined videos"
            />
          </el-form-item>

          <el-form-item label="Processes interval">
            <el-input-number
              v-model="form.processSetting.minutesToDelay"
              :min="0"
              size="small"
              class="mr-2"
              controls-position="right"
            />
            minutes
          </el-form-item>

          <el-form-item label="Output Type">
            <el-input
              v-model="form.processSetting.outputType"
              placeholder="suffix for combined videos"
            />
          </el-form-item>

          <el-form-item label="processMethod">
            <el-select
              v-model="form.processSetting.processMethod"
              placeholder="Program to Record Steam/VOD"
            >
              <el-option
                v-for="item in processMethods"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {
  IUserConfig,
  checkDiskUnits,
  processMethods,
  programsToRecord,
  integrityCheckUnits,
} from '../../../main/types/configuration'
import { handleConfig } from '../composable/configuration'
import { recordTypeList, recordModeList } from '../../../main/types/record'
import Notify from '../util/notify'

const { configuration, getConfiguration, editConfiguration } = handleConfig()

const labelWidth = '200px'

const activeNames = ref([])

const isFormChanged = ref(false)

const form = ref<IUserConfig>()

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

const getDirPath = async (
  key: 'dirToSaveRecord' | 'dirToProcessing' | 'dirToProcessed'
) => {
  if (!form.value) return

  const res = (await window.ipcRenderer.invoke('showOpenDialog', {
    properties: ['openDirectory'],
  })) as string[] | undefined

  if (!res) return

  switch (key) {
    case 'dirToSaveRecord':
      form.value.recordConfig.dirToSaveRecord = res[0]
      break
    case 'dirToProcessing':
      form.value.processSetting.dirToProcessing = res[0]
      break
    case 'dirToProcessed':
      form.value.processSetting.dirToProcessed = res[0]
      break
    default:
      break
  }
}

// TODO: validation check
const getFilePath = async (key: 'ffmpegPath' | 'probePath') => {
  if (!form.value) return

  const res = (await window.ipcRenderer.invoke('showOpenDialog', {
    filters: [
      { name: 'Exe Files', extensions: ['exe'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  })) as string[] | undefined

  if (!res) return

  form.value.processSetting[key] = res[0]
}

const saveConfig = async () => {
  if (!form.value) return

  const res = await editConfiguration(JSON.parse(JSON.stringify(form.value)))

  if(res) isFormChanged.value = false
}

const importConfig = async () => {
  const importPath = (await window.ipcRenderer.invoke('showOpenDialog', {
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  })) as string[] | undefined

  if (!importPath) return

  const res = await window.ipcRenderer.invoke('importConfig', importPath[0])

  const message = res ? 'success' : 'fail'

  Notify.send(`Import config ${message}`, res)

  if (res) await fetchConfig()
}

const exportConfig = async () => {
  if (!form.value) return

  const exportPath = (await window.ipcRenderer.invoke('showSaveDialog', {
    title: 'Export Config',
    defaultPath: 'config',
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })) as string | undefined

  if (!exportPath) return

  const res = await window.ipcRenderer.invoke('exportConfig', exportPath)

  const message = res ? 'success' : 'fail'

  Notify.send(`Edit config ${message}`, res)
}

// TODO: Dialog確認
const setDefault = async () => {
  const res = await window.ipcRenderer.invoke('setDefault')

  const message = res ? 'Default config is set' : 'Fail to set Config'

  Notify.send(message, res)

  if (res) await fetchConfig()
}

onMounted(fetchConfig)
</script>

<style scoped>
:deep(label.el-form-item__label) {
  word-break: break-word;
}
</style>
