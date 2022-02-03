<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { userStore } from './store/user';
import { getUserInfo } from './util/twitchAPI_renderer'

onMounted(async () => {
  const personalStore = userStore()

  const res = await getUserInfo()

  if (res?.data) {
    personalStore.userTwitchID = res.data.sub
  }

  console.log(personalStore)
})
</script>

<template>
  <router-view />
</template>
