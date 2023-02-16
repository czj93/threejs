<template>
  <div ref="wrap"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { render, destroy } from './main'

const wrap = ref();

onMounted(() => {
  render(wrap.value)
})

onUnmounted(() => {
  destroy()
})

</script>

<style>

</style>