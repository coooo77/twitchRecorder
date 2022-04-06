<template>
  <el-divider><strong> General Setting </strong></el-divider>
  <el-form-item label="Enable Record">
    <el-switch v-model="recordSetting.enableRecord" />
  </el-form-item>

  <el-form-item label="Enable Notify">
    <el-switch v-model="recordSetting.enableNotify" />
  </el-form-item>

  <el-form-item label="stream File Name">
    <el-input
      v-model="recordSetting.fileNameTemplate"
      placeholder="Define your file name here"
    />
  </el-form-item>

  <el-form-item label="Record Type">
    <el-checkbox-group size="small" v-model="recordSetting.recordType">
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
    <el-switch v-model="recordSetting.vodIsStopRecordStream" />
  </el-form-item>

  <el-form-item label="Get Stream If No Vod">
    <el-switch v-model="recordSetting.vodGetStreamIfNoVod" />
  </el-form-item>

  <el-form-item label="VOD mode">
    <el-select
      v-model="recordSetting.vodMode"
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
      v-model="recordSetting.vodCountDownInMinutes"
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
      v-model="recordSetting.vodTimeZone"
      placeholder="time zone"
      :clearable="false"
    />
  </el-form-item>

  <el-form-item label="VOD File Name">
    <el-input
      v-model="recordSetting.vodFileNameTemplate"
      placeholder="Define your file name here"
    />
  </el-form-item>

  <el-divider><strong> Check Stream Content </strong></el-divider>

  <el-form-item label="Enable Check Stream Content Type">
    <el-switch v-model="recordSetting.checkStreamContentTypeEnable" />
  </el-form-item>

  <el-form-item label="check Stream Content Type Target Game Names">
    <el-input
      v-model="recordSetting.checkStreamContentTypeTargetGameNames"
      type="textarea"
      placeholder="Use semicolon to add game type"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { IRecordSetting } from '../../../../main/types/record'
import { recordTypeList, recordModeList } from '../../../../main/types/record'

defineProps<{
  recordSetting: IRecordSetting
}>()
</script>

<style scoped>
:deep(label.el-form-item__label) {
  word-break: break-word;
}
</style>
