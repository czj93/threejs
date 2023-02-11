<template>
  <div ref="wrap"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { render } from './main'

const wrap = ref();

onMounted(() => {
  render(wrap.value)
})

</script>

<style>

</style>