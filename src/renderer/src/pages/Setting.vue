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
          <RecordSetting v-model:recordSetting="form.recordSettingPrototype" />
        </el-collapse-item>

        <!-- videoProcessSettingPrototype -->
        <el-collapse-item title="Process Setting Prototype" name="2">
          <VideoProcessSetting
            v-model:videoProcessSetting="form.videoProcessSettingPrototype"
          />
        </el-collapse-item>

        <!-- checkDiskSpaceAction -->
        <el-collapse-item title="Check Disk Space Action" name="3">
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
        <el-collapse-item title="Record Config" name="4">
          <el-form-item label="Directory to Save Record">
            <div class="layout space-x-2 w-full flex flex-nowrap">
              <el-input
                disabled
                v-model="form.recordConfig.dirToSaveRecord"
                placeholder="No directory available"
              />
              <el-button @click="setDirPath('dirToSaveRecord')"
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
        <el-collapse-item title="Download VOD Setting" name="5">
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

        <!-- processSetting -->
        <el-collapse-item title="Process Setting" name="6">
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
              <el-button @click="setDirPath('dirToProcessing')"
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
              <el-button @click="setDirPath('dirToProcessed')"
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
              <el-button @click="setFilePath('ffmpegPath')">Add Path</el-button>
            </div>
          </el-form-item>

          <el-form-item label="Path of ffprobe">
            <div class="layout space-x-2 w-full flex flex-nowrap">
              <el-input
                disabled
                v-model="form.processSetting.probePath"
                placeholder="path of ffprobe has not set"
              />
              <el-button @click="setFilePath('probePath')">Add Path</el-button>
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
  checkDiskUnits,
  processMethods,
  programsToRecord,
  integrityCheckUnits,
} from '../../../main/types/configuration'
import { labelWidth } from '../util/common'
import { handleSetting } from '../composable/setting'

import RecordSetting from '../components/Setting/RecordSetting.vue'
import VideoProcessSetting from '../components/Setting/VideoProcessSetting.vue'

const {
  form,
  isFormChanged,
  checkDiskSpaceInfo,
  checkVODIntegrityInfo,
  getDirPath,
  getFilePath,
  setDefault,
  saveConfig,
  importConfig,
  exportConfig,
} = handleSetting()

const activeNames = ref([])

const setDirPath = async (
  key:
    | 'dirToSaveRecord'
    | 'dirToProcessing'
    | 'dirToProcessed'
    | 'screenshotFolder'
) => {
  if (!form.value) return

  const res = await getDirPath()

  if (!res) return

  switch (key) {
    case 'dirToSaveRecord':
      form.value.recordConfig.dirToSaveRecord = res
      break
    case 'dirToProcessing':
      form.value.processSetting.dirToProcessing = res
      break
    case 'dirToProcessed':
      form.value.processSetting.dirToProcessed = res
      break
    case 'screenshotFolder':
      form.value.videoProcessSettingPrototype.screenshotFolder = res
      break
    default:
      break
  }
}

const setFilePath = async (key: 'ffmpegPath' | 'probePath') => {
  if (!form.value) return

  const res = await getFilePath()

  if (!res) return

  form.value.processSetting[key] = res
}
</script>

<style scoped>
:deep(label.el-form-item__label) {
  word-break: break-word;
}
</style>
