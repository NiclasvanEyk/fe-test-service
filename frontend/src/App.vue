<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { client } from './lib/api';

const state = reactive({ logs: ([] as string[]) });

onMounted(async () => {
  const { data, error } = await client.GET("/v1/logs");
  if (data && data.lines) {
    state.logs = data.lines;
  } else {
    // TODO: show toast or something
    console.error(error);
  }
})
</script>

<template>
  <div class="h-screen w-screen flex place-content-center flex-wrap flex-col gap-16 dark:text-white dark:bg-black">
    <h1 class="font-mono text-5xl font-black text-center">LOGS</h1>

    <div class="h-1/2 w-3/4 overflow-scroll flex flex-col border-2 dark:border-white p-2">
      <span class="font-mono whitespace-pre text-sm" v-for="line in state.logs">
        {{ line }}
      </span>
    </div>
  </div>
</template>
