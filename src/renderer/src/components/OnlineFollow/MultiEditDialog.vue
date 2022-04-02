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
            v-for="item in vodOption"
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
            v-for="item in recordType"
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
import { includes } from '../../util/common'
import { SettingToUpdate } from './MultiEditDialog'
import { IRecordSetting } from '../../../../main/types/record'

interface MultiEditDialogEmit {
  (eventName: 'update', value: SettingToUpdate): void
  (eventName: 'update:modelValue', value: boolean): void
}

const props = defineProps<{
  dialogVisible: boolean
}>()

const emit = defineEmits<MultiEditDialogEmit>()

const labelWidth = '200px'

const vodOption = [
  { value: 'queue', label: 'Queue' },
  { value: 'manual', label: 'Manual' },
  { value: 'offLine', label: 'OffLine' },
  { value: 'timeZone', label: 'Time Zone' },
  { value: 'countDown', label: 'Count Down' },
]

const recordType = ['stream', 'vod']

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

const showVODSetting = ref(false)

const showCheckStreamContentSetting = ref(false)

const settingToUpdate = reactive<SettingToUpdate>({})

const booleanTypeSettings = [
  'enableRecord',
  'enableNotify',
  'vodGetStreamIfNoVod',
  'vodIsStopRecordStream',
  'checkStreamContentTypeEnable',
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

const handleEditUsers = () => {
  const keys = Object.keys(settingToUpdate) as (keyof typeof settingToUpdate)[]

  for (const key of keys) {
    if (settingToUpdate[key] === undefined || settingToUpdate[key] === null)
      delete settingToUpdate[key]
  }

  emit('update', settingToUpdate)

  emit('update:modelValue', false)
}

const resetSettingToUpdate = () => {
  const keys = Object.keys(settingToUpdate) as (keyof typeof settingToUpdate)[]

  keys.forEach((key) => delete settingToUpdate[key])
}

const resetDisableList = () => {
  const keys = Object.keys(disableList) as (keyof typeof disableList)[]

  keys.forEach((key) => {
    disableList[key] = false
  })
}

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
