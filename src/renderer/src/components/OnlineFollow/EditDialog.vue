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
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item name="1">
            <template #title>
              <strong>RECORD SETTING</strong>
            </template>

            <el-form v-model="editTarget.recordSetting">
              <RecordSetting v-model:recordSetting="editTarget.recordSetting" />
            </el-form>
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
              <strong>Process Setting</strong>
            </template>

            <el-form v-model="editTarget.videoProcessSetting">
              <VideoProcessSetting
                v-model:videoProcessSetting="editTarget.videoProcessSetting"
              />
            </el-form>
          </el-collapse-item>
        </el-collapse>
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
import RecordSetting from '../Setting/RecordSetting.vue'
import VideoProcessSetting from '../Setting/VideoProcessSetting.vue'

const emit = defineEmits<{
  (eventName: 'dialogClose'): void
  (eventName: 'confirmEdit', value: ITargetUser): void
  (eventName: 'update:dialogVisible', value: boolean): void
}>()

const props = defineProps<{
  dialogVisible: boolean
  dialogData: ITargetUser | undefined
}>()

const activeNames = ref(['1'])

const { dialogData } = toRefs(props)

const editTarget = computed(() => dialogData.value)

const confirmEdit = () => {
  emit('update:dialogVisible', false)

  if (editTarget.value) emit('confirmEdit', editTarget.value)
}
</script>
