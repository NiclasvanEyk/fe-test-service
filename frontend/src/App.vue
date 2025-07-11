<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { client } from './lib/api';

const state = reactive({
  logs: ([] as string[]),
  hasError: false,
  isLoading: false,
 });

async function loadLogs() {
  state.isLoading = true;
  state.hasError = false;
  try {
    const { data, error } = await client.GET("/v1/logs");
    if (data && data.lines) {
      state.hasError = false;
      state.logs = data.lines;
      return
    }

    if (error) {
      state.hasError = true;
    }
  } catch (error) {
    state.hasError = true;
  } finally {
    state.isLoading = false;
  }
}

onMounted(loadLogs);
</script>

<template>
  <div class="h-screen w-screen flex place-content-center flex-wrap flex-col gap-16 dark:text-white dark:bg-black">
    <h1 class="font-mono text-5xl font-black text-center">LOGS</h1>

    <div
      class="h-1/2 w-3/4 overflow-scroll flex flex-col border-2 dark:border-white p-2"
      :class="{'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100': state.hasError}"
    >
      <span
        v-if="!state.hasError"
        v-for="line in state.logs"
        class="font-mono whitespace-pre text-sm"
      >
        {{ line }}
      </span>
      <div v-else class="flex flex-col gap-6 bg-red h-full w-full flex-wrap place-content-center">
        Something went wrong!
        <button class="px-4 py-2 bg-red-200 dark:bg-red-800 rounded" v-on:click="loadLogs">try again</button>
      </div>
    </div>
  </div>
</template>
