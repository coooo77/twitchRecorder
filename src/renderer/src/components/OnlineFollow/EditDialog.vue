<template>
  <el-dialog
    v-if="editTarget"
    top="5vh"
    width="90%"
    v-model="dialogVisible"
    @close="$emit('dialogClose')"
  >
    <div
      class="dialogContent grid grid-cols-[min-content,1fr] grid-rows-[min-content,1fr]"
      gap="y-3 x-5"
    >
      <el-card class="profile">
        <div class="content flex flex-col justify-center items-center">
          <a
            target="__blank"
            :href="`https://www.twitch.tv/${editTarget.login}`"
          >
            <img
              loading="lazy"
              class="min-w-150px min-h-150px rounded-full mb-2"
              :src="editTarget.profileImg"
            />
          </a>
          <div class="userName font-extrabold text-lg">
            {{ editTarget.displayName }}
          </div>
        </div>
      </el-card>

      <el-card class="status">
        <template #header>
          <header class="text-3xl">STATUS</header>
        </template>
        <div class="onlineStatus text-lg mb-3 flex items-center gap-2">
          Online Status :
          <el-tag :type="editTarget.status.isOnline ? 'danger' : 'info'">{{
            editTarget.status.isOnline ? 'Online' : 'Offline'
          }}</el-tag>
        </div>
        <div class="recordStatus text-lg mb-3 flex items-center gap-2">
          Record Status :
          <el-tag :type="editTarget.status.isRecording ? 'danger' : 'info'">{{
            editTarget.status.isRecording ? 'ON' : 'OFF'
          }}</el-tag>
        </div>
        <div class="recordStatus text-lg mb-3">
          Last Stream time :
          {{
            editTarget.status.streamStartedAt
              ? new Date(editTarget.status.streamStartedAt)
              : 'Unknown'
          }}
        </div>
      </el-card>

      <el-card class="config col-span-full">
        <template #header>
          <div class="title text-2xl mb-1">RECORD SETTING</div>
        </template>

        <div class="content">
          <div class="recordFunction border-1 p-3 mb-2">
            <div class="title flex items-center gap-2 mb-4"></div>
            <div class="content grid grid-cols-[200px,1fr] gap-3 items-center">
              <strong>Enable Record :</strong>
              <el-switch v-model="editTarget.recordSetting.enableRecord" />

              <div class="streamFileNameTemplate title">File Name :</div>
              <el-input
                v-model="editTarget.recordSetting.fileNameTemplate"
                placeholder="Define your file name here"
              />

              <div class="recordType title">Record Type :</div>
              <el-checkbox-group
                size="small"
                v-model="editTarget.recordSetting.recordType"
              >
                <el-checkbox-button
                  v-for="item in recordType"
                  :key="item"
                  :label="item"
                  >{{ item }}</el-checkbox-button
                >
              </el-checkbox-group>
            </div>
          </div>

          <div
            class="vodSetting border-1 p-3 mb-2 grid grid-cols-[200px,1fr] gap-3 items-center"
          >
            <strong>VOD Setting :</strong>
            <el-select
              v-model="editTarget.recordSetting.vodMode"
              placeholder="Select"
            >
              <el-option
                v-for="item in vodOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

            <template v-if="editTarget.recordSetting.vodMode === 'countDown'">
              <div class="countDown title">Count down</div>
              <div class="countDownInput">
                <el-input-number
                  v-model="editTarget.recordSetting.vodCountDownInMinutes"
                  :min="1"
                  :max="1440"
                  size="small"
                  m="r-2"
                  controls-position="right"
                />minutes
              </div>
            </template>

            <template v-if="editTarget.recordSetting.vodMode === 'timeZone'">
              <div class="timeZone title">At</div>
              <div class="timeZoneInput">
                <el-time-picker
                  v-model="editTarget.recordSetting.vodTimeZone"
                  placeholder="time zone"
                  :clearable="false"
                />
              </div>
            </template>

            <div class="streamFileNameTemplate title">File Name :</div>
            <el-input
              v-model="editTarget.recordSetting.vodFileNameTemplate"
              placeholder="Define your file name here"
            />
          </div>

          <div
            class="typeCheck border-1 p-3 mb-2 grid grid-cols-[200px,1fr] gap-3 items-center"
          >
            <strong>check stream type :</strong>
            <el-switch
              v-model="editTarget.recordSetting.checkStreamContentTypeEnable"
            />

            <div class="typeCheck title">Target Types :</div>

            <el-input
              v-model="
                editTarget.recordSetting.checkStreamContentTypeTargetGameNames
              "
              type="textarea"
              placeholder="Use semicolon to add game type"
            />
          </div>
        </div>
      </el-card>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:dialogVisible', false)"
          >Cancel</el-button
        >
        <el-button type="primary" @click="confirmEdit">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ITargetUser } from '../../../../main/types/user'

const emit = defineEmits<{
  (eventName: 'dialogClose'): void
  (eventName: 'confirmEdit', value: ITargetUser): void
  (eventName: 'update:dialogVisible', value: boolean): void
}>()

const props = defineProps<{
  dialogVisible: boolean
  dialogData: ITargetUser | undefined
}>()

const { dialogData } = toRefs(props)

const editTarget = computed(() => dialogData.value)

const recordType = ['stream', 'vod']

const vodOption = [
  { value: 'queue', label: 'Queue' },
  { value: 'manual', label: 'Manual' },
  { value: 'offLine', label: 'OffLine' },
  { value: 'timeZone', label: 'Time Zone' },
  { value: 'countDown', label: 'Count Down' },
]

const confirmEdit = () => {
  emit('update:dialogVisible', false)

  if (editTarget.value) emit('confirmEdit', editTarget.value)
}
</script>
