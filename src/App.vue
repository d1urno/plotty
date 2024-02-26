<script setup lang="ts">
import AppToastList from '@/components/AppToastList.vue'
import AppModal from '@/components/AppModal.vue'
</script>

<template>
  <div class="min-h-screen min-w-full bg-gray-100 font-sans text-sm antialiased">
    <router-view />
    <AppModal />
    <AppToastList />
  </div>
</template>
