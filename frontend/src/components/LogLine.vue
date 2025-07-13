<script setup lang="ts">
import { computed } from "vue";
import { type LogLine } from "../lib/logs";
const { line } = defineProps<{ line: LogLine }>();

interface Segment {
  highlighted: boolean;
  text: string;
}

function generateSegments(
  text: string,
  regions: ReadonlyArray<[number, number]>
): Segment[] {
  const sortedRegions = [...regions].sort((a, b) => a[0] - b[0]);

  const segments: Segment[] = [];
  let cursor = 0;

  for (const [start, end] of sortedRegions) {
    if (start > cursor) {
      segments.push({
        highlighted: false,
        text: text.slice(cursor, start),
      });
    }

    segments.push({
      highlighted: true,
      text: text.slice(start, end + 1),
    });

    cursor = end + 1;
  }

  if (cursor < text.length) {
    segments.push({
      highlighted: false,
      text: text.slice(cursor),
    });
  }

  return segments;
}

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
