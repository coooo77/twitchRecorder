<template>
  <div class="onlineFollow">
    <header>
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
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getUsers, GetUsersResponse, TwitchGetUsersParams } from '../util/twitchAPI_renderer';

const isProcessing = ref(false)

const input = ref('')

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

    const result = await window.ipcRenderer.invoke('addTargetUsers', users) as boolean

    input.value = ''

    ElNotification({
      type: result ? 'success' : 'error',
      title: result ? 'Success' : 'Fail',
      message: result ? 'Add users successfully' : 'Fail to add users',
    })
  } catch (error) {
    console.error(error)

    ElNotification({
      type: 'error',
      title: 'Fail',
      message: 'Error occur.',
    })
  } finally {
    isProcessing.value = false
  }
}
</script>