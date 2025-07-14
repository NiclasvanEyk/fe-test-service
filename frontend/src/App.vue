<script setup lang="ts">
import { computed, ref } from "vue";
import { useLogs, useLogSearch } from "./lib/logs";
import LogLine from "./components/LogLine.vue";

const { logs: rawLogs, hasError, loadLogs } = useLogs();
const fuzzy = ref(false);
const toggleFuzzySearch = () => (fuzzy.value = !fuzzy.value);

const {
  query,
  matches: matchingLogs,
  isSearching,
} = useLogSearch(rawLogs, fuzzy);
const logs = computed(() => (isSearching.value ? matchingLogs : rawLogs));
</script>

<template>
  <div
    class="min-h-screen w-screen flex place-content-center flex-wrap gap-4 flex-col dark:text-white dark:bg-black"
  >
    <h1 class="text-5xl mb-8 font-black text-center">Logs</h1>

    <div
      class="flex flex-row gap-8 items-center rounded bg-white dark:bg-gray-800"
    >
      <div class="w-full relative">
        <input
          class="p-2 dark:border-white w-full"
          type="text"
          role="searchbox"
          placeholder="Search"
          id="logs-search-input"
          v-model="query"
        />

        <div
          class="absolute right-2 top-1/2 -translate-y-1/2 flex flex-row items-center gap-2"
        >
          <span class="opacity-50"
            >{{ logs.value.length }} / {{ rawLogs.length }}</span
          >

          <!-- Note: This icon would probably need a proper tooltip -->
          <label
            for="fuzzy-checkbox"
            class="select-none"
            tabindex="0"
            @keyup.self.enter="toggleFuzzySearch"
            @keyup.self.space="toggleFuzzySearch"
            :class="{ 'opacity-50': !fuzzy }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              title="Fuzzy Search"
              viewBox="0 0 16 16"
            >
              j
              <!-- Icon from Codicons by Microsoft Corporation - https://github.com/microsoft/vscode-codicons/blob/main/LICENSE -->
              <path
                fill="currentColor"
                d="M8 1.5a4.5 4.5 0 0 0-3.263 7.6l-3.694 3.694l.707.707l3.755-3.755A4.5 4.5 0 1 0 8 1.5M4.5 6a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0M9 13.855L6.854 16h-.708l-1.5-1.5l.708-.707L6.5 14.94l2.146-2.146h.708L11.5 14.94l2.146-2.146h.707L16 14.44v1.415l-2-2L11.854 16h-.708z"
              />
            </svg>
            <input
              type="checkbox"
              id="fuzzy-checkbox"
              class="hidden"
              v-model="fuzzy"
            />
            <span class="hidden">Fuzzy</span>
          </label>
        </div>
      </div>
    </div>

    <div
      class="h-80 w-3/4 overflow-scroll flex flex-col rounded bg-white dark:bg-gray-800 relative"
      :class="{
        'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100': hasError,
      }"
    >
      <RecycleScroller
        :items="logs.value"
        :itemSize="24"
        key-field="index"
        v-slot="{ item, active }"
        class="h-full w-full p-2"
      >
        <LogLine
          :line="item"
          class="font-mono h-12 w-full whitespace-pre text-sm"
          data-test-id="log-line"
          :aria-hidden="!active"
        />
      </RecycleScroller>

      <div
        v-if="hasError"
        class="absolute inset-0 flex flex-col gap-6 bg-red flex-wrap place-content-center"
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
