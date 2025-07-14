<script setup lang="ts">
import { computed } from "vue";
import { type LogLine } from "../lib/logs";
import { generateSegments } from "../lib/log-line-segmentation";
const { line } = defineProps<{ line: LogLine }>();

const segments = computed(() => {
  const matches = line.matches;
  if (!matches) return null;

  // We'll only every have one match, since we only search one key.
  const firstMatch = matches[0]!;

  return generateSegments(line.text, firstMatch.indices);
});
</script>

<template>
  <span v-if="segments === null">
    {{ line.text }}
  </span>
  <span v-else>
    <template v-for="segment of segments">
      <template v-if="!segment.highlighted">{{ segment.text }}</template>
      <mark v-else>{{ segment.text }}</mark>
    </template>
  </span>
</template>
