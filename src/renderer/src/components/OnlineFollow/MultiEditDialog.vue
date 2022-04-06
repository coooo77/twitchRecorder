<template>
  <el-dialog top="5vh" width="90%" v-model="dialogVisible">
    <div class="mainConfigs">
      <el-checkbox
        v-model="disableList.enableRecord"
        label="Enable Record"
        @change="removeSetting($event, 'enableRecord')"
      />

      <el-checkbox
        v-model="disableList.enableNotify"
        label="Enable Notify"
        @change="removeSetting($event, 'enableNotify')"
      />

      <el-checkbox v-model="showVODSetting" label="VOD" />

      <el-checkbox
        v-model="disableList.recordType"
        label="Record Type"
        @change="removeSetting($event, 'recordType')"
      />

      <el-checkbox
        v-model="showCheckStreamContentSetting"
        label="Check Stream Content Type"
      />

      <el-checkbox
        v-model="disableList.fileNameTemplate"
        label="File Name Template"
        @change="removeSetting($event, 'fileNameTemplate')"
      />

      <el-checkbox
        v-model="showVideoProcessSetting"
        label="Video Process Setting"
      />
    </div>

    <template v-if="showVODSetting">
      <el-divider>
        <strong> VOD Option </strong>
      </el-divider>

      <el-checkbox
        v-model="disableList.vodIsStopRecordStream"
        label="Is Stop Record Stream"
        @change="removeSetting($event, 'vodIsStopRecordStream')"
      />

      <el-checkbox
        v-model="disableList.vodGetStreamIfNoVod"
        label="Get Stream If No Vod"
        @change="removeSetting($event, 'vodGetStreamIfNoVod')"
      />

      <el-checkbox
        v-model="disableList.vodMode"
        label="VOD record mode"
        @change="removeSetting($event, 'vodMode')"
      />

      <el-checkbox
        v-model="disableList.vodCountDownInMinutes"
        label="Count Down In Minutes"
        @change="removeSetting($event, 'vodCountDownInMinutes')"
      />

      <el-checkbox
        v-model="disableList.vodTimeZone"
        label="Time Zone"
        @change="removeSetting($event, 'vodTimeZone')"
      />

      <el-checkbox
        v-model="disableList.vodFileNameTemplate"
        label="VOD File Name Template"
        @change="removeSetting($event, 'vodFileNameTemplate')"
      />
    </template>

    <template v-if="showCheckStreamContentSetting">
      <el-divider>
        <strong> Check Stream Content Type Option </strong>
      </el-divider>

      <el-checkbox
        v-model="disableList.checkStreamContentTypeEnable"
        label="check Stream Content Type"
        @change="removeSetting($event, 'checkStreamContentTypeEnable')"
      />

      <el-checkbox
        v-model="disableList.checkStreamContentTypeTargetGameNames"
        label="check Stream Content Type Target Game Names"
        @change="removeSetting($event, 'checkStreamContentTypeTargetGameNames')"
      />
    </template>

    <template v-if="showVideoProcessSetting">
      <el-divider>
        <strong> video Process Setting </strong>
      </el-divider>

      <el-checkbox
        v-model="videoProcessDisableList.deleteFile"
        label="Delete file"
        @change="removeVideoProcessSetting($event, 'deleteFile')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.mute"
        label="Enable mute"
        @change="removeVideoProcessSetting($event, 'mute')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.compress"
        label="Enable compress"
        @change="removeVideoProcessSetting($event, 'compress')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.combine"
        label="Enable Combine"
        @change="removeVideoProcessSetting($event, 'combine')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.intervalToCheckCombine"
        label="Interval To Check Combine"
        @change="removeVideoProcessSetting($event, 'intervalToCheckCombine')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.screenshotType"
        label="Screenshot Type"
        @change="removeVideoProcessSetting($event, 'screenshotType')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.screenshotFolder"
        label="Screenshot Folder"
        @change="removeVideoProcessSetting($event, 'screenshotFolder')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.screenshotCount"
        label="Screenshot Count"
        @change="removeVideoProcessSetting($event, 'screenshotCount')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.screenshotTimestamps"
        label="Screenshot Timestamps"
        @change="removeVideoProcessSetting($event, 'screenshotTimestamps')"
      />

      <el-checkbox
        v-model="videoProcessDisableList.screenshotSize"
        label="Screenshot Size"
        @change="removeVideoProcessSetting($event, 'screenshotSize')"
      />
    </template>

    <el-divider><strong> Setting Changed </strong></el-divider>

    <el-form label-width="120px">
      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.enableRecord"
        label="Enable Record"
      >
        <el-switch v-model="settingToUpdate.enableRecord" />
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.enableNotify"
        label="Enable Notify"
      >
        <el-switch v-model="settingToUpdate.enableNotify" />
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.vodIsStopRecordStream"
        label="Is Stop Record Stream"
      >
        <el-switch v-model="settingToUpdate.vodIsStopRecordStream" />
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.vodGetStreamIfNoVod"
        label="Get Stream If No Vod"
      >
        <el-switch v-model="settingToUpdate.vodGetStreamIfNoVod" />
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.vodMode"
        label="VOD mode"
      >
        <el-select v-model="settingToUpdate.vodMode" placeholder="Select">
          <el-option
            v-for="item in recordModeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.vodCountDownInMinutes"
        label="countdown"
      >
        <el-input-number
          v-model="settingToUpdate.vodCountDownInMinutes"
          :min="1"
          :max="1440"
          size="small"
          m="r-2"
          controls-position="right"
        />
        minutes
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.vodTimeZone"
        label="time zone"
      >
        <el-time-picker
          v-model="settingToUpdate.vodTimeZone"
          placeholder="time zone"
        />
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.vodFileNameTemplate"
        label="VOD File Name"
      >
        <el-input
          v-model="settingToUpdate.vodFileNameTemplate"
          placeholder="vod File Name Template"
        />
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.recordType"
        label="Record Type"
      >
        <el-checkbox-group size="small" v-model="settingToUpdate.recordType">
          <el-checkbox-button
            v-for="item in recordTypeList"
            :key="item"
            :label="item"
          >
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.checkStreamContentTypeEnable"
        label="Enable check Stream Content Type"
      >
        <el-switch v-model="settingToUpdate.checkStreamContentTypeEnable" />
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.checkStreamContentTypeTargetGameNames"
        label="check Stream Content Type Target Game Names"
      >
        <el-input
          v-model="settingToUpdate.checkStreamContentTypeTargetGameNames"
          type="textarea"
          placeholder="Use semicolon to add game type"
        />
      </el-form-item>

      <el-form-item
        :label-width="labelWidth"
        v-show="disableList.fileNameTemplate"
        label="Stream File Name"
      >
        <el-input
          v-model="settingToUpdate.fileNameTemplate"
          placeholder="Stream File Name Template"
        />
      </el-form-item>
    </el-form>

    <el-form label-width="120px">
      <el-form-item
        v-show="videoProcessDisableList.deleteFile"
        label="Delete file"
      >
        <el-switch v-model="videoProcessSettingToUpdate.deleteFile" />
      </el-form-item>

      <el-form-item v-show="videoProcessDisableList.mute" label="Enable Mute">
        <el-switch v-model="videoProcessSettingToUpdate.mute" />
      </el-form-item>

      <el-form-item
        v-show="videoProcessDisableList.compress"
        label="Enable Compress"
      >
        <el-switch v-model="videoProcessSettingToUpdate.compress" />
      </el-form-item>

      <el-form-item
        v-show="videoProcessDisableList.combine"
        label="Enable Combine"
      >
        <el-switch v-model="videoProcessSettingToUpdate.combine" />
      </el-form-item>

      <el-form-item
        v-show="videoProcessDisableList.intervalToCheckCombine"
        label="Interval To Check Combine"
      >
        <div class="layout space-x-2 w-full flex">
          <el-input-number
            v-model="videoProcessSettingToUpdate.intervalToCheckCombine"
            :min="0"
          />
          <span>minutes</span>
        </div>
      </el-form-item>

      <el-form-item
        v-show="videoProcessDisableList.screenshotType"
        label="Screenshot Type"
      >
        <el-select
          v-model="videoProcessSettingToUpdate.screenshotType"
          placeholder="pattern to take screenshot"
        >
          <el-option
            v-for="item in screenshotTypes"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-show="videoProcessDisableList.screenshotFolder"
        label="Screenshot Folder"
      >
        <div class="layout space-x-2 w-full flex flex-nowrap">
          <el-input
            disabled
            v-model="videoProcessSettingToUpdate.screenshotFolder"
            placeholder="No directory available"
          />
          <el-button @click="setDirPath">Add Path</el-button>
        </div>
      </el-form-item>

      <el-form-item
        v-show="videoProcessDisableList.screenshotCount"
        label="Screenshot Count"
      >
        <el-input-number
          v-model="videoProcessSettingToUpdate.screenshotCount"
          :min="0"
          :step="1"
        />
      </el-form-item>

      <el-form-item
        v-show="videoProcessDisableList.screenshotTimestamps"
        label="Screenshot Timestamps"
      >
        <div class="values flex space-x-2">
          <div class="title">Take screenshot at:</div>
          <div
            v-for="(item, index) of screenshotTimestampValues(
              screenshotTimestampsToUpdate
            )"
            :key="`${index}_${item.value}`"
            class="flex items-center flex-nowrap space-x-2"
          >
            <div class="value">
              {{ item.displayName }}
            </div>

            <el-icon
              class="cursor-pointer"
              @click="removeScreenshotTimestamp(item.value)"
            >
              <Icon icon="el:remove-sign" />
            </el-icon>
          </div>
        </div>

        <div class="layout space-x-2 w-full flex flex-nowrap">
          <el-input
            v-model="screenshotTimestampValue"
            placeholder="Value of Timestamps e.g. 30.5、50%、01:10.123"
            @keyup.enter="addScreenshotTimestamp"
          />

          <el-select
            v-model="screenshotTimestampTypesSelected"
            placeholder="Timestamp Types"
          >
            <el-option
              v-for="item in screenshotTimestampTypes"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-button @click="addScreenshotTimestamp" type="primary">
            Add
          </el-button>
        </div>
      </el-form-item>

      <el-form-item
        v-show="videoProcessDisableList.screenshotSize"
        label="Screenshot Size"
      >
        <el-input
          v-model="videoProcessSettingToUpdate.screenshotSize"
          placeholder="specifies a target size for thumbnails; e.g. 320x240"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modelValue', false)">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleEditUsers"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  IRecordSetting,
  recordModeList,
  recordTypeList,
} from '../../../../main/types/record'
import {
  IVideoProcessSetting,
  screenshotTypes,
  screenshotTimestampTypes,
} from '../../../../main/types/configuration'
import { Icon } from '@iconify/vue'
import { handleSetting } from '../../composable/setting'
import { includes, labelWidth } from '../../util/common'
import { SettingToUpdate, VideoProcessSettingToUpDate } from './MultiEditDialog'

interface MultiEditDialogEmit {
  (eventName: 'update:modelValue', value: boolean): void
  (
    eventName: 'update',
    value1: SettingToUpdate,
    value2: VideoProcessSettingToUpDate
  ): void
}

const {
  getDirPath,
  getScreenshotTimestamp,
  screenshotTimestampValues,
  screenshotTimestampValue,
  screenshotTimestampTypesSelected,
} = handleSetting()

const props = defineProps<{
  dialogVisible: boolean
}>()

const emit = defineEmits<MultiEditDialogEmit>()

const disableList = reactive({
  enableRecord: false,
  enableNotify: false,
  vodIsStopRecordStream: false,
  vodGetStreamIfNoVod: false,
  vodMode: false,
  vodCountDownInMinutes: false,
  vodTimeZone: false,
  vodFileNameTemplate: false,
  recordType: false,
  checkStreamContentTypeEnable: false,
  checkStreamContentTypeTargetGameNames: false,
  fileNameTemplate: false,
})

const videoProcessDisableList = reactive({
  deleteFile: false,
  mute: false,
  compress: false,
  combine: false,
  intervalToCheckCombine: false,
  screenshotType: false,
  screenshotFolder: false,
  screenshotCount: false,
  screenshotTimestamps: false,
  screenshotSize: false,
})

const showVODSetting = ref(false)

const showVideoProcessSetting = ref(false)

const showCheckStreamContentSetting = ref(false)

const settingToUpdate = reactive<SettingToUpdate>({})

const booleanTypeSettings = [
  'enableRecord',
  'enableNotify',
  'vodGetStreamIfNoVod',
  'vodIsStopRecordStream',
  'checkStreamContentTypeEnable',
] as const

const videoProcessSettingToUpdate = reactive<
  Partial<VideoProcessSettingToUpDate>
>({})

const booleanTypeVideoProcessSettingToUpdate = [
  'mute',
  'combine',
  'compress',
  'deleteFile',
] as const

const removeSetting = (
  changeStatus: boolean,
  targetKey: keyof Omit<IRecordSetting, 'offlineTimesToCheck'>
) => {
  if (!changeStatus) {
    delete settingToUpdate[targetKey]
  } else if (includes(booleanTypeSettings, targetKey)) {
    // Set default value for boolean type setting
    settingToUpdate[targetKey] = false
  }
}

const removeVideoProcessSetting = (
  changeStatus: boolean,
  targetKey: keyof IVideoProcessSetting
) => {
  if (!changeStatus) {
    delete videoProcessSettingToUpdate[targetKey]
  } else if (includes(booleanTypeVideoProcessSettingToUpdate, targetKey)) {
    // Set default value for boolean type setting
    videoProcessSettingToUpdate[targetKey] = false
  }
}

const handleEditUsers = () => {
  const keysOfSettingToUpdate = Object.keys(
    settingToUpdate
  ) as (keyof typeof settingToUpdate)[]

  for (const key of keysOfSettingToUpdate) {
    if (settingToUpdate[key] === undefined || settingToUpdate[key] === null)
      delete settingToUpdate[key]
  }

  const keysOfVideoProcessSettingToUpdate = Object.keys(
    videoProcessSettingToUpdate
  ) as (keyof typeof videoProcessSettingToUpdate)[]

  for (const key of keysOfVideoProcessSettingToUpdate) {
    if (
      videoProcessSettingToUpdate[key] === undefined ||
      videoProcessSettingToUpdate[key] === null
    )
      delete videoProcessSettingToUpdate[key]
  }

  emit('update', settingToUpdate, videoProcessSettingToUpdate)

  emit('update:modelValue', false)
}

const resetSettingToUpdate = () => {
  const keysOfSettingToUpdate = Object.keys(
    settingToUpdate
  ) as (keyof typeof settingToUpdate)[]

  keysOfSettingToUpdate.forEach((key) => delete settingToUpdate[key])

  const keysOfVideoProcessSettingToUpdate = Object.keys(
    videoProcessSettingToUpdate
  ) as (keyof typeof videoProcessSettingToUpdate)[]

  keysOfVideoProcessSettingToUpdate.forEach(
    (key) => delete videoProcessSettingToUpdate[key]
  )
}

const resetDisableList = () => {
  const keys = Object.keys(disableList) as (keyof typeof disableList)[]

  keys.forEach((key) => {
    disableList[key] = false
  })
}

const setDirPath = async () => {
  const res = await getDirPath()

  if (!res) return

  videoProcessSettingToUpdate.screenshotFolder = res
}

const addScreenshotTimestamp = () => {
  const res = getScreenshotTimestamp()

  if (res === undefined) return

  if (videoProcessSettingToUpdate.screenshotTimestamps) {
    videoProcessSettingToUpdate.screenshotTimestamps.push(res)
  } else {
    videoProcessSettingToUpdate.screenshotTimestamps = [res]
  }
}

const removeScreenshotTimestamp = (value: string | number) => {
  if (!videoProcessSettingToUpdate.screenshotTimestamps) return

  const index = videoProcessSettingToUpdate.screenshotTimestamps.findIndex(
    (i) => i === value
  )

  if (index !== -1)
    videoProcessSettingToUpdate.screenshotTimestamps.splice(index, 1)
}

const screenshotTimestampsToUpdate = computed(
  () => videoProcessSettingToUpdate.screenshotTimestamps || []
)

watch(
  () => props.dialogVisible,
  (isOpenDialog) => {
    if (!isOpenDialog) {
      resetSettingToUpdate()

      resetDisableList()
    }
  }
)
</script>

<style scoped>
:deep(label.el-form-item__label) {
  word-break: break-word;
}
</style>
