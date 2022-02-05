<template>
  <div class="main grid grid-cols-[min-content,1fr] h-screen">
    <Menu />
    <div class="pageContent flex-grow relative">
      <div class="content absolute inset-0">
        <router-view w="full" h="full" p="2" />
      </div>
    </div>
  </div>
</template>