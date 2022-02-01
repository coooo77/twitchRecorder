<template>
  <div class="menu flex flex-col gap-2" border="r-gray-200 r-1">
    <el-button
      size="large"
      :type="isCollapse ? 'primary' : 'info'"
      @click="isCollapse = !isCollapse"
    >
      <el-icon color="primary" :size="24">
        <Expand />
      </el-icon>
    </el-button>

    <el-menu
      border="!none"
      :default-active="routesForMenu[0].meta?.name"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :router="true"
    >
      <el-menu-item v-for="item of routesForMenu" :index="item.meta?.name">
        <el-icon>
          <Icon :icon="item.meta?.icon" />
        </el-icon>
        <template #title>{{ item.meta?.title }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import routesForMenu from '../../router/routes'
import { Expand } from '@element-plus/icons-vue'

const isCollapse = ref(true)
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
