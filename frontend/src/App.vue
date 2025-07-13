<script setup lang="ts">
import { computed, ref } from "vue";
import { useLogs, useLogSearch } from "./lib/logs";
import LogLine from "./components/LogLine.vue";

const { logs: rawLogs, hasError, loadLogs } = useLogs();
const fuzzy = ref(true);
const {
  query,
  matches: matchingLogs,
  isSearching,
} = useLogSearch(rawLogs, fuzzy);
const logs = computed(() => (isSearching.value ? matchingLogs : rawLogs));
</script>

<template>
  <div
    class="h-screen w-screen flex place-content-center flex-wrap flex-col gap-16 dark:text-white dark:bg-black"
  >
    <h1 class="font-mono text-5xl font-black text-center">LOGS</h1>

    <div class="flex flex-row gap-8 items-center">
      <label for="logs-search-input">
        <input
          class="border-2 p-2 dark:border-white"
          type="text"
          id="logs-search-input"
          v-model="query"
        />
      </label>

      <label for="fuzzy-checkbox">
        Fuzzy
        <input type="checkbox" v-model="fuzzy" />
      </label>
    </div>

    <div
      class="h-1/2 w-3/4 overflow-scroll flex flex-col border-2 dark:border-white"
      :class="{
        'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100': hasError,
      }"
    >
      <RecycleScroller
        :items="logs.value"
        :itemSize="24"
        key-field="index"
        v-slot="{ item }"
        class="h-full w-full p-2"
      >
        <LogLine
          :line="item"
          class="font-mono h-12 w-full whitespace-pre text-sm"
        />
      </RecycleScroller>

      <div
        v-if="hasError"
        class="flex flex-col gap-6 bg-red h-full w-full flex-wrap place-content-center"
      >
        Something went wrong!
        <button
          class="px-4 py-2 bg-red-200 dark:bg-red-800 rounded"
          v-on:click="loadLogs"
        >
          try again
        </button>
      </div>
    </div>
  </div>
</template>
