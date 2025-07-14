import { computed, type Ref, onMounted, ref } from "vue";
import { client } from "./api";
import Fuse, { type FuseResultMatch } from "fuse.js";

export interface LogLine {
  index: number;
  text: string;
  matches?: ReadonlyArray<FuseResultMatch>;
}

function repeatedArray<T>(arr: T[], times: number): T[] {
  const repeated = [...arr];
  for (let i = 0; i < times; i++) {
    repeated.push(...arr);
  }
  return repeated;
}

export function useLogs() {
  const logs = ref([] as LogLine[]);
  const hasError = ref(false);
  const isLoading = ref(false);

  async function loadLogs() {
    isLoading.value = true;
    hasError.value = false;
    try {
      const { data, error } = await client.GET("/v1/logs");
      if (data && data.lines) {
        hasError.value = false;
        // Increase this to simluate more data being returned
        logs.value = repeatedArray(data.lines, 0).map((text, index) => ({
          text,
          index,
        }));
        return;
      }

      if (error) {
        hasError.value = true;
      }
    } catch (error) {
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  }
  onMounted(loadLogs);

  return { logs, loadLogs, hasError, isLoading };
}

export function useLogSearch(logs: Ref<LogLine[]>, fuzzy: Ref<boolean>) {
  const query = ref("");
  const fuse = computed(
    () =>
      new Fuse(logs.value, {
        keys: ["text"],
        includeMatches: true,
        shouldSort: false,
        includeScore: true,
      })
  );
  const isSearching = computed(() => query.value !== "");
  const matches = computed(() => {
    if (import.meta.env.DEV) console.time(`search[${query.value}]`);
    let results = fuse.value.search(query.value);
    if (import.meta.env.DEV) console.timeEnd(`search[${query.value}]`);

    if (!fuzzy.value) {
      results = results.filter((r) => {
        return r.item.text.includes(query.value);
      });
    }

    return results.map((result) => {
      const matches = result.matches;
      if (!fuzzy.value) {
        matches?.forEach((match) => {
          match.indices = match.indices.filter(
            ([begin, end]) => end - begin === query.value.length - 1
          );
        });
      }

      return {
        text: result.item.text,
        index: result.refIndex,
        matches,
      };
    });
  });

  return { query, fuse, isSearching, matches };
}
