import createClient from "openapi-fetch";
import type { paths } from "./v1";

export const client = createClient<paths>({ baseUrl: "/api" });

if (import.meta.env.DEV) {
  client.use({
    async onRequest({ request, options }) {
      // Simulates failures when in dev
      if (Math.random() > 0.8) {
        await new Promise((resolve) => setTimeout(resolve, 1_000));
        throw new Error("Test");
      }
      return request;
    },
  });
}
