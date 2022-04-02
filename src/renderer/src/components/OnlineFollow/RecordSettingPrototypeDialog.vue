<template>
  <el-dialog
    title="Prototype of User Record Setting"
    top="5vh"
    width="90%"
    v-model="dialogVisible"
  >
    <el-form :model="form" :label-width="labelWidth">
      <el-divider><strong> General Setting </strong></el-divider>
      <el-form-item label="Enable Record">
        <el-switch v-model="form.enableRecord" />
      </el-form-item>

      <el-form-item label="Enable Notify">
        <el-switch v-model="form.enableNotify" />
      </el-form-item>

      <el-form-item label="stream File Name">
        <el-input
          v-model="form.fileNameTemplate"
          placeholder="Define your file name here"
        />
      </el-form-item>

      <el-form-item label="Record Type">
        <el-checkbox-group size="small" v-model="form.recordType">
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
        <el-switch v-model="form.vodIsStopRecordStream" />
      </el-form-item>

      <el-form-item label="Get Stream If No Vod">
        <el-switch v-model="form.vodGetStreamIfNoVod" />
      </el-form-item>

      <el-form-item label="VOD mode">
        <el-select v-model="form.vodMode" placeholder="Select VOD mode">
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
          v-model="form.vodCountDownInMinutes"
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
          v-model="form.vodTimeZone"
          placeholder="time zone"
          :clearable="false"
        />
      </el-form-item>

      <el-form-item label="VOD File Name">
        <el-input
          v-model="form.vodFileNameTemplate"
          placeholder="Define your file name here"
        />
      </el-form-item>

      <el-divider><strong> Check Stream Content </strong></el-divider>

      <el-form-item label="Enable Check Stream Content Type">
        <el-switch v-model="form.checkStreamContentTypeEnable" />
      </el-form-item>

      <el-form-item label="check Stream Content Type Target Game Names">
        <el-input
          v-model="form.checkStreamContentTypeTargetGameNames"
          type="textarea"
          placeholder="Use semicolon to add game type"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:dialogVisible', false)">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleEditConfig">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { handleConfig } from '../../composable/configuration'
import {
  IRecordSetting,
  recordTypeList,
  recordModeList,
} from '../../../../main/types/record'

interface RecordSettingPrototypeDialogEmit {
  (e: 'update:dialogVisible', value: boolean): void
}

const labelWidth = '200px'

const emit = defineEmits<RecordSettingPrototypeDialogEmit>()

const props = defineProps<{
  dialogVisible: boolean
}>()

let form = reactive<IRecordSetting>({
  enableRecord: true,
  enableNotify: true,
  vodIsStopRecordStream: true,
  vodGetStreamIfNoVod: true,
  vodMode: 'countDown',
  vodCountDownInMinutes: 60,
  vodTimeZone: new Date(2022, 1, 10, 3, 0).toISOString(),
  vodFileNameTemplate: '{channel}_TwitchVOD_{date}_{duration}',
  recordType: ['stream', 'vod'],
  checkStreamContentTypeEnable: true,
  checkStreamContentTypeTargetGameNames: 'Art;Just Chatting;',
  fileNameTemplate: '{channel}_TwitchLive_{date}',
})

const { configuration, getConfiguration, editConfiguration } = handleConfig()

const handleEditConfig = async () => {
  if (!configuration.value) return

  configuration.value.recordSettingPrototype = form

  await editConfiguration(JSON.parse(JSON.stringify(configuration.value)))

  emit('update:dialogVisible', false)
}

watch(
  () => props.dialogVisible,
  async (isShowDialog) => {
    if (!isShowDialog) return

    await getConfiguration()

    if (!configuration.value) return

    const { recordSettingPrototype } = configuration.value

    form = Object.assign(form, recordSettingPrototype)
  }
)
</script>

<style scoped>
:deep(label.el-form-item__label) {
  word-break: break-word;
}
</style>
