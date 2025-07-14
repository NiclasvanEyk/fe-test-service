import { expect, test as testBase, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { setupWorker, type SetupWorker } from "msw/browser";
import type { components } from "./lib/api/v1.d.ts";
import { render } from "vitest-browser-vue";
import App from "./App.vue";
import VueVirtualScroller from "vue-virtual-scroller";
import { userEvent } from "@vitest/browser/context";

const worker = setupWorker();

type ListResponse = components["schemas"]["ListResponse"];

// See https://mswjs.io/docs/recipes/vitest-browser-mode
export const test = testBase.extend({
  worker: [
    async ({}, use) => {
      // Start the worker before the test.
      await worker.start();

      // Expose the worker object on the test's context.
      await use(worker);

      // Remove any request handlers added in individual test cases.
      // This prevents them from affecting unrelated tests.
      worker.resetHandlers();
    },
    {
      auto: true,
    },
  ],
});

test("Can load and search through logs", async ({ worker }) => {
  (worker as SetupWorker).use(
    http.get("/api/v1/logs", () =>
      HttpResponse.json({
        lines: ["first", "second", "third"],
      } satisfies ListResponse)
    )
  );

  const { getByRole, getByText } = render(App, {
    global: {
      plugins: [VueVirtualScroller],
    },
  });

  // Verify that we see all loglines
  await vi.waitFor(async () => {
    expect(getByText("first")).toHaveAttribute("aria-hidden", "false");
    expect(getByText("second")).toHaveAttribute("aria-hidden", "false");
    expect(getByText("third")).toHaveAttribute("aria-hidden", "false");
  });

  // Search for the first entry
  await userEvent.type(getByRole("searchbox"), "first");

  // And we should see only that entry
  expect(getByText("first")).not.toHaveAttribute("aria-hidden", "true");
  expect(getByText("second")).toHaveAttribute("aria-hidden", "true");
  expect(getByText("third")).toHaveAttribute("aria-hidden", "true");
});

test("Gracefully handles errors", async ({ worker }) => {
  let returnedError = false;
  (worker as SetupWorker).use(
    http.get("/api/v1/logs", () => {
      if (!returnedError) {
        returnedError = true;
        return HttpResponse.json({}, { status: 500 });
      }

      return HttpResponse.json({ lines: ["first"] } satisfies ListResponse);
    })
  );

  const { getByText } = render(App, {
    global: {
      plugins: [VueVirtualScroller],
    },
  });

  await vi.waitFor(async () => {
    expect(getByText("Something went wrong!")).toBeInTheDocument();
  });

  await userEvent.click(getByText("try again"));

  await vi.waitFor(async () => {
    expect(getByText("first")).toHaveAttribute("aria-hidden", "false");
  });
});
