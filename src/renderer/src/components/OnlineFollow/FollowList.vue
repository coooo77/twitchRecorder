<template>
  <el-table @selection-change="handleSelectionChange" :data="tableData" style="width: 100%">
    <el-table-column type="selection" width="55" />

    <el-table-column label="Name" prop="displayName">
      <template #default="{ row }">
        <div class="userName">
          <div>{{ `${row.displayName}` }}</div>
          <div>{{ `( ${row.login} )` }}</div>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="Enable Record">
      <template #default="scope">
        <el-switch
          @change="$emit('editUser', scope.row, 'record')"
          v-model="scope.row.recordSetting.enableRecord"
        />
      </template>
    </el-table-column>

    <el-table-column label="Enable Notify">
      <template #default="scope">
        <el-switch
          @change="$emit('editUser', scope.row, 'notify')"
          v-model="scope.row.recordSetting.enableNotify"
        />
      </template>
    </el-table-column>

    <el-table-column label="Stream">
      <template #default="scope">
        <el-tag
          :type="scope.row.status.isOnline ? 'danger' : 'info'"
        >{{ scope.row.status.isOnline ? 'Online' : 'Offline' }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="Record">
      <template #default="scope">
        <el-tag
          :type="scope.row.status.isRecording ? 'danger' : 'info'"
        >{{ scope.row.status.isRecording ? 'ON' : 'OFF' }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="Operations">
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="$emit('openDialog', scope.$index, scope.row)"
        >EDIT</el-button>

        <el-button
          type="danger"
          size="small"
          @click="$emit('openDialog', scope.$index, scope.row)"
        >DELETE</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ITargetUser } from '../../types/user';

defineProps({
  tableData: {
    type: Object as PropType<ITargetUser[]>,
    required: true,
    default: () => ([])
  }
})

const emit = defineEmits<{
  (eventName: 'enableMultiEdit', isEnableMultiEdit: boolean): void
  (eventName: 'openDialog', index: number, row: ITargetUser): void
  (eventName: 'editUser', row: ITargetUser, type: 'record' | 'notify'): void
}>()

const multipleSelection = ref<ITargetUser[]>([])

const handleSelectionChange = (val: ITargetUser[]) => {
  multipleSelection.value = val

  const isEnableMultiEdit = val.length > 1

  emit('enableMultiEdit', isEnableMultiEdit)
}
</script>