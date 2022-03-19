<template>
  <div class="onlineFollow overflow-y-auto">
    <header m="b-8" display="flex items-center">
      <div class="multiEdit flex items-center mr-3">
        <el-button
          :disabled="!isMultiEdit"
          type="primary"
          @click="multiEditDialogVisible = true"
          >EDIT</el-button
        >

        <el-button
          :disabled="!isMultiEdit"
          type="danger"
          @click="bulkDeleteUsers"
          >DELETE</el-button
        >
      </div>

      <el-input
        :disabled="isProcessing"
        v-model="input"
        placeholder="Enter streamer name to add; you can use semicolon to add multi users, e.g. name1;name2;name3"
        clearable
        @keyup.enter="addUsers"
      >
        <template #append>
          <el-button @click="addUsers" :icon="Plus"></el-button>
        </template>
      </el-input>
    </header>

    <!-- Table Data -->
    <follow-list
      v-if="tableData.length !== 0"
      :tableData="tableData"
      @deleteUser="deleteUsers($event)"
      @openDialog="handleOpenDialog"
      @enableMultiEdit="handleMultiEditStatus"
    />

    <el-empty v-else w="full" h="full" description="No Data" />

    <edit-dialog
      v-model:dialogVisible="editDialogVisible"
      v-model:dialogData="dialogData"
      @confirmEdit="handleEditData"
      @dialogClose="dialogData = undefined"
    />

    <multi-edit-dialog
      @update:modelValue="multiEditDialogVisible = $event"
      v-model:dialogVisible="multiEditDialogVisible"
      @update="handleMultiEdit"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  getUsers,
  GetUsersResponse,
  TwitchGetUsersParams,
} from '../util/twitchAPI_renderer'
import Notify from '../util/notify'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ITargetUser, ITargetUsers } from '../../../main/types/user'

// components、interface
import { SettingToUpdate } from '../components/OnlineFollow/MultiEditDialog'
import MultiEditDialog from '../components/OnlineFollow/MultiEditDialog.vue'

const usersToUpdate = ref<ITargetUser[]>([])

/** Read table data */
const tableData = ref<ITargetUser[]>([])

/** Add table data */
const isProcessing = ref(false)

const input = ref('')

const editDialogVisible = ref(false)

const multiEditDialogVisible = ref(false)

const dialogData = ref<ITargetUser | undefined>()

const isMultiEdit = ref(false)

const fetchTargets = async () => {
  const recordTargets = (await window.ipcRenderer.invoke(
    'getTargetUsers'
  )) as ITargetUsers

  tableData.value = Object.values(recordTargets.targets)
}

const fetchUsers = async (): Promise<GetUsersResponse[]> => {
  const usersList = Array.from(new Set(input.value.trim().split(';')))

  if (usersList.length === 0) return []

  const id: string[] = []

  const login: string[] = []

  const isNumber = new RegExp('^[0-9]+$')

  for (let user of usersList) {
    if (isNumber.test(user)) id.push(user)
    else login.push(user)
  }

  const params: TwitchGetUsersParams = { id, login }

  if (id.length === 0) delete params.id

  if (login.length === 0) delete params.login

  const response = await getUsers(params)

  return response?.data || []
}

const addUsers = async () => {
  isProcessing.value = true

  try {
    const users = await fetchUsers()

    const result = (await window.ipcRenderer.invoke(
      'addTargetUsers',
      users
    )) as boolean

    input.value = ''

    await fetchTargets()

    const message = result ? 'Add users successfully' : 'Fail to add users'

    Notify.send(message, result)
  } catch (error) {
    console.error(error)

    Notify.warn('Error occur')
  } finally {
    isProcessing.value = false
  }
}

// TODO:Search Data、Enable Notify、Enable Record

// Edit Data
const handleOpenDialog = (index: number, row: ITargetUser) => {
  dialogData.value = JSON.parse(JSON.stringify(row))

  editDialogVisible.value = true
}

/** Update users selected */
const handleMultiEditStatus = (payload: {
  isEnableMultiEdit: boolean
  usersSelected: ITargetUser[]
}) => {
  isMultiEdit.value = payload.isEnableMultiEdit

  usersToUpdate.value = payload.usersSelected
}

const handleMultiEdit = async (payload: SettingToUpdate) => {
  if (usersToUpdate.value.length === 0) return

  const updateData = usersToUpdate.value.map((user) => {
    user.recordSetting = Object.assign(user.recordSetting, payload)

    return JSON.parse(JSON.stringify(user)) as ITargetUser
  })

  await editUsers(updateData)
}

/**
 * must send pure js object or get error
 * @see https://github.com/electron/electron/issues/26338
 * */
const handleEditData = async (value: ITargetUser) => {
  try {
    const cloneData = JSON.parse(JSON.stringify(value)) as ITargetUser

    await editUsers([cloneData])
  } catch (error) {
    console.error(error)

    Notify.warn('Error occur')
  }
}

const editUsers = async (value: ITargetUser[]) => {
  try {
    const result = (await window.ipcRenderer.invoke(
      'editTargetUsers',
      value
    )) as boolean

    const message = result ? 'Edit users successfully' : 'Fail to edit users'

    Notify.send(message, result)

    if (result) await fetchTargets()
  } catch (error) {
    console.error(error)

    Notify.warn('Error occur when editing users')
  }
}

const deleteUsers = async (value: ITargetUser[]) => {
  try {
    if (value.length === 0) return false

    const ids = value.map((user) => user.id)

    const result = (await window.ipcRenderer.invoke(
      'deleteTargetUsers',
      ids
    )) as boolean

    const message = result
      ? 'Delete users successfully'
      : 'Fail to delete users'

    Notify.send(message, result)

    if (result) await fetchTargets()

    return result
  } catch (error) {
    console.error(error)

    Notify.warn('Error occur when deleting users')

    return false
  }
}

const bulkDeleteUsers = async () => {
  const title = 'WARNING'

  const text = 'Data of users will be deleted permanently. Continue?'

  try {
    await ElMessageBox.confirm(text, title, {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })

    const res = await deleteUsers(usersToUpdate.value)

    if (res) {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })

      const deleteList = usersToUpdate.value.map((user) => user.id)

      tableData.value = tableData.value.filter(
        (user) => !deleteList.includes(user.id)
      )

      usersToUpdate.value = []
    } else {
      ElMessage({
        type: 'warning',
        message: 'Delete failed',
      })
    }
  } catch {
    ElMessage({
      type: 'info',
      message: 'Delete canceled',
    })
  }
}

onMounted(fetchTargets)
</script>

<style>
.onlineFollow {
  font-family: 'Poppins', sans-serif;
}
</style>
