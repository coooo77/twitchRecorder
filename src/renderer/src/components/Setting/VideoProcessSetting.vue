<template>
  <el-form-item label="Delete file">
    <el-switch v-model="videoProcessSetting.deleteFile" />
  </el-form-item>

  <el-form-item label="Enable Mute">
    <el-switch v-model="videoProcessSetting.mute" />
  </el-form-item>

  <el-form-item label="Enable Compress">
    <el-switch v-model="videoProcessSetting.compress" />
  </el-form-item>

  <el-form-item label="Enable Combine">
    <el-switch v-model="videoProcessSetting.combine" />
  </el-form-item>

  <el-form-item label="Interval To Check Combine">
    <div class="layout space-x-2 w-full flex">
      <el-input-number
        v-model="videoProcessSetting.intervalToCheckCombine"
        :min="0"
      />
      <span>minutes</span>
    </div>
  </el-form-item>

  <el-form-item label="Screenshot Type">
    <el-select
      v-model="videoProcessSetting.screenshotType"
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

  <el-form-item label="Screenshot Folder">
    <div class="layout space-x-2 w-full flex flex-nowrap">
      <el-input
        disabled
        v-model="videoProcessSetting.screenshotFolder"
        placeholder="No directory available"
      />
      <el-button @click="setDirPath">Add Path</el-button>
    </div>
  </el-form-item>

  <el-form-item label="Screenshot Count">
    <el-input-number
      v-model="videoProcessSetting.screenshotCount"
      :min="0"
      :step="1"
    />
  </el-form-item>

  <el-form-item label="Screenshot Timestamps">
    <div class="values flex space-x-2">
      <div class="title">Take screenshot at:</div>
      <div
        v-for="(item, index) of screenshotTimestampValues(
          videoProcessSetting.screenshotTimestamps
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

  <el-form-item label="Screenshot Size">
    <el-input
      v-model="videoProcessSetting.screenshotSize"
      placeholder="specifies a target size for thumbnails; e.g. 320x240"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import {
  IVideoProcessSetting,
  screenshotTypes,
  screenshotTimestampTypes,
} from '../../../../main/types/configuration'
import { Icon } from '@iconify/vue'
import { handleSetting } from '../../composable/setting'

interface VideoProcessSettingEmit {
  (e: 'update:videoProcessSetting', value: IVideoProcessSetting): void
}

const {
  screenshotTimestampValue,
  screenshotTimestampTypesSelected,
  getDirPath,
  getScreenshotTimestamp,
  screenshotTimestampValues,
} = handleSetting()

const emit = defineEmits<VideoProcessSettingEmit>()

const props = defineProps<{
  videoProcessSetting: IVideoProcessSetting
}>()

const setDirPath = async () => {
  const res = await getDirPath()

  if (!res) return

  const copyValue = Object.assign({}, props.videoProcessSetting)

  copyValue.screenshotFolder = res

  emit('update:videoProcessSetting', copyValue)
}

const addScreenshotTimestamp = () => {
  const res = getScreenshotTimestamp()

  if (res === undefined) return

  props.videoProcessSetting.screenshotTimestamps.push(res)
}

const removeScreenshotTimestamp = (value: string | number) => {
  const index = props.videoProcessSetting.screenshotTimestamps.findIndex(
    (i) => i === value
  )

  if (index !== -1)
    props.videoProcessSetting.screenshotTimestamps.splice(index, 1)
}
</script>

<style scoped>
:deep(label.el-form-item__label) {
  word-break: break-word;
}
</style>
